const express = require("express");
const cors = require("cors");
const https = require("https");
const http = require("http");
const { URL } = require("url");
require("dotenv").config();

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Spotify credentials from .env
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Image cache in memory
const imageCache = new Map();
let spotifyAccessToken = null;
let tokenExpireTime = 0;

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend server is running" });
});

// Get Spotify Access Token using Client Credentials Flow
async function getSpotifyToken() {
  try {
    // Check if token is still valid
    if (spotifyAccessToken && Date.now() < tokenExpireTime) {
      return spotifyAccessToken;
    }

    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      "base64"
    );

    return new Promise((resolve, reject) => {
      const options = {
        hostname: "accounts.spotify.com",
        path: "/api/token",
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };

      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const response = JSON.parse(data);
            spotifyAccessToken = response.access_token;
            tokenExpireTime = Date.now() + response.expires_in * 1000;
            console.log("✅ Spotify token obtained");
            resolve(response.access_token);
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on("error", reject);
      req.write("grant_type=client_credentials");
      req.end();
    });
  } catch (error) {
    console.error("❌ Error getting Spotify token:", error.message);
    throw error;
  }
}

// Search for a track on Spotify and get album art
app.get("/api/track-image", async (req, res) => {
  try {
    const { trackName, artistName } = req.query;

    if (!trackName || !artistName) {
      return res.status(400).json({ error: "Missing trackName or artistName" });
    }

    // Get access token
    const token = await getSpotifyToken();

    // Search for track
    const searchQuery = encodeURIComponent(`${trackName} artist:${artistName}`);
    const searchUrl = `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=1`;

    return new Promise((resolve) => {
      https
        .get(
          searchUrl,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          (searchRes) => {
            let data = "";
            searchRes.on("data", (chunk) => (data += chunk));
            searchRes.on("end", () => {
              try {
                const result = JSON.parse(data);

                if (result.tracks.items.length === 0) {
                  return resolve(
                    res.status(404).json({ error: "Track not found" })
                  );
                }

                const track = result.tracks.items[0];
                const imageUrl = track.album.images[0]?.url;

                if (!imageUrl) {
                  return resolve(
                    res.status(404).json({ error: "No image found" })
                  );
                }

                res.json({
                  trackId: track.id,
                  trackName: track.name,
                  artist: track.artists[0].name,
                  album: track.album.name,
                  imageUrl: imageUrl,
                  previewUrl: track.preview_url,
                });
                resolve();
              } catch (error) {
                console.error("Error parsing Spotify response:", error);
                resolve(
                  res.status(500).json({ error: "Error parsing response" })
                );
              }
            });
          }
        )
        .on("error", (error) => {
          console.error("Error searching Spotify:", error);
          resolve(res.status(500).json({ error: "Error searching Spotify" }));
        });
    });
  } catch (error) {
    console.error("❌ API Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Proxy image endpoint (fallback for direct URLs)
app.get("/api/image", (req, res) => {
  try {
    const imageUrl = req.query.url;

    if (!imageUrl) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    // Validate it's a Spotify image URL
    if (!imageUrl.includes("i.scdn.co")) {
      return res.status(400).json({ error: "Only Spotify images allowed" });
    }

    // Check cache first
    if (imageCache.has(imageUrl)) {
      const cachedData = imageCache.get(imageUrl);
      res.set("Content-Type", "image/jpeg");
      res.set("Cache-Control", "public, max-age=31536000");
      return res.send(cachedData);
    }

    const url = new URL(imageUrl);
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
    };

    const protocol = url.protocol === "https:" ? https : http;
    let responseHandled = false;

    const request = protocol.get(
      { hostname: url.hostname, path: url.pathname + url.search, headers },
      (imageRes) => {
        if (imageRes.statusCode !== 200) {
          console.error(`⚠️  Spotify returned status: ${imageRes.statusCode}`);
          responseHandled = true;
          res.status(imageRes.statusCode).json({
            error: `Failed to fetch image (${imageRes.statusCode})`,
          });
          return;
        }

        const chunks = [];
        imageRes.on("data", (chunk) => chunks.push(chunk));
        imageRes.on("end", () => {
          if (responseHandled) return;
          responseHandled = true;

          try {
            const imageBuffer = Buffer.concat(chunks);
            imageCache.set(imageUrl, imageBuffer);
            res.set(
              "Content-Type",
              imageRes.headers["content-type"] || "image/jpeg"
            );
            res.set("Cache-Control", "public, max-age=31536000");
            res.send(imageBuffer);
          } catch (error) {
            console.error("Error processing image:", error.message);
            if (!res.headersSent) {
              res.status(500).json({ error: "Error processing image" });
            }
          }
        });
      }
    );

    request.on("error", (error) => {
      if (responseHandled) return;
      responseHandled = true;
      console.error("❌ Request error:", error.message);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to fetch image" });
      }
    });

    request.setTimeout(10000, () => {
      if (responseHandled) return;
      responseHandled = true;
      request.abort();
      if (!res.headersSent) {
        res.status(504).json({ error: "Request timeout" });
      }
    });
  } catch (error) {
    console.error("Proxy error:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(
    `🔍 Track search available at: /api/track-image?trackName=<name>&artistName=<artist>`
  );
  console.log(`🖼️  Image proxy available at: /api/image?url=<spotify_url>`);
  console.log(`🏥 Health check: /health`);
});

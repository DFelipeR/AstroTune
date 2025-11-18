const fs = require("fs");
const path = require("path");
const https = require("https");
const trackList = require("./trackList.js");

// Spotify credentials
const CLIENT_ID = "1c3c8225ce2a4844a5de91add1579a19";
const CLIENT_SECRET = "a9e2de23ad6f4deea16ec6e8a2141a97";

// Get Spotify access token
async function getSpotifyToken() {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      "base64"
    );
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
          const json = JSON.parse(data);
          resolve(json.access_token);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", reject);
    req.write("grant_type=client_credentials");
    req.end();
  });
}

// Search track on Spotify
async function searchSpotifyTrack(trackName, token) {
  return new Promise((resolve, reject) => {
    const query = encodeURIComponent(trackName);
    const options = {
      hostname: "api.spotify.com",
      path: `/v1/search?q=${query}&type=track&limit=1`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json.tracks && json.tracks.items && json.tracks.items[0]) {
            const track = json.tracks.items[0];
            resolve({
              name: track.name,
              artist: track.artists[0]?.name || "Unknown",
              album: track.album?.name || "Unknown",
              duration: Math.floor(track.duration_ms / 1000),
              imageUrl:
                track.album?.images[0]?.url ||
                "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
            });
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", reject);
    req.end();
  });
}

// Main function
async function main() {
  console.log("🎵 AstroTune MP3 Metadata Detector - Using Manual Track List\n");

  const files = [];
  for (let i = 1; i <= 50; i++) {
    files.push(`track_${i}.mp3`);
  }

  console.log(`Processing ${files.length} tracks\n`);
  console.log("Getting Spotify token...");

  try {
    const token = await getSpotifyToken();
    console.log("✅ Token obtained\n");

    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const trackNum = i + 1;

      // Get track info from our manual list
      const trackInfo = trackList[trackNum];

      if (!trackInfo) {
        console.log(`[${trackNum}/50] ${file} - ⚠️  No entry in trackList`);
        results.push({
          id: trackNum,
          filename: file,
          name: `Unknown Track ${trackNum}`,
          artist: "Unknown",
          album: "Unknown",
          duration: 200,
          previewUrl: `/audio/${file}`,
          imageUrl:
            "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
        });
        continue;
      }

      console.log(`[${trackNum}/50] ${file} - Searching: "${trackInfo}"`);

      try {
        // Search for the track using the full info or just the song name
        let spotifyData = await searchSpotifyTrack(trackInfo, token);

        if (!spotifyData) {
          // Try searching with just the song name (after the dash)
          const parts = trackInfo.split(" - ");
          if (parts.length >= 2) {
            const songName = parts[1];
            spotifyData = await searchSpotifyTrack(songName, token);
          }
        }

        if (spotifyData) {
          console.log(
            `  ✅ Found: "${spotifyData.name}" by ${spotifyData.artist}`
          );
        } else {
          console.log(`  ⚠️  Not found on Spotify, using fallback`);
          const parts = trackInfo.split(" - ");
          spotifyData = {
            name: parts[1] || `Track ${trackNum}`,
            artist: parts[0] || "Unknown Artist",
            album: parts[2] || "Unknown Album",
            duration: 200,
            imageUrl:
              "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
          };
        }

        results.push({
          id: trackNum,
          filename: file,
          ...spotifyData,
          previewUrl: `/audio/${file}`,
        });

        // Add delay to avoid rate limiting
        await new Promise((r) => setTimeout(r, 300));
      } catch (err) {
        console.log(`  ❌ Error: ${err.message}`);
        const parts = trackInfo.split(" - ");
        results.push({
          id: trackNum,
          filename: file,
          name: parts[1] || `Track ${trackNum}`,
          artist: parts[0] || "Unknown",
          album: parts[2] || "Unknown",
          duration: 200,
          previewUrl: `/audio/${file}`,
          imageUrl:
            "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
        });
      }
    }

    console.log("\n📋 RESULTS:\n");
    console.log("Generated mockTracks.js code:\n");
    console.log("// Real tracks from Spotify API");
    console.log("export const mockTracks = [");

    results.forEach((track) => {
      console.log(`  {`);
      console.log(`    id: "${track.id}",`);
      console.log(`    name: "${track.name.replace(/"/g, '\\"')}",`);
      console.log(`    artist: "${track.artist.replace(/"/g, '\\"')}",`);
      console.log(`    album: "${track.album.replace(/"/g, '\\"')}",`);
      console.log(`    duration: ${track.duration},`);
      console.log(`    previewUrl: "${track.previewUrl}",`);
      console.log(`    imageUrl: "${track.imageUrl}",`);
      console.log(`  },`);
    });

    console.log("];");

    // Also create a CSV for easy reference
    console.log("\n\n📊 CSV Format:\n");
    console.log("ID,Filename,Name,Artist,Album,Duration,PreviewUrl,ImageUrl");
    results.forEach((track) => {
      console.log(
        `${track.id},"${track.filename}","${track.name}","${track.artist}","${track.album}",${track.duration},"${track.previewUrl}","${track.imageUrl}"`
      );
    });
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

main();

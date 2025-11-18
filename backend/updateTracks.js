// Script para obtener datos reales de Spotify
// Ejecutar: node updateTracks.js

require("dotenv").config();
const https = require("https");

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Canciones a buscar (nombre exacta como aparecen en Spotify)
const tracksToSearch = [
  { name: "Blinding Lights", artist: "The Weeknd" },
  { name: "Heat Waves", artist: "Glass Animals" },
  { name: "Levitating", artist: "Dua Lipa" },
  { name: "Don't Start Now", artist: "Dua Lipa" },
  { name: "Peaches", artist: "Justin Bieber" },
  { name: "As It Was", artist: "Harry Styles" },
  { name: "Good as Hell", artist: "Lizzo" },
  { name: "Industry Baby", artist: "Lil Nas X" },
  { name: "Shape of You", artist: "Ed Sheeran" },
  { name: "Taste", artist: "Sabrina Carpenter" },
  { name: "Vampire", artist: "Olivia Rodrigo" },
  { name: "drivers license", artist: "Olivia Rodrigo" },
  { name: "Anti-Hero", artist: "Taylor Swift" },
  { name: "Cruel Summer", artist: "Taylor Swift" },
  { name: "Say So", artist: "Doja Cat" },
  { name: "Break My Heart", artist: "Dua Lipa" },
  { name: "Watermelon Sugar", artist: "Harry Styles" },
  { name: "Dance the Night", artist: "Dua Lipa" },
  { name: "Believer", artist: "Imagine Dragons" },
  { name: "Someone You Loved", artist: "Lewis Capaldi" },
  { name: "Midnight Rain", artist: "Taylor Swift" },
  { name: "Stayin' Alive", artist: "Bee Gees" },
  { name: "One Dance", artist: "Drake" },
  { name: "Dynamite", artist: "BTS" },
  { name: "Butter", artist: "BTS" },
  { name: "Permission to Dance", artist: "BTS" },
  { name: "Jumpsuit", artist: "Twenty One Pilots" },
  { name: "American Idiot", artist: "Green Day" },
  { name: "Blind", artist: "Korn" },
  { name: "Bohemian Rhapsody", artist: "Queen" },
];

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
        const response = JSON.parse(data);
        resolve(response.access_token);
      });
    });

    req.on("error", reject);
    req.write("grant_type=client_credentials");
    req.end();
  });
}

async function searchTrack(token, trackName, artistName) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(`${trackName} artist:${artistName}`);
    const url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`;

    https
      .get(
        url,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              const result = JSON.parse(data);
              if (result.tracks.items.length > 0) {
                const track = result.tracks.items[0];
                resolve({
                  name: track.name,
                  artist: track.artists[0].name,
                  album: track.album.name,
                  duration: Math.round(track.duration_ms / 1000),
                  imageUrl: track.album.images[0]?.url || null,
                  previewUrl: track.preview_url,
                });
              } else {
                resolve(null);
              }
            } catch (error) {
              console.error("Error parsing:", error);
              resolve(null);
            }
          });
        }
      )
      .on("error", () => resolve(null));
  });
}

async function main() {
  console.log("Obteniendo datos de Spotify...");
  const token = await getSpotifyToken();
  console.log("Token obtenido ✓");

  const results = [];
  for (let i = 0; i < tracksToSearch.length; i++) {
    const { name, artist } = tracksToSearch[i];
    console.log(
      `Buscando ${i + 1}/${tracksToSearch.length}: ${name} - ${artist}`
    );
    const data = await searchTrack(token, name, artist);
    if (data) {
      results.push(data);
    }
    // Pequeño delay para no saturar API
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Generar código para mockTracks.js
  const code = `// Real songs from Spotify - Data fetched from Spotify API
export const mockTracks = [
${results
  .map(
    (track, i) => `  {
    id: "${i + 1}",
    name: "${track.name.replace(/"/g, '\\"')}",
    artist: "${track.artist.replace(/"/g, '\\"')}",
    album: "${track.album.replace(/"/g, '\\"')}",
    duration: ${track.duration},
    previewUrl: "/audio/track_${i + 1}.mp3",
    imageUrl: "${track.imageUrl || ""}",
  },`
  )
  .join("\n")}
];
`;

  console.log("\nCódigo generado para mockTracks.js:\n");
  console.log(code);
}

main().catch(console.error);

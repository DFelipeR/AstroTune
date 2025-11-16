import { createClient } from "@vercel/kv";

// Initialize KV store for persistent data
const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// Helper to read all playlists
async function readPlaylists() {
  try {
    const data = await kv.get("playlists");
    return data || {};
  } catch (error) {
    console.error("Error reading playlists:", error);
    return {};
  }
}

// Helper to save playlists
async function savePlaylists(data) {
  try {
    await kv.set("playlists", data);
  } catch (error) {
    console.error("Error saving playlists:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { name } = req.query;

  try {
    if (req.method === "GET") {
      if (name) {
        // GET /api/playlists/:name
        const playlists = await readPlaylists();
        const playlist = playlists[name];

        if (!playlist) {
          return res.status(404).json({ error: "Playlist not found" });
        }

        return res.status(200).json(playlist);
      } else {
        // GET /api/playlists
        const playlists = await readPlaylists();
        return res.status(200).json(playlists);
      }
    }

    if (req.method === "POST") {
      // POST /api/playlists
      const { name: playlistName, tracks } = req.body;

      if (!playlistName || !Array.isArray(tracks)) {
        return res.status(400).json({ error: "Name and tracks required" });
      }

      const playlists = await readPlaylists();

      if (playlists[playlistName]) {
        return res.status(400).json({ error: "Playlist already exists" });
      }

      playlists[playlistName] = {
        name: playlistName,
        tracks,
        createdAt: new Date().toISOString(),
      };

      await savePlaylists(playlists);
      return res.status(201).json(playlists[playlistName]);
    }

    if (req.method === "PUT") {
      // PUT /api/playlists/:name
      if (!name) {
        return res.status(400).json({ error: "Playlist name required" });
      }

      const { tracks } = req.body;

      if (!Array.isArray(tracks)) {
        return res.status(400).json({ error: "Tracks must be an array" });
      }

      const playlists = await readPlaylists();

      if (!playlists[name]) {
        return res.status(404).json({ error: "Playlist not found" });
      }

      playlists[name].tracks = tracks;
      playlists[name].updatedAt = new Date().toISOString();

      await savePlaylists(playlists);
      return res.status(200).json(playlists[name]);
    }

    if (req.method === "DELETE") {
      // DELETE /api/playlists/:name
      if (!name) {
        return res.status(400).json({ error: "Playlist name required" });
      }

      const playlists = await readPlaylists();

      if (!playlists[name]) {
        return res.status(404).json({ error: "Playlist not found" });
      }

      delete playlists[name];
      await savePlaylists(playlists);

      return res.status(200).json({ message: "Playlist deleted" });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

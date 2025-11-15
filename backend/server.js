const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, "data", "playlists.json");

// Helper para leer playlists
const readPlaylists = () => {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(dataFile, "utf-8"));
};

// Helper para guardar playlists
const savePlaylists = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

// GET - Obtener todas las playlists
app.get("/api/playlists", (req, res) => {
  const playlists = readPlaylists();
  res.json(playlists);
});

// GET - Obtener una playlist por nombre
app.get("/api/playlists/:name", (req, res) => {
  const playlists = readPlaylists();
  const playlist = playlists[req.params.name];

  if (!playlist) {
    return res.status(404).json({ error: "Playlist no encontrada" });
  }

  res.json(playlist);
});

// POST - Crear una playlist
app.post("/api/playlists", (req, res) => {
  const { name, tracks } = req.body;

  if (!name || !Array.isArray(tracks)) {
    return res.status(400).json({ error: "Nombre y tracks requeridos" });
  }

  const playlists = readPlaylists();

  if (playlists[name]) {
    return res.status(400).json({ error: "La playlist ya existe" });
  }

  playlists[name] = {
    name,
    tracks,
    createdAt: new Date().toISOString(),
  };

  savePlaylists(playlists);
  res.status(201).json(playlists[name]);
});

// PUT - Actualizar una playlist
app.put("/api/playlists/:name", (req, res) => {
  const { tracks } = req.body;

  if (!Array.isArray(tracks)) {
    return res.status(400).json({ error: "Tracks debe ser un array" });
  }

  const playlists = readPlaylists();

  if (!playlists[req.params.name]) {
    return res.status(404).json({ error: "Playlist no encontrada" });
  }

  playlists[req.params.name].tracks = tracks;
  playlists[req.params.name].updatedAt = new Date().toISOString();

  savePlaylists(playlists);
  res.json(playlists[req.params.name]);
});

// DELETE - Eliminar una playlist
app.delete("/api/playlists/:name", (req, res) => {
  const playlists = readPlaylists();

  if (!playlists[req.params.name]) {
    return res.status(404).json({ error: "Playlist no encontrada" });
  }

  delete playlists[req.params.name];
  savePlaylists(playlists);

  res.json({ message: "Playlist eliminada" });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Backend funcionando", port: PORT });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

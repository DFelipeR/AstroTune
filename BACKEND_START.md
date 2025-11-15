# Iniciando el Backend - Node.js + Express

## Paso 1: Crear la carpeta del Backend

```bash
mkdir backend
cd backend
```

## Paso 2: Inicializar npm

```bash
npm init -y
```

## Paso 3: Instalar dependencias

```bash
npm install express cors
npm install -D nodemon
```

## Paso 4: Crear estructura de carpetas

```bash
mkdir data
```

## Paso 5: Crear el archivo server.js

En la carpeta `backend/`, crea el archivo `server.js`:

```javascript
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

app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
```

## Paso 6: Actualizar package.json

Abre `backend/package.json` y modifica la sección scripts:

```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js"
}
```

## Paso 7: Crear archivo de datos inicial

En `backend/data/playlists.json`:

```json
{}
```

## Paso 8: Ejecutar el servidor

```bash
npm run dev
```

Deberías ver: `Backend escuchando en http://localhost:5000`

## Paso 9: Probar los endpoints

Usa curl o Postman:

```bash
# GET todas las playlists
curl http://localhost:5000/api/playlists

# POST crear playlist
curl -X POST http://localhost:5000/api/playlists \
  -H "Content-Type: application/json" \
  -d '{"name":"Mi Playlist","tracks":[]}'

# GET una playlist
curl http://localhost:5000/api/playlists/Mi%20Playlist

# DELETE una playlist
curl -X DELETE http://localhost:5000/api/playlists/Mi%20Playlist
```

## Paso 10: Conectar React al Backend

En el futuro, cambiarás `playlistStorage.js` para usar fetch:

```javascript
const API_URL = "http://localhost:5000/api/playlists";

// Reemplazar localStorage con fetch calls
const playlistStorage = {
  savePlaylist: async (name, tracks) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, tracks }),
    });
    return response.json();
  },
  // ... más métodos
};
```

---

Esto es todo lo que necesitas para empezar. El backend está listo cuando termines estos pasos.

# 🚀 Backend Rápido para AstroTune - Node.js + Express

## ⚡ OBJETIVO: Backend en 2 HORAS (No extenso, pero funcional)

---

## 📋 ¿QUÉ VAMOS A HACER?

Un servidor simple que:

- ✅ Guarde playlists en un archivo JSON (no BD compleja)
- ✅ Tenga endpoints básicos (CRUD)
- ✅ Se conecte fácil con tu app React
- ✅ Funcione localmente primero
- ✅ Se pueda deployar en 5 minutos

---

## 🎯 ESTRUCTURA

```
astrotune-backend/  (Carpeta nueva)
├── server.js       (Tu servidor)
├── package.json    (Dependencias)
├── data/
│   └── playlists.json  (BD fake)
└── .env            (Variables)
```

---

## 📦 PASO 1: CREAR PROYECTO

```bash
# Crear carpeta
mkdir astrotune-backend
cd astrotune-backend

# Inicializar Node
npm init -y

# Instalar dependencias (3 paquetes nomás)
npm install express cors dotenv
npm install -D nodemon

# Crear archivos
touch server.js .env
mkdir data
```

---

## 🔧 PASO 2: CONFIGURAR server.js

```javascript
// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const PLAYLISTS_FILE = path.join(__dirname, "data", "playlists.json");

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// FUNCIONES AUXILIARES
// ============================================

// Leer playlists del archivo JSON
function readPlaylists() {
  try {
    const data = fs.readFileSync(PLAYLISTS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return {}; // Retornar objeto vacío si no existe
  }
}

// Guardar playlists en archivo JSON
function savePlaylists(data) {
  fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify(data, null, 2));
}

// ============================================
// ENDPOINTS (API)
// ============================================

// GET: Obtener todas las playlists
app.get("/api/playlists", (req, res) => {
  const playlists = readPlaylists();
  res.json(playlists);
});

// GET: Obtener una playlist por ID
app.get("/api/playlists/:id", (req, res) => {
  const playlists = readPlaylists();
  const playlist = playlists[req.params.id];

  if (!playlist) {
    return res.status(404).json({ error: "Playlist no encontrada" });
  }

  res.json(playlist);
});

// POST: Crear nueva playlist
app.post("/api/playlists", (req, res) => {
  const { name, tracks } = req.body;

  if (!name) {
    return res.status(400).json({ error: "El nombre es requerido" });
  }

  const playlists = readPlaylists();
  const id = Date.now().toString(); // ID simple basado en timestamp

  playlists[id] = {
    id,
    name,
    tracks: tracks || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  savePlaylists(playlists);
  res.status(201).json(playlists[id]);
});

// PUT: Actualizar playlist
app.put("/api/playlists/:id", (req, res) => {
  const { name, tracks } = req.body;
  const playlists = readPlaylists();

  if (!playlists[req.params.id]) {
    return res.status(404).json({ error: "Playlist no encontrada" });
  }

  playlists[req.params.id] = {
    ...playlists[req.params.id],
    name: name || playlists[req.params.id].name,
    tracks: tracks || playlists[req.params.id].tracks,
    updatedAt: new Date().toISOString(),
  };

  savePlaylists(playlists);
  res.json(playlists[req.params.id]);
});

// DELETE: Eliminar playlist
app.delete("/api/playlists/:id", (req, res) => {
  const playlists = readPlaylists();

  if (!playlists[req.params.id]) {
    return res.status(404).json({ error: "Playlist no encontrada" });
  }

  delete playlists[req.params.id];
  savePlaylists(playlists);
  res.json({ message: "Playlist eliminada" });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend funcionando ✅" });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 API en http://localhost:${PORT}/api/playlists`);
});
```

---

## ⚙️ PASO 3: package.json

```json
{
  "name": "astrotune-backend",
  "version": "1.0.0",
  "description": "Backend simple para AstroTune",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## 🔐 PASO 4: .env

```
PORT=5000
NODE_ENV=development
```

---

## 📂 PASO 5: data/playlists.json

```json
{
  "1": {
    "id": "1",
    "name": "Mi Primera Playlist",
    "tracks": [
      {
        "id": 1,
        "name": "American Idiot",
        "artist": "Green Day",
        "album": "American Idiot",
        "duration": 180
      }
    ],
    "createdAt": "2025-01-14T10:00:00Z",
    "updatedAt": "2025-01-14T10:00:00Z"
  }
}
```

---

## ✅ PASO 6: PRUEBA EL SERVIDOR

```bash
# Instala dependencias (si no lo hiciste)
npm install

# Inicia el servidor
npm run dev

# Output esperado:
# 🚀 Servidor corriendo en http://localhost:5000
# 📊 API en http://localhost:5000/api/playlists
```

Abre http://localhost:5000/api/health en el navegador.

Deberías ver:

```json
{
  "status": "Backend funcionando ✅"
}
```

---

## 🔌 PASO 7: CONECTAR CON TU APP REACT

Ahora cambias tu App.jsx para usar el backend en lugar de localStorage:

```javascript
// ANTES (localStorage)
savePlaylist(name, tracks) {
  localStorage.setItem("playlists", JSON.stringify({ name, tracks }));
}

// DESPUÉS (Backend)
async savePlaylist(name, tracks) {
  const response = await fetch('http://localhost:5000/api/playlists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, tracks })
  });

  const newPlaylist = await response.json();
  this.setState({
    playlistName: "New Playlist",
    playlistTracks: []
  });
}
```

---

## 📝 TODOS LOS ENDPOINTS

```
GET    /api/playlists           → Obtener todas las playlists
GET    /api/playlists/:id       → Obtener una playlist
POST   /api/playlists           → Crear playlist
PUT    /api/playlists/:id       → Actualizar playlist
DELETE /api/playlists/:id       → Eliminar playlist
GET    /api/health              → Health check
```

---

## 🧪 PRUEBA CON CURL O POSTMAN

### Crear playlist

```bash
curl -X POST http://localhost:5000/api/playlists \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rock Hits",
    "tracks": [
      {"id": 1, "name": "Bohemian Rhapsody", "artist": "Queen"}
    ]
  }'
```

### Obtener todas

```bash
curl http://localhost:5000/api/playlists
```

### Actualizar

```bash
curl -X PUT http://localhost:5000/api/playlists/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Rock Clásico"}'
```

### Eliminar

```bash
curl -X DELETE http://localhost:5000/api/playlists/1
```

---

## 🚀 DEPLOY EN 5 MINUTOS (Render.com - GRATIS)

### 1. Crear cuenta en Render

```
Ir a: https://render.com
Registrarse (puedes usar GitHub)
```

### 2. Crear Web Service

```
Dashboard → New → Web Service
Conectar tu repositorio GitHub
Build command: npm install
Start command: npm start
Environment: production
```

### 3. Variables de entorno

```
PORT = 10000 (Render usa este puerto)
NODE_ENV = production
```

### 4. Deploy

```
Click en "Create Web Service"
Espera 2 minutos
Tu backend está live 🎉
```

URL será algo como: `https://astrotune-backend.onrender.com`

---

## 📱 ACTUALIZAR APP REACT PARA PRODUCCIÓN

```javascript
// Detectar si estamos en desarrollo o producción
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://astrotune-backend.onrender.com"
    : "http://localhost:5000";

// Luego en tus calls:
fetch(`${API_URL}/api/playlists`);
```

---

## ⏱️ RESUMEN DEL TIEMPO

```
Paso 1-2: 5 min    (Crear carpeta, instalar)
Paso 3-5: 10 min   (Copiar código)
Paso 6: 5 min      (Probar localmente)
Paso 7: 20 min     (Conectar React)
Deploy: 10 min     (Render.com)

TOTAL: ~50 MINUTOS ⚡
```

---

## ✨ VENTAJAS DE ESTE BACKEND

✅ Súper simple (sin BD compleja)
✅ Funciona localmente primero
✅ Fácil de entender
✅ Se puede deployar en Render gratis
✅ Puedes expandir después
✅ Ya tienes experiencia con backend

---

## 🚀 PRÓXIMOS PASOS (Después)

Si quieres expandir:

1. Agregar autenticación JWT
2. Cambiar de archivo JSON a MongoDB
3. Agregar validaciones
4. Rate limiting
5. Logging

Pero por ahora, esto es perfecto para empezar.

---

## 📚 ARCHIVO COMPLETO EN UNA LÍNEA

Si quieres copiar todo rápido:

1. Copia el código del `server.js`
2. Copia el `package.json`
3. Crea `.env` y `data/playlists.json`
4. Corre `npm install && npm run dev`

¡Listo! 🎉

---

**¿Quieres que empecemos ahora? Tengo el código listo para copiar-pegar.**

# 🚀 AstroTune - Gestor de Playlists Cyberpunk

## ⚡ POST CORTO PARA LINKEDIN (Lo que publicarías)

---

🎵 Acabo de lanzar **AstroTune** - un gestor de playlists con diseño cyberpunk.

✨ 50 canciones | 🔍 Búsqueda en tiempo real | 💾 Playlists guardadas localmente | ▶️ Audio interactivo | 🎨 UI neon

🚀 Live: https://astrotune-music.surge.sh
💻 Open source: github.com/DFelipeR/AstroTune

Built with React 19 + Vite 7 + Web Audio API

#React #WebDevelopment #MusicApp #OpenSource

---

## 📋 VERSIÓN MEDIANA (Si quieres contar más)

🎵 Acabo de lanzar **AstroTune** - gestor de playlists moderno con diseño cyberpunk.

**¿Qué tiene?**
✨ 50 canciones reales (hits 2019-2024)
🔍 Búsqueda en tiempo real
💾 Playlists guardadas en tu navegador
▶️ Reproductor con visualizador
🎨 Animaciones suaves + UI neon

**Tech Stack:**
React 19 + Vite 7 + HTML5 Audio API + Canvas 2D

**¿Cuál fue el desafío?**
Implementar animaciones 60 FPS suaves, Web Audio API para visualizador en tiempo real, y persistencia sin backend.

🔗 Pruébalo: https://astrotune-music.surge.sh
💻 GitHub: DFelipeR/AstroTune

#ReactJS #WebDevelopment #WebAudio #OpenSource

---

## 📚 DOCUMENTACIÓN TÉCNICA COMPLETA (Para referencia)

### 🎨 Animaciones Implementadas

Cada elemento de la UI tiene una animación única que mejora la experiencia visual:

**1. Track Cards (Tarjetas de Canciones)**

```css
/* Entrada suave de las tarjetas */
@keyframes trackSlideIn {
  from: opacity 0, translateX(-10px)
  to: opacity 1, translateX(0)
}

/* Efecto shimmer/brillo al pasar mouse */
.Track::before {
  background: linear-gradient(90deg, transparent → cyan → transparent)
  transition: left 0.5s ease
}
```

- Efecto: Las canciones se deslizan suavemente desde la izquierda
- Interacción: Brillo cyan que recorre la tarjeta al pasar mouse
- Duración: 0.4s entrada, 0.5s brillo

**2. Album Art Modal**

```css
/* Flotación continua */
@keyframes float {
  0%, 100%: translateY(0px)
  50%: translateY(-10px)
}

/* Entrada del modal */
@keyframes slideUp {
  from: opacity 0, translateY(20px)
  to: opacity 1, translateY(0)
}
```

- Efecto: Album art "flota" en el modal
- Modalidad: Aparece de abajo hacia arriba
- Duración: 3s flotación infinita, 0.4s entrada

**3. Visualizador de Audio (Canvas)**

```javascript
/* 128 barras de frecuencia que se mueven en tiempo real */
- 60 FPS smooth animation
- requestAnimationFrame para máximo rendimiento
- Colores: Gradiente cyan neon
- Barras redondeadas con efecto glow
```

- Efecto: Reacciona en tiempo real a la música
- Duración: Continua mientras suena la música
- Tecnología: Canvas 2D + Web Audio API

**4. Progress Bar & Volume Slider**

```css
/* Gradiente animado que se actualiza suavemente */
background: linear-gradient(
  to right,
  #00ffff 0%,
  #00ffff ${progress}%,
  #1f2937 ${progress}%,
  #1f2937 100%
);
```

- Efecto: Barra de progreso con color cyan que avanza
- Duración: Actualización en tiempo real (60 FPS)
- Interacción: Clickeable para saltar a posición

**5. Botones (Play, +/-, Volume)**

```css
/* Efecto de explosión de fondo */
.Track-play::before {
  width: 0 → 40px
  height: 0 → 40px
  transition: 0.3s ease
}

/* Rotación en botones de acción */
.Track-action:hover {
  transform: scale(1.1) rotate(90deg)
}
```

- Efecto: Fondo se expande desde el centro
- Interacción: Botones crecen y rotan al pasar mouse
- Duración: 0.3s

**6. Modal Overlay**

```css
@keyframes fadeIn {
  from: opacity 0, backdrop-filter blur(0px)
  to: opacity 1, backdrop-filter blur(4px)
}
```

- Efecto: Fondo se oscurece con blur suave
- Duración: 0.3s
- Tecnología: CSS backdrop-filter

**7. Contenido del Modal**

```css
/* Aparición escalonada de elementos */
.modal-track-name {
  animation: fadeInDown 0.5s ease-out 0.1s both;
}
.modal-track-artist {
  animation: fadeInDown 0.5s ease-out 0.15s both;
}
.modal-track-album {
  animation: fadeInDown 0.5s ease-out 0.2s both;
}
```

- Efecto: Cada línea aparece con pequeño delay
- Duración: 0.5s cada una, separadas 0.05s
- Resultado: Efecto de "cascada"

---

### 🛠️ Cómo Personalizar las Animaciones

Todos los archivos CSS están en `src/components/`:

```
src/components/
├── Track/Track.css              ← Animaciones de tarjetas
├── TrackModal/TrackModal.css    ← Animaciones de modal
├── Visualizer/Visualizer.jsx    ← Animador de frecuencias
├── SearchBar/SearchBar.css      ← Animaciones de búsqueda
└── App/App.css                  ← Animaciones globales
```

**Ajustar velocidad de animación:**

```css
/* Cambiar de 0.3s a tu preferencia */
transition: all 0.5s ease;
animation: trackSlideIn 0.6s ease-out;
```

**Modificar colores/efectos:**

```css
/* Cambiar cyan por otro color */
color: #00ffff;
box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);

/* Prueba con magenta */
color: #ff00ff;
box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
```

---

🔗 Pruébalo en vivo: https://astrotune-music.surge.sh

Código abierto en GitHub: github.com/DFelipeR/AstroTune

¿Te gustaría explorar características de audio interactivas?

#React #WebDevelopment #MusicPlayer #FrontEnd #WebDesign #OpenSource

---

### 🛠️ Stack Técnico Implementado

**Frontend:**

- React 19.x (class components + hooks)
- Vite 7.x (bundler rápido)
- CSS3 (gradientes, animaciones, backdrop-filter)

**Audio & Visualización:**

- HTML5 `<audio>` API
- Web Audio API (context, analyser, frequency data)
- Canvas 2D (128 barras redondeadas)
- requestAnimationFrame (60 FPS smooth rendering)

**Estado & Persistencia:**

- React State Management (App.jsx como contenedor)
- localStorage API (playlists)
- JSON serialization

**Deployment:**
- Surge CDN (infraestructura global)
- Live en: https://astrotune-music.surge.sh
- GitHub repository: DFelipeR/AstroTune

---

### ✨ Animaciones Implementadas (Referencias)

### ⚡ Características Principales

- **50 canciones reales** (hits 2019-2024)
- **Búsqueda en tiempo real** (por nombre, artista, álbum)
- **Playlists persistentes** (guardadas en localStorage)
- **Reproductor interactivo** con visualizador
- **Animaciones suaves** (60 FPS)
- **Diseño responsive** (mobile-friendly)

### 🎯 Desafíos Técnicos Resueltos

| Problema | Solución |
|----------|----------|
| Audio con CORS | Archivos locales en `/public/audio` |
| Progreso choppy | requestAnimationFrame (60 FPS) |
| Sincronización slider | DOM refs actualizadas en tiempo real |
| Persistencia | localStorage utility (playlistStorage.js) |
| Visualizador tiempo real | Web Audio API + Canvas 2D |

### 📊 Resultados

✅ 50 canciones searcheables
✅ Playlists guardadas localmente  
✅ Animaciones 60 FPS suaves
✅ Deploy en vivo (Surge CDN)
✅ Código open source

### 🚀 Próximas Mejoras

- Sincronización en la nube
- Integración Spotify API
- Progressive Web App (modo offline)
- Autenticación con GitHub
- Analytics

### 🔗 Enlaces

- 🌐 **Live**: https://astrotune-music.surge.sh
- 💻 **GitHub**: github.com/DFelipeR/AstroTune
- 📝 **Stack**: React 19 + Vite 7 + Web Audio API

---

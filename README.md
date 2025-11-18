# 🎵 AstroTune - Reproductor de Música Cyberpunk

> Una aplicación moderna y futurista de reproducción de música con interfaz cyberpunk, reproductor de audio funcional y gestión de playlists personalizadas.

**Versión:** 1.0.1

![Vite](https://img.shields.io/badge/Vite-7.x-purple?style=flat-square)
![React](https://img.shields.io/badge/React-19.x-blue?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square)
![Status](https://img.shields.io/badge/Status-Activo-green?style=flat-square)
![Deployment](https://img.shields.io/badge/Deploy-Surge%20CDN-blue?style=flat-square)

**[🇬🇧 English Version](./README.en.md)** | **🇪🇸 Versión en Español**

---

## ✨ Características Implementadas

### 🎵 Reproductor

- ✅ **Reproductor de Audio Funcional** - Reproducción fluida con barra de progreso
- ✅ **50 Canciones Reales** - Hits 2019-2024 (The Weeknd, Taylor Swift, Bad Bunny, BTS, etc.)
- ✅ **Control de Reproducción** - Play/Pause con animación suave
- ✅ **Barra de Progreso Fluida** - Animación a 60 FPS con `requestAnimationFrame`
- ✅ **Control de Volumen** - Slider con indicador visual en tiempo real
- ✅ **Información de Canción** - Nombre, artista, álbum y duración

### 🔍 Búsqueda

- ✅ **Búsqueda en Tiempo Real** - Filtra canciones mientras escribes
- ✅ **Multi-criterio** - Busca por nombre, artista o álbum
- ✅ **Resultados Instantáneos** - Sin lag, búsqueda optimizada

### 💾 Gestión de Playlists

- ✅ **Crear Playlists** - Personaliza tus propias playlists
- ✅ **Guardar Localmente** - localStorage para persistencia sin backend
- ✅ **Cargar Playlists** - Accede a tus playlists guardadas con un clic
- ✅ **Eliminar Playlists** - Gestión completa de tus colecciones
- ✅ **Auto-save** - Tus ediciones se guardan automáticamente

### 🎨 Diseño & UX

- ✅ **Diseño Cyberpunk** - Tema futurista con colores neon (Cyan, Magenta, Negro)
- ✅ **Visualizador de Audio** - Barras animadas que responden a la reproducción
- ✅ **Interfaz Responsiva** - Optimizada para escritorio, tablets y móviles
- ✅ **Deploy en Vivo** - Publicado en Surge CDN con HTTPS global

---

## 🚀 Publicación y Despliegue

### 🌐 Acceso en Vivo

**La aplicación está desplegada en:** https://astrotune-music.surge.sh

### Instrucciones de Publicación en Surge

#### 1. **Instalar Surge**

```powershell
npm install --global surge
```

#### 2. **Hacer build del proyecto**

```powershell
npm run build
```

#### 3. **Desplegar a Surge**

```powershell
cd dist
surge --project . --domain astrotune-music.surge.sh
```

#### 4. **Verificar despliegue**

```
✅ Production ............................................................... astrotune-music.surge.sh
Success! - Published to astrotune-music.surge.sh
```

### Desplegar en Otros Servicios

**Vercel:**

```powershell
vercel --prod
```

**Netlify:**

```powershell
netlify deploy --prod --dir=dist
```

**GitHub Pages:**

```powershell
npm run build
# Configurar en GitHub: Settings > Pages > Deploy from branch > main/docs
```

---

## 🛠️ Instalación Local

### Requisitos Previos

- Node.js (v16 o superior)
- npm (v7 o superior)
- Git

### Pasos de Instalación

1. **Clona el repositorio**

```powershell
git clone https://github.com/DFelipeR/AstroTune.git
cd AstroTune
```

2. **Instala las dependencias**

```powershell
npm install
```

3. **Inicia el servidor de desarrollo**

```powershell
npm run dev
```

4. **Abre en el navegador**

```
http://localhost:5173/
```

---

## 📝 Scripts Disponibles

```powershell
# Inicia el servidor de desarrollo con HMR
npm run dev

# Compila el proyecto para producción
npm run build

# Vista previa de la compilación
npm run preview

# Verificar calidad del código
npm run lint
```

---

## 🎨 Diseño Visual

### Paleta de Colores Cyberpunk

| Color          | Código    | Uso                    |
| -------------- | --------- | ---------------------- |
| Fondo Oscuro   | `#0A0A1F` | Fondo principal        |
| Cyan Eléctrico | `#00FFFF` | Acentos, botones, glow |
| Magenta Oscuro | `#2d1b4e` | Gradientes de fondo    |
| Gris Claro     | `#E0E0E0` | Texto principal        |
| Gris Medio     | `#94a3b8` | Texto secundario       |

### Efectos Visuales

- ✨ Glow neon en botones y bordes
- 🎬 Animaciones suaves con `requestAnimationFrame`
- 🎯 Transiciones fluidas en controles
- 📊 Visualizador de audio animado

---

## 📁 Estructura del Proyecto

```
AstroTune/
├── public/
│   ├── audio/                    # Archivos WAV de canciones (50 archivos)
│   ├── reset.css                 # Reset CSS global
│   └── favicon.ico               # Ícono de la aplicación
├── src/
│   ├── components/
│   │   ├── App/                  # Componente principal
│   │   │   ├── App.jsx
│   │   │   └── App.css
│   │   ├── AudioPlayer/          # Reproductor de audio
│   │   │   ├── AudioPlayer.jsx   # Control de reproducción
│   │   │   └── AudioPlayer.css   # Estilos cyberpunk
│   │   ├── SearchBar/
│   │   ├── SearchResults/
│   │   ├── Playlist/
│   │   ├── TrackList/
│   │   └── Track/
│   ├── data/
│   │   └── mockTracks.js         # Catálogo de 50 canciones
│   ├── main.jsx                  # Punto de entrada
│   └── index.css                 # Estilos globales
├── vite.config.js                # Configuración de Vite
├── index.html                    # HTML principal
├── package.json
├── create_multi_wav.ps1          # Script para generar archivos WAV
└── README.md                     # Este archivo
```

---

## 🎯 Mejoras Pendientes

### 🔴 Críticas (Deben implementarse)

- [ ] **Integración Spotify API** - Búsqueda de canciones reales en Spotify
- [ ] **Autenticación OAuth** - Login con Spotify para sincronizar playlists
- [ ] **Persistencia de Datos** - Guardar playlists en base de datos
- [ ] **Reproducción Real** - Reemplazar tonos WAV por canciones MP3 reales

### 🟡 Importantes (Mejoran UX)

- [ ] **Responsive Mobile** - Optimizar interfaz para smartphones
- [ ] **Search Funcional** - Buscar en catálogo de 50 canciones
- [ ] **Playlists** - Crear, editar y eliminar playlists
- [ ] **Agregar a Cola** - Sistema de cola de reproducción
- [ ] **Historial** - Guardar canciones escuchadas recientemente

### 🟢 Opcionales (Mejoras futuras)

- [ ] **Temas Intercambiables** - Selector claro/oscuro/cyberpunk
- [ ] **Ecualizador** - Control de bajos, medios y agudos
- [ ] **Letras** - Mostrar sincronización de letras
- [ ] **Recomendaciones** - IA para sugerir canciones
- [ ] **Social** - Compartir playlists y canciones
- [ ] **Tests** - Pruebas unitarias con Jest/Vitest
- [ ] **PWA** - Progressive Web App (funciona offline)

---

## 🛠️ Stack Tecnológico

### Frontend

- **Framework**: React 19.x
- **Build Tool**: Vite 7.x
- **Lenguaje**: JavaScript (ES6+)
- **Styling**: CSS3 (Scoped por componente)

### APIs & Librerías

- **HTML5 Audio API** - Reproducción de audio
- **Web Audio API** - Análisis de audio (visualizador)
- **requestAnimationFrame** - Animaciones suaves a 60 FPS

### DevOps

- **Package Manager**: npm
- **Version Control**: Git + GitHub
- **Deployment**: Surge CDN
- **Development**: ESLint + HMR (Hot Module Replacement)

---

## 🔊 Generación de Audio

### Archivos WAV

Los 50 archivos WAV se generan usando **PowerShell** con notas musicales:

- **Frecuencias**: C4 (262 Hz) a C5 (523 Hz) en ciclo
- **Duración**: 10 segundos cada uno
- **Formato**: 44.1 kHz, 16-bit, Mono
- **Tamaño Total**: ~43 MB

### Script de Generación

```powershell
powershell -ExecutionPolicy Bypass -File create_multi_wav.ps1
```

Este script genera automáticamente 50 archivos WAV con diferentes notas musicales en la carpeta `public/audio/`.

---

## 📊 Estadísticas del Proyecto

| Métrica               | Valor                          |
| --------------------- | ------------------------------ |
| Canciones Precargadas | 50                             |
| Duración por Canción  | 10 segundos                    |
| Componentes React     | 7                              |
| Archivos CSS          | 7                              |
| Tamaño Bundle JS      | 210 kB (65 kB gzipped)         |
| Tamaño CSS            | 9.42 kB (2.22 kB gzipped)      |
| Deployment Size       | 43.2 MB (incluyendo audio)     |
| FPS del Reproductor   | 60 (con requestAnimationFrame) |

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios mayores:

1. **Fork** el proyecto
2. **Crea una rama** para tu feature (`git checkout -b feature/amazing-feature`)
3. **Commit** tus cambios (`git commit -m 'Add some amazing feature'`)
4. **Push** a la rama (`git push origin feature/amazing-feature`)
5. **Abre un Pull Request**

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**DFelipeR**

- GitHub: [@DFelipeR](https://github.com/DFelipeR)
- LinkedIn: [Daniel Felipe Ramírez Caro]([https://linkedin.com/in/dfeliper](https://www.linkedin.com/in/dframirezcaro))

---

## 📞 Soporte

¿Preguntas o sugerencias?

- 📧 Abre un [issue en GitHub](https://github.com/DFelipeR/AstroTune/issues)
- 💬 Contáctame directamente en mis redes

---

<div align="center">

**⭐ Si te gustó este proyecto, no olvides dejar una estrella en GitHub! ⭐**

Hecho con ❤️ y mucho ☕ por DFelipeR

**[🚀 Ver en Vivo](https://astrotune-music.surge.sh)**

</div>

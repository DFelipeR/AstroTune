# 🎵 AstroTune# 🎵 AstroTune# Jammming

> Una aplicación moderna de Spotify para descubrir, buscar y crear playlists personalizadas con una interfaz futurista y tema cyberpunk.> Una aplicación moderna de Spotify para descubrir, buscar y crear playlists personalizadas con una interfaz futurista y tema cyberpunk.Small Vite + React project scaffold for the Jammming exercise.

**[🇬🇧 English Version](./README.en.md)** | **🇪🇸 Versión en Español**![Vite](https://img.shields.io/badge/Vite-7.x-purple?style=flat-square)How to run locally

![Vite](https://img.shields.io/badge/Vite-7.x-purple?style=flat-square)![React](https://img.shields.io/badge/React-19.x-blue?style=flat-square)

![React](https://img.shields.io/badge/React-19.x-blue?style=flat-square)

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square)![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square)1. Install dependencies

![Status](https://img.shields.io/badge/Status-En%20Desarrollo-orange?style=flat-square)

![Status](https://img.shields.io/badge/Status-En%20Desarrollo-orange?style=flat-square)

---

````powershell

## ✨ Características

---npm install

- 🔍 **Búsqueda de Canciones** - Interfaz intuitiva para buscar y explorar canciones

- 🎼 **Gestión de Playlists** - Crea playlists personalizadas con tus canciones favoritas```

- ➕➖ **Agregar/Remover Canciones** - Controla fácilmente qué canciones incluir en tus playlists

- ✏️ **Editar Nombre de Playlist** - Personaliza el nombre de tus playlists## ✨ Características

- 💾 **Guardar a Spotify** - Sincroniza tus playlists con tu cuenta de Spotify

- 🌌 **Diseño Cyberpunk** - Tema futurista con colores vibrantes y efectos visuales2. Run dev server

- 🚀 **HMR (Hot Module Replacement)** - Desarrollo rápido con recarga en tiempo real

- 🔍 **Búsqueda de Canciones** - Interfaz intuitiva para buscar y explorar canciones

---

- 🎼 **Gestión de Playlists** - Crea playlists personalizadas con tus canciones favoritas```powershell

## 🎨 Paleta de Colores

- ➕➖ **Agregar/Remover Canciones** - Controla fácilmente qué canciones incluir en tus playlistsnpm run dev

| Color | Código | Uso |

|-------|--------|-----|- ✏️ **Editar Nombre de Playlist** - Personaliza el nombre de tus playlists```

| Fondo Oscuro | `#0A0A1F` | Fondo principal |

| Cyan Eléctrico | `#00FFFF` | Acentos y botones |- 💾 **Guardar a Spotify** - Sincroniza tus playlists con tu cuenta de Spotify

| Gris Claro | `#E0E0E0` | Texto principal |

- 🌌 **Diseño Cyberpunk** - Tema futurista con colores vibrantes y efectos visuales3. Open http://localhost:5173/

---

- 🚀 **HMR (Hot Module Replacement)** - Desarrollo rápido con recarga en tiempo real

## 🛠️ Stack Tecnológico

Git

- **Frontend Framework**: React 19.x

- **Build Tool**: Vite 7.x---

- **Lenguaje**: JavaScript (ES6+)

- **Styling**: CSS3 (Component-scoped)This repository was initialized locally. To publish to GitHub:

- **Package Manager**: npm

- **Version Control**: Git + GitHub## 🎨 Paleta de Colores

- **Desarrollo**: ESLint, Hot Module Replacement (HMR)

1. Create a new empty repository on GitHub (do NOT add README on GitHub if you already have one locally).

---

| Color | Código | Uso |2. Add the remote and push:

## 📁 Estructura del Proyecto

|-------|--------|-----|

````

AstroTune/| Fondo Oscuro | `#0A0A1F` | Fondo principal |```powershell

├── public/

│ ├── reset.css # Reset CSS global| Cyan Eléctrico | `#00FFFF` | Acentos y botones |git remote add origin https://github.com/<your-username>/<repo-name>.git

│ └── favicon.ico # Ícono de la aplicación

├── src/| Gris Claro | `#E0E0E0` | Texto principal |git branch -M main

│ ├── components/

│ │ ├── App/git push -u origin main

│ │ │ ├── App.jsx

│ │ │ └── App.css---```

│ │ ├── SearchBar/

│ │ │ ├── SearchBar.jsx## 🛠️ Stack TecnológicoIf git refuses to commit because user.name / user.email are not set, configure them locally:

│ │ │ └── SearchBar.css

│ │ ├── SearchResults/- **Frontend Framework**: React 19.x```powershell

│ │ │ ├── SearchResults.jsx

│ │ │ └── SearchResults.css- **Build Tool**: Vite 7.xgit config user.name "Your Name"

│ │ ├── Playlist/

│ │ │ ├── Playlist.jsx- **Lenguaje**: JavaScript (ES6+)git config user.email "you@example.com"

│ │ │ └── Playlist.css

│ │ ├── TrackList/- **Styling**: CSS3 (Component-scoped)```

│ │ │ ├── TrackList.jsx

│ │ │ └── TrackList.css- **Package Manager**: npm

│ │ └── Track/

│ │ ├── Track.jsx- **Version Control**: Git + GitHubNotes

│ │ └── Track.css

│ ├── assets/- **Desarrollo**: ESLint, Hot Module Replacement (HMR)

│ ├── main.jsx # Punto de entrada

│ ├── index.css # Estilos globales- `public/reset.css` currently contains a minimal reset. Adjust fonts and favicon in `index.html` as needed.

│ └── App.jsx # Componente raíz

├── vite.config.js # Configuración de Vite---- Consider removing large binary assets from the repo or storing them in `assets` and tracking only what you need.# React + Vite

├── eslint.config.js # Configuración de ESLint

├── index.html # HTML principal## 📁 Estructura del ProyectoThis template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

├── package.json

├── package-lock.json```Currently, two official plugins are available:

└── README.md # Este archivo

````AstroTune/



---├── public/- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh



## 🚀 Inicio Rápido│   ├── reset.css           # Reset CSS global- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



### Requisitos Previos│   └── favicon.ico         # Ícono de la aplicación

- Node.js (v16 o superior)

- npm (v7 o superior)├── src/## React Compiler



### Instalación│   ├── components/



1. **Clona el repositorio**│   │   ├── App/The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

   ```powershell

   git clone https://github.com/DFelipeR/AstroTune.git│   │   │   ├── App.jsx

   cd AstroTune

   ```│   │   │   └── App.css## Expanding the ESLint configuration



2. **Instala las dependencias**│   │   ├── SearchBar/

   ```powershell

   npm install│   │   │   ├── SearchBar.jsxIf you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

````

│ │ │ └── SearchBar.css

3. **Inicia el servidor de desarrollo**│ │ ├── SearchResults/

   ````powershell│ │   │   ├── SearchResults.jsx

   npm run dev│   │   │   └── SearchResults.css

   ```│   │   ├── Playlist/
   ````

│ │ │ ├── Playlist.jsx

4. **Abre tu navegador**│ │ │ └── Playlist.css

   ````│ │   ├── TrackList/

   http://localhost:5173/│   │   │   ├── TrackList.jsx

   ```│   │   │   └── TrackList.css
   ````

│ │ └── Track/

---│ │ ├── Track.jsx

│ │ └── Track.css

## 📝 Scripts Disponibles│ ├── assets/

│ ├── main.jsx # Punto de entrada

````powershell│ ├── index.css           # Estilos globales

# Inicia el servidor de desarrollo con HMR│   └── App.jsx             # Componente raíz

npm run dev├── vite.config.js          # Configuración de Vite

├── eslint.config.js        # Configuración de ESLint

# Compila el proyecto para producción├── index.html              # HTML principal

npm build├── package.json

├── package-lock.json

# Vista previa de la compilación de producción└── README.md               # Este archivo

npm preview```



# Ejecuta ESLint para verificar la calidad del código---

npm lint

```## 🚀 Inicio Rápido



---### Requisitos Previos



## 🧩 Arquitectura de Componentes- Node.js (v16 o superior)

- npm (v7 o superior)

### Jerarquía de Componentes

### Instalación

````

App (Componente Raíz)1. **Clona el repositorio**

├── SearchBar (Buscar canciones)

├── SearchResults (Mostrar resultados) ```powershell

│ └── TrackList git clone https://github.com/DFelipeR/AstroTune.git

│ └── Track (+ botón) cd AstroTune

└── Playlist (Mi Playlist) ```

    ├── Input (Nombre de playlist)

    ├── TrackList2. **Instala las dependencias**

    │   └── Track (- botón)

    └── Botón Guardar   ```powershell

```npm install

```

### Flujo de Props

3. **Inicia el servidor de desarrollo**

- **App.jsx**: Gestiona el estado global (searchResults, playlistName, playlistTracks)

- **SearchBar**: Captura entrada del usuario, comunica búsquedas a App ```powershell

- **SearchResults**: Muestra resultados, permite agregar canciones npm run dev

- **Playlist**: Muestra playlist actual, permite editar nombre y remover canciones ```

- **TrackList**: Renderiza lista de tracks

- **Track**: Componente individual de canción con botones de control4. **Abre tu navegador**

  ```

  ```

--- http://localhost:5173/

````

## 🔗 Métodos Principales

---

| Método | Descripción |

|--------|------------|## 📝 Scripts Disponibles

| `addTrack(track)` | Agrega una canción a la playlist |

| `removeTrack(track)` | Remueve una canción de la playlist |```powershell

| `updatePlaylistName(name)` | Actualiza el nombre de la playlist |# Inicia el servidor de desarrollo con HMR

| `search(term)` | Busca canciones (Spotify API) |npm run dev

| `savePlaylist()` | Guarda la playlist en Spotify |

# Compila el proyecto para producción

---npm build



## 📚 Tecnologías y Conceptos# Vista previa de la compilación de producción

npm preview

### React Hooks & Conceptos

- ✅ **useState**: Gestión de estado en componentes funcionales# Ejecuta ESLint para verificar la calidad del código

- ✅ **Props**: Comunicación entre componentesnpm lint

- ✅ **Event Handling**: Manejo de eventos del usuario```

- ✅ **Component Lifecycle**: Ciclo de vida de componentes clase

---

### CSS Moderno

- ✅ **Flexbox**: Layouts responsivos## 🧩 Arquitectura de Componentes

- ✅ **Gradientes**: Efectos visuales modernos

- ✅ **Transiciones**: Animaciones suaves### Jerarquía de Componentes

- ✅ **Box Shadows**: Efectos de profundidad con glow

````

---App (Componente Raíz)

├── SearchBar (Buscar canciones)

## 🎯 Próximos Pasos (Roadmap)├── SearchResults (Mostrar resultados)

│ └── TrackList

- [ ] **Integración Spotify API**: Conectar con API de Spotify para búsqueda real│ └── Track (+ botón)

- [ ] **Autenticación**: Sistema de login con Spotify OAuth└── Playlist (Mi Playlist)

- [ ] **Persistencia de Datos**: Guardar playlists localmente ├── Input (Nombre de playlist)

- [ ] **Responsive Design**: Optimizar para dispositivos móviles ├── TrackList

- [ ] **Temas**: Selector de temas (claro/oscuro) │ └── Track (- botón)

- [ ] **Tests**: Agregar pruebas unitarias con Jest/Vitest └── Botón Guardar

```

---

### Flujo de Props

## 📸 Capturas de Pantalla

- **App.jsx**: Gestiona el estado global (searchResults, playlistName, playlistTracks)

*[Próximamente se agregarán capturas de pantalla del diseño cyberpunk]*- **SearchBar**: Captura entrada del usuario, comunica búsquedas a App

- **SearchResults**: Muestra resultados, permite agregar canciones

---- **Playlist**: Muestra playlist actual, permite editar nombre y remover canciones

- **TrackList**: Renderiza lista de tracks

## 🤝 Contribuciones- **Track**: Componente individual de canción con botones de control



Las contribuciones son bienvenidas. Para cambios mayores:---



1. Fork el proyecto## 🔗 Métodos Principales

2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)

3. Commit tus cambios (`git commit -m 'Add some amazing feature'`)| Método                     | Descripción                        |

4. Push a la rama (`git push origin feature/amazing-feature`)| -------------------------- | ---------------------------------- |

5. Abre un Pull Request| `addTrack(track)`          | Agrega una canción a la playlist   |

| `removeTrack(track)`       | Remueve una canción de la playlist |

---| `updatePlaylistName(name)` | Actualiza el nombre de la playlist |

| `search(term)`             | Busca canciones (Spotify API)      |

## 📄 Licencia| `savePlaylist()`           | Guarda la playlist en Spotify      |



Este proyecto está bajo la licencia **MIT**. Ver el archivo `LICENSE` para más detalles.---



---## 📚 Tecnologías y Conceptos



## 👨‍💻 Autor### React Hooks & Conceptos



**DFelipeR**- ✅ **useState**: Gestión de estado en componentes funcionales

- ✅ **Props**: Comunicación entre componentes

- GitHub: [@DFelipeR](https://github.com/DFelipeR)- ✅ **Event Handling**: Manejo de eventos del usuario

- LinkedIn: [Felipe Rodriguez](https://linkedin.com/in/dfeliper)- ✅ **Component Lifecycle**: Ciclo de vida de componentes clase



---### CSS Moderno



## 📞 Soporte- ✅ **Flexbox**: Layouts responsivos

- ✅ **Gradientes**: Efectos visuales modernos

¿Preguntas o sugerencias? Abre un issue en el repositorio o contáctame directamente.- ✅ **Transiciones**: Animaciones suaves

- ✅ **Box Shadows**: Efectos de profundidad con glow

---

---

<div align="center">

## 🎯 Próximos Pasos (Roadmap)

**⭐ Si te gustó este proyecto, no olvides dejar una estrella en GitHub! ⭐**

- [ ] **Integración Spotify API**: Conectar con API de Spotify para búsqueda real

Hecho con ❤️ y mucho ☕ por DFelipeR- [ ] **Autenticación**: Sistema de login con Spotify OAuth

- [ ] **Persistencia de Datos**: Guardar playlists localmente

</div>- [ ] **Responsive Design**: Optimizar para dispositivos móviles

- [ ] **Temas**: Selector de temas (claro/oscuro)
- [ ] **Tests**: Agregar pruebas unitarias con Jest/Vitest

---

## 📸 Capturas de Pantalla

_[Próximamente se agregarán capturas de pantalla del diseño cyberpunk]_

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios mayores:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**DFelipeR**

- GitHub: [@DFelipeR](https://github.com/DFelipeR)
- LinkedIn: [Felipe Rodriguez](https://linkedin.com/in/dfeliper)

---

## 📞 Soporte

¿Preguntas o sugerencias? Abre un issue en el repositorio o contáctame directamente.

---

<div align="center">

**⭐ Si te gustó este proyecto, no olvides dejar una estrella en GitHub! ⭐**

Hecho con ❤️ y mucho ☕ por DFelipeR

</div>
```

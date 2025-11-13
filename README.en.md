# 🎵 AstroTune

> A modern Spotify application to discover, search, and create personalized playlists with a futuristic interface and cyberpunk theme.

**🇬🇧 English Version** | **[🇪🇸 Versión en Español](./README.md)**

![Vite](https://img.shields.io/badge/Vite-7.x-purple?style=flat-square)
![React](https://img.shields.io/badge/React-19.x-blue?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square)
![Status](https://img.shields.io/badge/Status-Under%20Development-orange?style=flat-square)

---

## ✨ Features

- 🔍 **Song Search** - Intuitive interface to search and explore songs
- 🎼 **Playlist Management** - Create personalized playlists with your favorite songs
- ➕➖ **Add/Remove Songs** - Easily control which songs to include in your playlists
- ✏️ **Edit Playlist Name** - Customize your playlist names
- 💾 **Save to Spotify** - Sync your playlists with your Spotify account
- 🌌 **Cyberpunk Design** - Futuristic theme with vibrant colors and visual effects
- 🚀 **HMR (Hot Module Replacement)** - Fast development with real-time reloading

---

## 🎨 Color Palette

| Color           | Code      | Usage               |
| --------------- | --------- | ------------------- |
| Dark Background | `#0A0A1F` | Main background     |
| Electric Cyan   | `#00FFFF` | Accents and buttons |
| Light Gray      | `#E0E0E0` | Primary text        |

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.x
- **Build Tool**: Vite 7.x
- **Language**: JavaScript (ES6+)
- **Styling**: CSS3 (Component-scoped)
- **Package Manager**: npm
- **Version Control**: Git + GitHub
- **Development**: ESLint, Hot Module Replacement (HMR)

---

## 📁 Project Structure

```
AstroTune/
├── public/
│   ├── reset.css           # Global CSS reset
│   └── favicon.ico         # Application icon
├── src/
│   ├── components/
│   │   ├── App/
│   │   │   ├── App.jsx
│   │   │   └── App.css
│   │   ├── SearchBar/
│   │   │   ├── SearchBar.jsx
│   │   │   └── SearchBar.css
│   │   ├── SearchResults/
│   │   │   ├── SearchResults.jsx
│   │   │   └── SearchResults.css
│   │   ├── Playlist/
│   │   │   ├── Playlist.jsx
│   │   │   └── Playlist.css
│   │   ├── TrackList/
│   │   │   ├── TrackList.jsx
│   │   │   └── TrackList.css
│   │   └── Track/
│   │       ├── Track.jsx
│   │       └── Track.css
│   ├── assets/
│   ├── main.jsx            # Entry point
│   ├── index.css           # Global styles
│   └── App.jsx             # Root component
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint configuration
├── index.html              # Main HTML
├── package.json
├── package-lock.json
└── README.md               # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. **Clone the repository**

   ```powershell
   git clone https://github.com/DFelipeR/AstroTune.git
   cd AstroTune
   ```

2. **Install dependencies**

   ```powershell
   npm install
   ```

3. **Start the development server**

   ```powershell
   npm run dev
   ```

4. **Open in your browser**
   ```
   http://localhost:5173/
   ```

---

## 📝 Available Scripts

```powershell
# Start development server with HMR
npm run dev

# Build the project for production
npm build

# Preview the production build
npm preview

# Run ESLint to check code quality
npm lint
```

---

## 🧩 Component Architecture

### Component Hierarchy

```
App (Root Component)
├── SearchBar (Search for songs)
├── SearchResults (Display results)
│   └── TrackList
│       └── Track (+ button)
└── Playlist (My Playlist)
    ├── Input (Playlist name)
    ├── TrackList
    │   └── Track (- button)
    └── Save Button
```

### Props Flow

- **App.jsx**: Manages global state (searchResults, playlistName, playlistTracks)
- **SearchBar**: Captures user input, communicates searches to App
- **SearchResults**: Shows results, allows adding songs
- **Playlist**: Displays current playlist, allows editing name and removing songs
- **TrackList**: Renders list of tracks
- **Track**: Individual song component with control buttons

---

## 🔗 Main Methods

| Method                     | Description                      |
| -------------------------- | -------------------------------- |
| `addTrack(track)`          | Adds a song to the playlist      |
| `removeTrack(track)`       | Removes a song from the playlist |
| `updatePlaylistName(name)` | Updates the playlist name        |
| `search(term)`             | Searches for songs (Spotify API) |
| `savePlaylist()`           | Saves the playlist to Spotify    |

---

## 📚 Technologies and Concepts

### React Hooks & Concepts

- ✅ **useState**: State management in functional components
- ✅ **Props**: Component communication
- ✅ **Event Handling**: User event handling
- ✅ **Component Lifecycle**: Class component lifecycle

### Modern CSS

- ✅ **Flexbox**: Responsive layouts
- ✅ **Gradients**: Modern visual effects
- ✅ **Transitions**: Smooth animations
- ✅ **Box Shadows**: Depth effects with glow

---

## 🎯 Next Steps (Roadmap)

- [ ] **Spotify API Integration**: Connect to Spotify API for real search
- [ ] **Authentication**: Spotify OAuth login system
- [ ] **Data Persistence**: Save playlists locally
- [ ] **Responsive Design**: Mobile device optimization
- [ ] **Themes**: Light/dark theme selector
- [ ] **Tests**: Add unit tests with Jest/Vitest

---

## 📸 Screenshots

_[Screenshots of the cyberpunk design coming soon]_

---

## 🤝 Contributing

Contributions are welcome! For major changes:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

## 👨‍💻 Author

**DFelipeR**

- GitHub: [@DFelipeR](https://github.com/DFelipeR)
- LinkedIn: [Felipe Rodriguez](https://linkedin.com/in/dfeliper)

---

## 📞 Support

Have questions or suggestions? Open an issue in the repository or contact me directly.

---

<div align="center">

**⭐ If you liked this project, don't forget to leave a star on GitHub! ⭐**

Made with ❤️ and lots of ☕ by DFelipeR

</div>

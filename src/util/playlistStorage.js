// Local storage utility for managing playlists
const PLAYLISTS_KEY = "AstroTune_Playlists";
const CURRENT_PLAYLIST_KEY = "AstroTune_CurrentPlaylist";

export const playlistStorage = {
  // Save a new playlist or update existing one
  savePlaylist: (name, tracks) => {
    const playlists = playlistStorage.getAllPlaylists();
    const timestamp = new Date().toISOString();

    playlists[name] = {
      name,
      tracks,
      createdAt: playlists[name]?.createdAt || timestamp,
      updatedAt: timestamp,
    };

    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
    return playlists[name];
  },

  // Get all playlists
  getAllPlaylists: () => {
    const data = localStorage.getItem(PLAYLISTS_KEY);
    return data ? JSON.parse(data) : {};
  },

  // Get a specific playlist by name
  getPlaylist: (name) => {
    const playlists = playlistStorage.getAllPlaylists();
    return playlists[name] || null;
  },

  // Delete a playlist
  deletePlaylist: (name) => {
    const playlists = playlistStorage.getAllPlaylists();
    delete playlists[name];
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  },

  // Rename a playlist
  renamePlaylist: (oldName, newName) => {
    const playlists = playlistStorage.getAllPlaylists();
    if (playlists[oldName]) {
      playlists[newName] = {
        ...playlists[oldName],
        name: newName,
      };
      delete playlists[oldName];
      localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
      return true;
    }
    return false;
  },

  // Save current playlist being edited
  setCurrentPlaylist: (name, tracks) => {
    localStorage.setItem(
      CURRENT_PLAYLIST_KEY,
      JSON.stringify({
        name,
        tracks,
        timestamp: new Date().toISOString(),
      })
    );
  },

  // Get current playlist being edited
  getCurrentPlaylist: () => {
    const data = localStorage.getItem(CURRENT_PLAYLIST_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Error parsing current playlist:", error);
      }
    }
    // Return default empty playlist if nothing is saved
    return {
      name: "New Playlist",
      tracks: [],
      timestamp: new Date().toISOString(),
    };
  },

  // Clear current playlist
  clearCurrentPlaylist: () => {
    localStorage.removeItem(CURRENT_PLAYLIST_KEY);
  },

  // Export playlist as JSON
  exportPlaylist: (name) => {
    const playlist = playlistStorage.getPlaylist(name);
    if (playlist) {
      return JSON.stringify(playlist, null, 2);
    }
    return null;
  },

  // Import playlist from JSON
  importPlaylist: (jsonString) => {
    try {
      const playlist = JSON.parse(jsonString);
      if (playlist.name && playlist.tracks) {
        return playlistStorage.savePlaylist(playlist.name, playlist.tracks);
      }
    } catch (error) {
      console.error("Error importing playlist:", error);
    }
    return null;
  },

  // Clear all playlists
  clearAllPlaylists: () => {
    localStorage.removeItem(PLAYLISTS_KEY);
    localStorage.removeItem(CURRENT_PLAYLIST_KEY);
  },
};

export default playlistStorage;

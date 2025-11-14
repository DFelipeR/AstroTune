import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import Spotify from "../../util/Spotify";
import { mockTracks } from "../../data/mockTracks";
import playlistStorage from "../../util/playlistStorage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: mockTracks,
      playlistName: "New Playlist",
      playlistTracks: [],
      currentTrack: null,
      isPlaying: false,
      savedPlaylists: [],
      useLocalStorage: true, // Use local storage instead of Spotify
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.search = this.search.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.playTrack = this.playTrack.bind(this);
    this.stopTrack = this.stopTrack.bind(this);
    this.loadPlaylist = this.loadPlaylist.bind(this);
    this.deletePlaylist = this.deletePlaylist.bind(this);
  }

  componentDidMount() {
    // Load saved playlists from localStorage
    this.updateSavedPlaylists();

    // Load last edited playlist if exists
    const currentPlaylist = playlistStorage.getCurrentPlaylist();
    if (currentPlaylist) {
      this.setState({
        playlistName: currentPlaylist.name,
        playlistTracks: currentPlaylist.tracks,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Save current playlist to localStorage whenever it changes
    if (
      prevState.playlistName !== this.state.playlistName ||
      prevState.playlistTracks !== this.state.playlistTracks
    ) {
      playlistStorage.setCurrentPlaylist(
        this.state.playlistName,
        this.state.playlistTracks
      );
    }
  }

  updateSavedPlaylists() {
    const playlists = playlistStorage.getAllPlaylists();
    this.setState({ savedPlaylists: Object.keys(playlists) });
  }

  playTrack(track) {
    this.setState({ currentTrack: track });
  }

  stopTrack() {
    this.setState({ currentTrack: null });
  }

  addTrack(track) {
    if (!this.state.playlistTracks.find((t) => t.id === track.id)) {
      this.setState({
        playlistTracks: [...this.state.playlistTracks, track],
      });
    }
  }

  removeTrack(track) {
    this.setState({
      playlistTracks: this.state.playlistTracks.filter(
        (t) => t.id !== track.id
      ),
    });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  search(term) {
    // Filtrar las canciones mock por término de búsqueda
    if (term.trim() === "") {
      this.setState({ searchResults: mockTracks });
      return;
    }

    const searchTerm = term.toLowerCase();
    const filtered = mockTracks.filter((track) => {
      return (
        track.name.toLowerCase().includes(searchTerm) ||
        track.artist.toLowerCase().includes(searchTerm) ||
        track.album.toLowerCase().includes(searchTerm)
      );
    });

    this.setState({ searchResults: filtered });
  }

  savePlaylist() {
    const { playlistName, playlistTracks } = this.state;

    if (!playlistName.trim()) {
      alert("Please enter a playlist name");
      return;
    }

    if (playlistTracks.length === 0) {
      alert("Please add songs to the playlist");
      return;
    }

    // Save to local storage
    playlistStorage.savePlaylist(playlistName, playlistTracks);
    this.updateSavedPlaylists();

    alert(`✓ Playlist "${playlistName}" saved locally!`);

    // Reset for new playlist
    this.setState({
      playlistName: "New Playlist",
      playlistTracks: [],
    });
  }

  loadPlaylist(playlistName) {
    const playlist = playlistStorage.getPlaylist(playlistName);
    if (playlist) {
      this.setState({
        playlistName: playlist.name,
        playlistTracks: playlist.tracks,
      });
    }
  }

  deletePlaylist(playlistName) {
    if (window.confirm(`Delete playlist "${playlistName}"?`)) {
      playlistStorage.deletePlaylist(playlistName);
      this.updateSavedPlaylists();

      // If deleted playlist is current, reset
      if (this.state.playlistName === playlistName) {
        this.setState({
          playlistName: "New Playlist",
          playlistTracks: [],
        });
      }
    }
  }

  render() {
    return (
      <div className="App">
        <div className="app-header">
          <h1>AstroTune</h1>
          <p>Your cyberpunk playlist manager</p>
        </div>

        {this.state.currentTrack && (
          <AudioPlayer
            track={this.state.currentTrack}
            onClose={this.stopTrack}
          />
        )}

        <div className="app-container">
          <SearchBar onSearch={this.search} />

          {this.state.savedPlaylists.length > 0 && (
            <div className="saved-playlists">
              <h3>Your Playlists</h3>
              <div className="playlist-buttons">
                {this.state.savedPlaylists.map((name) => (
                  <div key={name} className="playlist-button-group">
                    <button
                      className="playlist-load-btn"
                      onClick={() => this.loadPlaylist(name)}
                    >
                      {name}
                    </button>
                    <button
                      className="playlist-delete-btn"
                      onClick={() => this.deletePlaylist(name)}
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="app-content">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
              onPlay={this.playTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              onPlay={this.playTrack}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import Visualizer from "../Visualizer/Visualizer";
import TrackModal from "../TrackModal/TrackModal";
import Spotify from "../../util/Spotify";
import { mockTracks } from "../../data/mockTracks";
import playlistStorage from "../../util/playlistStorage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.audioRef = React.createRef();
    this.state = {
      searchResults: mockTracks,
      playlistName: "New Playlist",
      playlistTracks: [],
      currentTrack: null,
      isPlaying: false,
      volume: 0.7,
      savedPlaylists: [],
      selectedTrackForModal: null,
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
    this.newPlaylist = this.newPlaylist.bind(this);
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.showTrackModal = this.showTrackModal.bind(this);
    this.closeTrackModal = this.closeTrackModal.bind(this);
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

    // Handle audio playback/pause
    if (this.audioRef?.current) {
      if (this.state.isPlaying && this.audioRef.current.paused) {
        this.audioRef.current.play().catch(() => {
          console.log("Auto-play prevented");
        });
      } else if (!this.state.isPlaying && !this.audioRef.current.paused) {
        this.audioRef.current.pause();
      }
    }
  }

  updateSavedPlaylists() {
    const playlists = playlistStorage.getAllPlaylists();
    this.setState({ savedPlaylists: Object.keys(playlists) });
  }

  playTrack(track) {
    this.setState({ currentTrack: track, isPlaying: true });
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

  newPlaylist() {
    this.setState({
      playlistName: "New Playlist",
      playlistTracks: [],
    });
  }

  togglePlayPause() {
    this.setState({ isPlaying: !this.state.isPlaying });
  }

  handleVolumeChange(volume) {
    this.setState({ volume });
  }

  showTrackModal(track) {
    console.log("Modal abierto:", track);
    this.setState({ selectedTrackForModal: track });
  }

  closeTrackModal() {
    console.log("Modal cerrado");
    this.setState({ selectedTrackForModal: null });
  }

  render() {
    return (
      <div className="App">
        {/* Audio element - hidden but used for playback */}
        <audio
          ref={this.audioRef}
          src={this.state.currentTrack?.previewUrl}
          onEnded={() => {
            this.setState({ isPlaying: false });
          }}
        />

        <div className="app-header">
          <h1>AstroTune</h1>
          <p>Your cyberpunk playlist manager</p>
        </div>

        <div className="player-visualizer-container">
          {this.state.currentTrack && (
            <Visualizer
              audioRef={this.audioRef}
              currentTrack={this.state.currentTrack}
              isPlaying={this.state.isPlaying}
              onPlayPause={this.togglePlayPause}
              volume={this.state.volume}
              onVolumeChange={this.handleVolumeChange}
            />
          )}
        </div>

        <div className="app-container">
          <SearchBar onSearch={this.search} />

          {this.state.savedPlaylists.length > 0 && (
            <div className="saved-playlists">
              <div className="playlists-header">
                <h3>Your Playlists</h3>
                <button className="new-playlist-btn" onClick={this.newPlaylist}>
                  New Playlist
                </button>
              </div>
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
              onShowModal={this.showTrackModal}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              onPlay={this.playTrack}
              onShowModal={this.showTrackModal}
            />
          </div>
        </div>

        <TrackModal
          track={this.state.selectedTrackForModal}
          isOpen={!!this.state.selectedTrackForModal}
          onClose={this.closeTrackModal}
          onPlay={this.playTrack}
        />
      </div>
    );
  }
}

export default App;

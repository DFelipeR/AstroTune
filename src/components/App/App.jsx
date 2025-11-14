import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import Spotify from "../../util/Spotify";
import { mockTracks } from "../../data/mockTracks";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: mockTracks,
      playlistName: "New Playlist",
      playlistTracks: [],
      currentTrack: null,
      isPlaying: false,
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.search = this.search.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.playTrack = this.playTrack.bind(this);
    this.stopTrack = this.stopTrack.bind(this);
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
    const trackURIs = this.state.playlistTracks.map((track) => track.uri);
    // Llamar a Spotify.savePlaylist() para guardar en Spotify
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      // Después de guardar, limpiar la playlist
      this.setState({
        playlistName: "New Playlist",
        playlistTracks: [],
      });
    });
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

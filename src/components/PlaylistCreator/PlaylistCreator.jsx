import React from "react";
import "./PlaylistCreator.css";

class PlaylistCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      filteredTracks: props.allTracks || [],
    };
  }

  componentDidMount() {
    this.setState({ filteredTracks: this.props.allTracks || [] });
  }

  handleSearchChange = (query) => {
    this.setState({ searchQuery: query });
    const filtered = (this.props.allTracks || []).filter(
      (track) =>
        track.name.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase())
    );
    this.setState({ filteredTracks: filtered });
  };

  render() {
    const {
      isOpen,
      onClose,
      playlistName,
      playlistTracks,
      onNameChange,
      onAddTrack,
      onRemoveTrack,
      onSave,
      savedPlaylists,
      onShowPlaylist,
      onDeletePlaylist,
      onNewPlaylist,
    } = this.props;

    if (!isOpen) return null;

    const { searchQuery, filteredTracks } = this.state;

    return (
      <div className="playlist-creator-overlay">
        <div className="playlist-creator">
          {/* Header */}
          <div className="playlist-creator-header">
            <h1>Create Playlist</h1>
            <button className="close-btn" onClick={onClose} type="button">
              ✕
            </button>
          </div>

          {/* Main Content */}
          <div className="playlist-creator-content">
            {/* Left: Search & Available Tracks */}
            <div className="search-tracks-section">
              <div className="search-bar-section">
                <input
                  type="text"
                  className="playlist-search-input"
                  placeholder="Search songs..."
                  value={searchQuery}
                  onChange={(e) => this.handleSearchChange(e.target.value)}
                />
              </div>

              <div className="available-tracks">
                <h3>Available Songs</h3>
                <div className="tracks-list">
                  {filteredTracks.length === 0 ? (
                    <p className="empty-state">
                      {searchQuery ? "No songs found" : "No songs available"}
                    </p>
                  ) : (
                    filteredTracks.map((track) => (
                      <div key={track.id} className="track-item-creator">
                        <div className="track-details">
                          <p className="track-title">{track.name}</p>
                          <p className="track-artist">{track.artist}</p>
                        </div>
                        <button
                          className="add-track-btn"
                          onClick={() => onAddTrack(track)}
                          type="button"
                          title="Add to playlist"
                        >
                          +
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right: Playlist Preview & Settings */}
            <div className="playlist-preview-section">
              {/* Playlist Name */}
              <div className="playlist-name-input-group">
                <label>Playlist Name:</label>
                <input
                  type="text"
                  className="playlist-name-field"
                  value={playlistName}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="Enter playlist name"
                />
              </div>

              {/* Selected Tracks Preview */}
              <div className="selected-tracks-preview">
                <h3>Selected Songs ({playlistTracks.length})</h3>
                <div className="selected-tracks-list">
                  {playlistTracks.length === 0 ? (
                    <p className="empty-preview">
                      Add songs from the list on the left
                    </p>
                  ) : (
                    playlistTracks.map((track) => (
                      <div key={track.id} className="selected-track-item">
                        <div className="track-info-preview">
                          <p className="track-name-preview">{track.name}</p>
                          <p className="track-artist-preview">{track.artist}</p>
                        </div>
                        <button
                          className="remove-track-btn"
                          onClick={() => onRemoveTrack(track)}
                          type="button"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Save Button */}
              <button
                className="save-playlist-btn-large"
                onClick={onSave}
                type="button"
              >
                Save Playlist
              </button>

              {/* Your Playlists Section */}
              {savedPlaylists && savedPlaylists.length > 0 && (
                <div className="your-playlists-section">
                  <div className="your-playlists-header">
                    <h3>Your Playlists</h3>
                    <button
                      className="new-btn-small"
                      onClick={onNewPlaylist}
                      type="button"
                    >
                      New
                    </button>
                  </div>
                  <div className="your-playlists-list">
                    {savedPlaylists.map((name) => (
                      <div key={name} className="saved-playlist-row">
                        <button
                          className="view-saved-playlist-btn"
                          onClick={() => onShowPlaylist(name)}
                          type="button"
                        >
                          {name}
                        </button>
                        <button
                          className="delete-saved-playlist-btn"
                          onClick={() => onDeletePlaylist(name)}
                          type="button"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PlaylistCreator;

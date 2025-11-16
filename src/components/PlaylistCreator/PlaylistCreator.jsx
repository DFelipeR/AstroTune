import React from "react";
import "./PlaylistCreator.css";

class PlaylistCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      filteredTracks: props.allTracks || [],
      activeTab: "new", // "new" or "saved"
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

  switchTab = (tab) => {
    this.setState({ activeTab: tab });
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

    const { searchQuery, filteredTracks, activeTab } = this.state;
    const isTrackSelected = (trackId) =>
      playlistTracks.some((t) => t.id === trackId);

    return (
      <div className="playlist-creator-overlay">
        <div className="playlist-creator">
          {/* Header */}
          <div className="playlist-creator-header">
            <h1>Crear</h1>
            <button className="close-btn" onClick={onClose} type="button">
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="playlist-tabs">
            <button
              className={`tab-btn ${activeTab === "new" ? "active" : ""}`}
              onClick={() => this.switchTab("new")}
              type="button"
            >
              New Playlist
            </button>
            {savedPlaylists && savedPlaylists.length > 0 && (
              <button
                className={`tab-btn ${activeTab === "saved" ? "active" : ""}`}
                onClick={() => this.switchTab("saved")}
                type="button"
              >
                Your Playlists
              </button>
            )}
          </div>

          {/* Main Content */}
          <div className="playlist-creator-content">
            {activeTab === "new" ? (
              <>
                {/* New Playlist Tab */}
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
                          {searchQuery
                            ? "No songs found"
                            : "No songs available"}
                        </p>
                      ) : (
                        filteredTracks.map((track) => {
                          const selected = isTrackSelected(track.id);
                          return (
                            <div
                              key={track.id}
                              className={`track-item-creator ${
                                selected ? "selected" : ""
                              }`}
                              onClick={() =>
                                selected
                                  ? onRemoveTrack(track)
                                  : onAddTrack(track)
                              }
                            >
                              <div className="track-details">
                                <p className="track-title">{track.name}</p>
                                <p className="track-artist">{track.artist}</p>
                              </div>
                              <div className="selection-indicator">
                                {selected ? "✓" : ""}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Playlist Settings */}
                <div className="playlist-settings-section">
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

                  {/* Song Count */}
                  <div className="song-count">
                    <p>{playlistTracks.length} Songs Selected</p>
                  </div>

                  {/* Save Button */}
                  <button
                    className="save-playlist-btn-large"
                    onClick={onSave}
                    type="button"
                  >
                    Create Playlist
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Your Playlists Tab */}
                <div className="your-playlists-tab-section">
                  <div className="your-playlists-header-tab">
                    <h2>Your Playlists</h2>
                    <button
                      className="new-btn-tab"
                      onClick={onNewPlaylist}
                      type="button"
                    >
                      + New Playlist
                    </button>
                  </div>
                  <div className="your-playlists-grid">
                    {savedPlaylists && savedPlaylists.length > 0 ? (
                      savedPlaylists.map((name) => (
                        <div key={name} className="playlist-card">
                          <button
                            className="view-saved-playlist-btn-card"
                            onClick={() => onShowPlaylist(name)}
                            type="button"
                          >
                            <span className="playlist-icon">♪</span>
                            <span className="playlist-name">{name}</span>
                          </button>
                          <button
                            className="delete-saved-playlist-btn-card"
                            onClick={() => onDeletePlaylist(name)}
                            type="button"
                            title="Delete"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="no-playlists">No playlists created yet</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default PlaylistCreator;

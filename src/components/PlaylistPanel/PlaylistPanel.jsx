import React from "react";
import "./PlaylistPanel.css";

const PlaylistPanel = ({
  playlistName,
  playlistTracks,
  onNameChange,
  onRemove,
  onSave,
  onPlay,
  onShowModal,
  isOpen,
  onClose,
  savedPlaylists = [],
  onNewPlaylist,
  onShowPlaylist,
  onDeletePlaylist,
}) => {
  if (!isOpen) return null;

  return (
    <div className="playlist-panel-overlay" onClick={onClose}>
      <div className="playlist-panel" onClick={(e) => e.stopPropagation()}>
        <div className="playlist-panel-header">
          <h2>My Playlist</h2>
          <button
            className="playlist-close-btn"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="playlist-panel-content">
          <div className="playlist-name-section">
            <label>Playlist Name:</label>
            <input
              type="text"
              value={playlistName}
              onChange={(e) => onNameChange(e.target.value)}
              className="playlist-name-input"
              placeholder="Enter playlist name"
            />
          </div>

          <div className="playlist-tracks-section">
            <h3>{playlistTracks.length} Songs</h3>
            <div className="playlist-tracks-list">
              {playlistTracks.length === 0 ? (
                <p className="empty-message">Add songs from search results</p>
              ) : (
                playlistTracks.map((track) => (
                  <div key={track.id} className="playlist-track-item">
                    <div
                      className="track-info"
                      onClick={() => onShowModal(track)}
                    >
                      <p className="track-name">{track.name}</p>
                      <p className="track-artist">{track.artist}</p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => onRemove(track)}
                      title="Remove from playlist"
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <button className="save-playlist-btn" onClick={onSave} type="button">
            Save Playlist
          </button>

          {savedPlaylists && savedPlaylists.length > 0 && (
            <div className="saved-playlists-section">
              <div className="saved-playlists-header">
                <h3>Your Playlists</h3>
                <button
                  className="new-playlist-btn-modal"
                  onClick={onNewPlaylist}
                  type="button"
                >
                  New
                </button>
              </div>
              <div className="saved-playlists-list">
                {savedPlaylists.map((name) => (
                  <div key={name} className="saved-playlist-item">
                    <button
                      className="view-playlist-btn"
                      onClick={() => onShowPlaylist(name)}
                      type="button"
                    >
                      {name}
                    </button>
                    <button
                      className="delete-playlist-btn"
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
  );
};

export default PlaylistPanel;

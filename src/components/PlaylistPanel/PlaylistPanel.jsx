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
          <h2>Your Playlists</h2>
          <button
            className="playlist-close-btn"
            onClick={onClose}
            type="button"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="playlist-panel-content">
          {/* Playlists List */}
          {savedPlaylists && savedPlaylists.length > 0 ? (
            <div className="saved-playlists-list-main">
              {savedPlaylists.map((name) => (
                <div key={name} className="saved-playlist-item-main">
                  <button
                    className="view-playlist-btn-main"
                    onClick={() => onShowPlaylist(name)}
                    type="button"
                  >
                    {name}
                  </button>
                  <button
                    className="delete-playlist-btn-main"
                    onClick={() => onDeletePlaylist(name)}
                    type="button"
                    title="Delete playlist"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-playlists">
              No playlists created yet. Create one using the + button.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistPanel;

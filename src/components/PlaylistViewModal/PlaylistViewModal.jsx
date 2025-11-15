import React from "react";
import "./PlaylistViewModal.css";
import TrackList from "../TrackList/TrackList";

const PlaylistViewModal = ({
  isOpen,
  playlist,
  playlistName,
  onClose,
  onPlay,
  onShowModal,
}) => {
  if (!isOpen || !playlist) return null;

  return (
    <div className="PlaylistViewModal-overlay" onClick={onClose}>
      <div className="PlaylistViewModal" onClick={(e) => e.stopPropagation()}>
        <div className="PlaylistViewModal-header">
          <div className="PlaylistViewModal-title-section">
            <div className="PlaylistViewModal-icon">🎵</div>
            <div>
              <h2>{playlistName}</h2>
              <p className="PlaylistViewModal-count">
                {playlist.length}{" "}
                {playlist.length === 1 ? "canción" : "canciones"}
              </p>
            </div>
          </div>
          <button className="PlaylistViewModal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="PlaylistViewModal-content">
          {playlist.length === 0 ? (
            <div className="PlaylistViewModal-empty">
              <p>No hay canciones en esta playlist</p>
            </div>
          ) : (
            <TrackList
              tracks={playlist}
              onPlay={onPlay}
              onShowModal={onShowModal}
              isRemoval={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistViewModal;

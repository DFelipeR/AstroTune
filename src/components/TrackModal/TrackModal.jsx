import React from "react";
import "./TrackModal.css";

const TrackModal = ({ track, isOpen, onClose, onPlay }) => {
  if (!isOpen || !track) return null;

  return (
    <div className="track-modal-overlay" onClick={onClose}>
      <div className="track-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-album-art">
          <div className="album-icon">♪</div>
        </div>

        <div className="modal-content">
          <h2 className="modal-track-name">{track.name}</h2>
          <p className="modal-track-artist">{track.artist}</p>
          <p className="modal-track-album">{track.album}</p>

          <div className="modal-duration">
            <span className="duration-label">Duration:</span>
            <span className="duration-value">3:00</span>
          </div>

          <button
            className="modal-play-btn"
            onClick={() => {
              onPlay(track);
              onClose();
            }}
          >
            ▶ Play Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackModal;

import React, { useState } from "react";
import "./Track.css";

const Track = ({ track, onAdd, onRemove, isRemoval, onPlay, onShowModal }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const addTrack = () => {
    onAdd(track);
  };

  const removeTrack = () => {
    onRemove(track);
  };

  const playTrack = () => {
    if (onPlay) {
      onPlay(track);
    }
  };

  const showModal = () => {
    if (onShowModal) {
      onShowModal(track);
    }
  };

  const renderAction = () => {
    if (isRemoval) {
      return (
        <button
          className="Track-action"
          onClick={removeTrack}
          title="Remove from playlist"
        >
          ✕
        </button>
      );
    }
    return (
      <button
        className="Track-action"
        onClick={addTrack}
        title="Add to playlist"
      >
        +
      </button>
    );
  };

  return (
    <div className="Track">
      <div
        className="Track-album-art"
        onClick={showModal}
        title="Click to view details"
      >
        {track.imageUrl ? (
          <img
            src={track.imageUrl}
            alt={track.album}
            className="album-art-image"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
            style={{ display: imageLoaded ? "block" : "none" }}
          />
        ) : null}
        {!imageLoaded && <div className="album-note">♪</div>}
      </div>
      <div
        className="Track-information"
        onClick={showModal}
        style={{ cursor: "pointer" }}
      >
        <h3>{track.name}</h3>
        <p>
          {track.artist} | {track.album}
        </p>
      </div>
      <button className="Track-play" onClick={playTrack} title="Play preview">
        ▶
      </button>
      {renderAction()}
    </div>
  );
};

export default Track;

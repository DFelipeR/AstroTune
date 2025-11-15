import React from "react";
import "./Playlist.css";
import TrackList from "../TrackList/TrackList";

const Playlist = (props) => {
  const handleNameChange = (event) => {
    props.onNameChange(event.target.value);
  };

  return (
    <div className="Playlist">
      <div className="Playlist-header">
        <div>
          <input
            defaultValue={props.playlistName}
            onChange={handleNameChange}
            className="Playlist-input"
            placeholder="Playlist name..."
          />
          <p className="Playlist-track-count">
            {props.playlistTracks.length}{" "}
            {props.playlistTracks.length === 1 ? "canción" : "canciones"}
          </p>
        </div>
        <button className="Playlist-save" onClick={props.onSave}>
          Save Playlist
        </button>
      </div>
      <TrackList
        tracks={props.playlistTracks}
        onRemove={props.onRemove}
        onPlay={props.onPlay}
        onShowModal={props.onShowModal}
        isRemoval={true}
      />
    </div>
  );
};

export default Playlist;

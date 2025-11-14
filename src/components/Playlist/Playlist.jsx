import React from "react";
import "./Playlist.css";
import TrackList from "../TrackList/TrackList";

const Playlist = (props) => {
  const handleNameChange = (event) => {
    props.onNameChange(event.target.value);
  };

  return (
    <div className="Playlist">
      <input
        defaultValue={props.playlistName}
        onChange={handleNameChange}
        className="Playlist-input"
        placeholder="Playlist name..."
      />
      <TrackList
        tracks={props.playlistTracks}
        onRemove={props.onRemove}
        onPlay={props.onPlay}
        isRemoval={true}
      />
      <button className="Playlist-save" onClick={props.onSave}>
        Save Playlist
      </button>
    </div>
  );
};

export default Playlist;

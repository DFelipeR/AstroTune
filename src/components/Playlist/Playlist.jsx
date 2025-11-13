import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

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
      />
      <TrackList
        tracks={props.playlistTracks}
        onRemove={props.onRemove}
        isRemoval={true}
      />
      <button className="Playlist-save" onClick={props.onSave}>
        Guardar en Spotify
      </button>
    </div>
  );
};

export default Playlist;

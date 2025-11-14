import React from "react";
import "./TrackList.css";
import Track from "../Track/Track";

const TrackList = (props) => {
  return (
    <div className="TrackList">
      {props.tracks.map((track) => (
        <Track
          track={track}
          key={track.id}
          onAdd={props.onAdd}
          onRemove={props.onRemove}
          onPlay={props.onPlay}
          isRemoval={props.isRemoval}
        />
      ))}
    </div>
  );
};

export default TrackList;

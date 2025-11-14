import React from "react";
import "./SearchResults.css";
import TrackList from "../TrackList/TrackList";

const SearchResults = (props) => {
  return (
    <div className="SearchResults">
      <h2>Search Results</h2>
      <TrackList
        tracks={props.searchResults}
        onAdd={props.onAdd}
        onPlay={props.onPlay}
        isRemoval={false}
      />
    </div>
  );
};

export default SearchResults;

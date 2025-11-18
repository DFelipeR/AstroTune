import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = (props) => {
  const [term, setTerm] = useState("");

  const handleTermChange = (event) => {
    const value = event.target.value;
    setTerm(value);
    // Real-time search
    props.onSearch(value);
  };

  const handleClear = () => {
    setTerm("");
    props.onSearch("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className="SearchBar">
      <input
        className="SearchBar-input"
        placeholder="Search a song, artist or album..."
        value={term}
        onChange={handleTermChange}
        onKeyPress={handleKeyPress}
      />
      {term && (
        <button className="SearchBar-clear" onClick={handleClear}>
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;

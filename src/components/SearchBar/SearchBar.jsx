import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = (props) => {
  const [term, setTerm] = useState("");

  const handleTermChange = (event) => {
    setTerm(event.target.value);
  };

  const handleSearch = () => {
    if (term.trim()) {
      props.onSearch(term);
      setTerm("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
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
      <button className="SearchBar-button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;

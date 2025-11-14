#!/usr/bin/env pwsh
# Script para recrear todos los componentes React de AstroTune

$componentsPath = "src/components"

# Crear carpetas
@("SearchBar", "SearchResults", "Playlist", "TrackList", "Track") | ForEach-Object {
  New-Item -ItemType Directory -Path "$componentsPath/$_" -Force | Out-Null
  Write-Host "Carpeta creada: $_"
}

# SearchBar Component
$searchBarJsx = @'
import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = (props) => {
  const [term, setTerm] = useState('');

  const handleTermChange = (event) => {
    setTerm(event.target.value);
  };

  const handleSearch = () => {
    if (term.trim()) {
      props.onSearch(term);
      setTerm('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="SearchBar">
      <input
        className="SearchBar-input"
        placeholder="Busca una canción, artista o álbum..."
        value={term}
        onChange={handleTermChange}
        onKeyPress={handleKeyPress}
      />
      <button className="SearchBar-button" onClick={handleSearch}>
        Buscar
      </button>
    </div>
  );
};

export default SearchBar;
'@

$searchBarJsx | Out-File -Encoding utf8 "$componentsPath/SearchBar/SearchBar.jsx"
Write-Host "SearchBar.jsx creado"

# SearchResults Component
$searchResultsJsx = @'
import React from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';

const SearchResults = (props) => {
  return (
    <div className="SearchResults">
      <h2>Resultados</h2>
      <TrackList
        tracks={props.searchResults}
        onAdd={props.onAdd}
        isRemoval={false}
      />
    </div>
  );
};

export default SearchResults;
'@

$searchResultsJsx | Out-File -Encoding utf8 "$componentsPath/SearchResults/SearchResults.jsx"
Write-Host "SearchResults.jsx creado"

# Playlist Component
$playlistJsx = @'
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
'@

$playlistJsx | Out-File -Encoding utf8 "$componentsPath/Playlist/Playlist.jsx"
Write-Host "Playlist.jsx creado"

# TrackList Component
$trackListJsx = @'
import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

const TrackList = (props) => {
  return (
    <div className="TrackList">
      {props.tracks.map(track => (
        <Track
          track={track}
          key={track.id}
          onAdd={props.onAdd}
          onRemove={props.onRemove}
          isRemoval={props.isRemoval}
        />
      ))}
    </div>
  );
};

export default TrackList;
'@

$trackListJsx | Out-File -Encoding utf8 "$componentsPath/TrackList/TrackList.jsx"
Write-Host "TrackList.jsx creado"

# Track Component
$trackJsx = @'
import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  renderAction() {
    if (this.props.isRemoval) {
      return (
        <button className="Track-action" onClick={this.removeTrack}>
          −
        </button>
      );
    }
    return (
      <button className="Track-action" onClick={this.addTrack}>
        +
      </button>
    );
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>
            {this.props.track.artist} | {this.props.track.album}
          </p>
        </div>
        {this.renderAction()}
      </div>
    );
  }
}

export default Track;
'@

$trackJsx | Out-File -Encoding utf8 "$componentsPath/Track/Track.jsx"
Write-Host "Track.jsx creado"

Write-Host "`n✅ Todos los componentes JSX han sido recreados correctamente!"

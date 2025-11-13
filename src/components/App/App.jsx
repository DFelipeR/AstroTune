import React from 'react';import React from 'react';import React from "react";

import './App.css';

import SearchBar from '../SearchBar/SearchBar';import './App.css';import "./App.css";

import SearchResults from '../SearchResults/SearchResults';

import Playlist from '../Playlist/Playlist';import SearchBar from '../SearchBar/SearchBar';import SearchBar from "../SearchBar/SearchBar";



class App extends React.Component {import SearchResults from '../SearchResults/SearchResults';import SearchResults from "../SearchResults/SearchResults";

  constructor(props) {

    super(props);import Playlist from '../Playlist/Playlist';import Playlist from "../Playlist/Playlist";

    this.state = {

      searchResults: [],

      playlistName: 'Nueva Playlist',

      playlistTracks: [],class App extends React.Component {class App extends React.Component {

    };

  constructor(props) {  constructor(props) {

    this.addTrack = this.addTrack.bind(this);

    this.removeTrack = this.removeTrack.bind(this);    super(props);    super(props);

    this.updatePlaylistName = this.updatePlaylistName.bind(this);

    this.search = this.search.bind(this);    this.state = {

    this.savePlaylist = this.savePlaylist.bind(this);

  }      searchResults: [],    this.state = {



  addTrack(track) {      playlistName: 'Nueva Playlist',      // DUMMY DATA: Ahora incluye la propiedad 'uri'

    // Verificar si la canción ya existe en la playlist

    const trackExists = this.state.playlistTracks.some(      playlistTracks: [],      searchResults: [

      (t) => t.id === track.id

    );    };        {



    if (!trackExists) {          id: 1,

      this.setState({

        playlistTracks: [...this.state.playlistTracks, track],    this.addTrack = this.addTrack.bind(this);          name: "Adventure of a Lifetime",

      });

    }    this.removeTrack = this.removeTrack.bind(this);          artist: "Coldplay",

  }

    this.updatePlaylistName = this.updatePlaylistName.bind(this);          album: "A Head Full of Dreams",

  removeTrack(track) {

    // Remover una canción de la playlist    this.search = this.search.bind(this);          uri: "spotify:track:1",

    this.setState({

      playlistTracks: this.state.playlistTracks.filter(    this.savePlaylist = this.savePlaylist.bind(this);        },

        (t) => t.id !== track.id

      ),  }        {

    });

  }          id: 2,



  updatePlaylistName(name) {  addTrack(track) {          name: "The Less I Know The Better",

    // Actualizar el nombre de la playlist

    this.setState({ playlistName: name });    // Verificar si la canción ya existe          artist: "Tame Impala",

  }

    const trackExists = this.state.playlistTracks.some(          album: "Currents",

  search(term) {

    // Placeholder para integración con Spotify API      (t) => t.id === track.id          uri: "spotify:track:2",

    console.log('Buscando:', term);

    // TODO: Implementar búsqueda con Spotify API    );        },

  }

        {

  savePlaylist() {

    // Generar array de URIs de las canciones    if (!trackExists) {          id: 3,

    const trackURIs = this.state.playlistTracks.map((track) => track.uri);

    console.log('Guardando playlist:', this.state.playlistName);      this.setState({          name: "Blinding Lights",

    console.log('Tracks URIs:', trackURIs);

        playlistTracks: [...this.state.playlistTracks, track],          artist: "The Weeknd",

    // Reset de estado después de guardar

    this.setState({      });          album: "After Hours",

      playlistName: 'Nueva Playlist',

      playlistTracks: [],    }          uri: "spotify:track:3",

    });

  }        },

    // TODO: Implementar integración con Spotify para guardar

  }      ],



  render() {  removeTrack(track) {      playlistName: "Mi Lista de Favoritos",

    return (

      <div className="App">    this.setState({      playlistTracks: [

        <div className="app-header">

          <h1>🎵 AstroTune</h1>      playlistTracks: this.state.playlistTracks.filter(        {

          <p>Tu gestor de playlists cyberpunk</p>

        </div>        (t) => t.id !== track.id          id: 4,



        <div className="app-container">      ),          name: "Shape of My Heart",

          <SearchBar onSearch={this.search} />

          <div className="app-content">    });          artist: "Sting",

            <SearchResults

              searchResults={this.state.searchResults}  }          album: "Ten Summoner's Tales",

              onAdd={this.addTrack}

            />          uri: "spotify:track:4",

            <Playlist

              playlistName={this.state.playlistName}  updatePlaylistName(name) {        },

              playlistTracks={this.state.playlistTracks}

              onRemove={this.removeTrack}    this.setState({ playlistName: name });        {

              onNameChange={this.updatePlaylistName}

              onSave={this.savePlaylist}  }          id: 5,

            />

          </div>          name: "Fast Car",

        </div>

      </div>  search(term) {          artist: "Tracy Chapman",

    );

  }    // Placeholder para Spotify API          album: "Tracy Chapman",

}

    console.log('Buscando:', term);          uri: "spotify:track:5",

export default App;

    // TODO: Implementar búsqueda con Spotify API        },

  }      ],

    };

  savePlaylist() {

    // Generar URIs de las canciones    // Binding de métodos

    const trackURIs = this.state.playlistTracks.map((track) => track.uri);    this.addTrack = this.addTrack.bind(this);

    console.log('Guardando playlist:', this.state.playlistName);    this.removeTrack = this.removeTrack.bind(this);

    console.log('Tracks URIs:', trackURIs);    this.updatePlaylistName = this.updatePlaylistName.bind(this);

    // PASO 68: Binding del método de Búsqueda

    // Reset de estado    this.search = this.search.bind(this);

    this.setState({    this.savePlaylist = this.savePlaylist.bind(this);

      playlistName: 'Nueva Playlist',  }

      playlistTracks: [],

    });  // Método para añadir canción

  addTrack(track) {

    // TODO: Implementar guardado en Spotify    let tracks = this.state.playlistTracks;

  }    if (tracks.find((savedTrack) => savedTrack.id === track.id)) {

      return;

  render() {    }

    return (    tracks.push(track);

      <div className="App">    this.setState({ playlistTracks: tracks });

        <div className="app-header">  }

          <h1>🎵 AstroTune</h1>

          <p>Tu gestor de playlists cyberpunk</p>  // Método para actualizar el nombre de la playlist

        </div>  updatePlaylistName(name) {

    this.setState({ playlistName: name });

        <div className="app-container">  }

          <SearchBar onSearch={this.search} />

          <div className="app-content">  // Método para eliminar canción

            <SearchResults  removeTrack(track) {

              searchResults={this.state.searchResults}    let tracks = this.state.playlistTracks;

              onAdd={this.addTrack}    let newTracks = tracks.filter(

            />      (currentTrack) => currentTrack.id !== track.id

            <Playlist    );

              playlistName={this.state.playlistName}    this.setState({ playlistTracks: newTracks });

              playlistTracks={this.state.playlistTracks}  }

              onRemove={this.removeTrack}

              onNameChange={this.updatePlaylistName}  // PASO 67: Método de búsqueda

              onSave={this.savePlaylist}  search(term) {

            />    // ACEPTA EL TÉRMINO y lo imprime

          </div>    console.log(`Buscando en App.js el término: ${term}`);

        </div>    // Aquí es donde se conectará la API de Spotify en un paso posterior (Paso 66).

      </div>  }

    );

  }  // PASO 63: Método para guardar la playlist

}  savePlaylist() {

    // Genera un array de URIs

export default App;    const trackURIs = this.state.playlistTracks.map((track) => track.uri);


    console.log("URIs listos para guardar:", trackURIs);

    // PASO 62 (Parte 2): Resetear el estado después de 'guardar'
    this.setState({
      playlistName: "New Playlist",
      playlistTracks: [],
    });
  }

  // Método de Renderizado
  render() {
    return (
      <div className="App">
        <h1>
          Astro<span className="highlight">Tune</span>
        </h1>

        <SearchBar
          // PASO 68: Propagar el método 'search' a SearchBar
          onSearch={this.search}
        />
        <div className="App-playlist">
          <SearchResults
            searchResults={this.state.searchResults}
            onAdd={this.addTrack}
          />

          <Playlist
            playlistName={this.state.playlistName}
            playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist}
          />
        </div>
      </div>
    );
  }
}

export default App;

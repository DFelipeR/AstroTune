// ============================================
// VARIABLES GLOBALES
// ============================================
let accessToken = "";

// Tu Client ID de Spotify (registrado en developer.spotify.com)
const clientId = "8bec3d7dff78460baabcb77239be6cc1";
const redirectUri = "https://astrotune-music.surge.sh/";

// ============================================
// OBJETO SPOTIFY CON LOS 3 MÉTODOS
// ============================================
const Spotify = {
  /**
   * MÉTODO 1: Obtener el token de acceso del usuario
   * - Si ya tiene token, devolverlo
   * - Si está en la URL, extraerlo
   * - Si no existe, redirigir a Spotify para que autorice
   */
  getAccessToken() {
    // Paso 1: ¿Ya tenemos token guardado?
    if (accessToken) {
      return accessToken;
    }

    // Paso 2: Buscar token en la URL (después de que Spotify redirige)
    // La URL se ve así: http://localhost:5173/#access_token=xxxxx&expires_in=3600
    const accessTokenMatch = window.location.hash.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.hash.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      // Sí, extraer el token
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // Establecer un temporizador para limpiar el token cuando expire
      window.setTimeout(() => {
        accessToken = "";
      }, expiresIn * 1000);

      // Limpiar la URL para que no muestre el token
      window.history.pushState("Access Token", null, "/");

      return accessToken;
    } else {
      // Paso 4: No hay token, redirigir a Spotify para autenticación
      const scope = "playlist-modify-public";
      const redirectUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${encodeURIComponent(
        scope
      )}&redirect_uri=${encodeURIComponent(redirectUri)}&show_dialog=true`;
      window.location = redirectUrl;
    }
  },

  /**
   * MÉTODO 2: Buscar canciones en Spotify
   * Parámetro: term (ej: "Neon Dreams")
   * Retorna: Promise con array de canciones
   */
  search(term) {
    const accessToken = this.getAccessToken();

    // Hacer petición GET a Spotify API
    return (
      fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        // Convertir respuesta a JSON
        .then((response) => response.json())
        // Mapear los resultados
        .then((jsonResponse) => {
          if (!jsonResponse.tracks) {
            return [];
          }

          // Transformar los datos de Spotify a nuestro formato
          return jsonResponse.tracks.items.map((track) => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
          }));
        })
    );
  },

  /**
   * MÉTODO 3: Guardar playlist en Spotify
   * Parámetros:
   *   - name: nombre de la playlist
   *   - uris: array de track URIs
   */
  savePlaylist(name, uris) {
    // Validar que tenemos parámetros
    if (!name || !uris.length) {
      return;
    }

    const accessToken = this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    let userId;

    // Paso 1: Obtener el ID del usuario
    return (
      fetch("https://api.spotify.com/v1/me", { headers: headers })
        .then((response) => response.json())
        .then((jsonResponse) => {
          userId = jsonResponse.id;
        })
        // Paso 2: Crear una nueva playlist
        .then(() => {
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: headers,
            method: "POST",
            body: JSON.stringify({ name: name }),
          });
        })
        .then((response) => response.json())
        .then((jsonResponse) => {
          const playlistId = jsonResponse.id;

          // Paso 3: Agregar canciones a la playlist
          return fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
              headers: headers,
              method: "POST",
              body: JSON.stringify({ uris: uris }),
            }
          );
        })
    );
  },
};

// ============================================
// EXPORTAR EL OBJETO SPOTIFY
// ============================================
export default Spotify;

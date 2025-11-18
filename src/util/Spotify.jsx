// ============================================
// GLOBAL VARIABLES
// ============================================
let accessToken = "";

// Your Spotify Client ID (registered at developer.spotify.com)
const clientId = "8bec3d7dff78460baabcb77239be6cc1";
const redirectUri = "https://astrotune-music.surge.sh/";

// ============================================
// SPOTIFY OBJECT WITH 3 METHODS
// ============================================
const Spotify = {
  /**
   * METHOD 1: Get user access token
   * - If already has token, return it
   * - If it's in the URL, extract it
   * - If it doesn't exist, redirect to Spotify for authorization
   */
  getAccessToken() {
    // Step 1: Do we already have a saved token?
    if (accessToken) {
      return accessToken;
    }

    // Step 2: Search for token in URL (after Spotify redirects)
    // URL looks like: http://localhost:5173/#access_token=xxxxx&expires_in=3600
    const accessTokenMatch = window.location.hash.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.hash.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      // Yes, extract the token
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // Set a timer to clear the token when it expires
      window.setTimeout(() => {
        accessToken = "";
      }, expiresIn * 1000);

      // Clean the URL so it doesn't show the token
      window.history.pushState("Access Token", null, "/");

      return accessToken;
    } else {
      // Step 4: No token, redirect to Spotify for authentication
      const scope = "playlist-modify-public";
      const redirectUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${encodeURIComponent(
        scope
      )}&redirect_uri=${encodeURIComponent(redirectUri)}&show_dialog=true`;
      window.location = redirectUrl;
    }
  },

  /**
   * METHOD 2: Search songs in Spotify
   * Parameter: term (e.g., "Neon Dreams")
   * Returns: Promise with array of songs
   */
  search(term) {
    const accessToken = this.getAccessToken();

    // Make GET request to Spotify API
    return (
      fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        // Convert response to JSON
        .then((response) => response.json())
        // Map the results
        .then((jsonResponse) => {
          if (!jsonResponse.tracks) {
            return [];
          }

          // Transform Spotify data to our format
          return jsonResponse.tracks.items.map((track) => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
            // Add album image - take the first one (largest)
            imageUrl:
              track.album.images[0]?.url || "https://via.placeholder.com/300",
            // Add preview URL if available
            previewUrl: track.preview_url,
          }));
        })
    );
  },

  /**
   * METHOD 3: Save playlist to Spotify
   * Parameters:
   *   - name: playlist name
   *   - uris: array of track URIs
   */
  savePlaylist(name, uris) {
    // Validate that we have parameters
    if (!name || !uris.length) {
      return;
    }

    const accessToken = this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    let userId;

    // Step 1: Get user ID
    return (
      fetch("https://api.spotify.com/v1/me", { headers: headers })
        .then((response) => response.json())
        .then((jsonResponse) => {
          userId = jsonResponse.id;
        })
        // Step 2: Create a new playlist
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

          // Step 3: Add songs to the playlist
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
// EXPORT THE SPOTIFY OBJECT
// ============================================
export default Spotify;

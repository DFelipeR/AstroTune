import { useEffect, useState } from "react";

export const useSpotifyImage = (trackName, artistName) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!trackName || !artistName) {
      setLoading(false);
      return;
    }

    const fetchImage = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3001/api/track-image?trackName=${encodeURIComponent(
            trackName
          )}&artistName=${encodeURIComponent(artistName)}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const data = await response.json();
        setImageUrl(data.imageUrl);
        setError(null);
      } catch (err) {
        console.error("Error fetching track image:", err);
        setError(err.message);
        setImageUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [trackName, artistName]);

  return { imageUrl, loading, error };
};

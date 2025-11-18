import React, { useState, useEffect } from "react";
import "./DebugPanel.css";

const DebugPanel = () => {
  const [tracks, setTracks] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Dynamically import mockTracks
      import("../../data/mockTracks")
        .then((module) => {
          if (module.mockTracks && Array.isArray(module.mockTracks)) {
            const trackData = module.mockTracks.map((track) => ({
              id: track.id,
              name: track.name,
              artist: track.artist,
              album: track.album,
              previewUrl: track.previewUrl,
              imageUrl: track.imageUrl,
            }));
            setTracks(trackData);
            console.log("Loaded tracks:", trackData.length);
          } else {
            setError("mockTracks not found in module");
          }
        })
        .catch((err) => {
          console.error("Error importing mockTracks:", err);
          setError("Error importing mockTracks: " + err.message);
        });
    } catch (err) {
      console.error("Error:", err);
      setError("Error: " + err.message);
    }
  }, []);

  return (
    <div className="DebugPanel">
      <button
        className="DebugPanel-toggle"
        onClick={() => setOpen(!open)}
        title="Toggle Debug Panel"
      >
        🔍
      </button>

      {open && (
        <div className="DebugPanel-content">
          <h3>All Available Tracks</h3>
          {error ? (
            <p className="DebugPanel-error">{error}</p>
          ) : (
            <>
              <p className="DebugPanel-count">Total Tracks: {tracks.length}</p>

              <div className="DebugPanel-list">
                {tracks.length === 0 ? (
                  <p className="DebugPanel-empty">Loading tracks...</p>
                ) : (
                  <table className="DebugPanel-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Artist</th>
                        <th>Album</th>
                        <th>Preview URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tracks.map((track, index) => (
                        <tr key={index}>
                          <td>{track.id}</td>
                          <td>{track.name}</td>
                          <td>{track.artist}</td>
                          <td>{track.album}</td>
                          <td className="DebugPanel-url">
                            <code>{track.previewUrl}</code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="DebugPanel-actions">
                <button
                  onClick={() => {
                    const data = JSON.stringify(tracks, null, 2);
                    console.log("Tracks Data:", data);
                    alert(
                      "Check console (F12) for full track data. Total: " +
                        tracks.length
                    );
                  }}
                  className="DebugPanel-btn"
                >
                  Copy to Console
                </button>
                <button
                  onClick={() => {
                    const csv = [
                      ["ID", "Name", "Artist", "Album", "Preview URL"],
                      ...tracks.map((t) => [
                        t.id,
                        t.name,
                        t.artist,
                        t.album,
                        t.previewUrl,
                      ]),
                    ]
                      .map((row) => row.map((cell) => `"${cell}"`).join(","))
                      .join("\n");

                    const blob = new Blob([csv], { type: "text/csv" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "tracks-debug.csv";
                    a.click();
                  }}
                  className="DebugPanel-btn"
                >
                  Export CSV
                </button>
              </div>
            </>
          )}

          <button
            className="DebugPanel-close"
            onClick={() => setOpen(false)}
            title="Close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;

import React, { useEffect, useRef, useState, useCallback } from "react";
import "./AudioPlayer.css";

const AudioPlayer = ({
  track,
  onClose,
  audioRef,
  isPlaying,
  onPlayPause,
  volume,
  onVolumeChange,
}) => {
  const localAudioRef = audioRef || useRef(null);
  const sliderRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const animationFrameRef = useRef(null);

  // Smooth animation loop using requestAnimationFrame
  const updateProgressSmooth = useCallback(() => {
    if (localAudioRef.current && isPlaying) {
      const currentTimeValue = localAudioRef.current.currentTime;
      setCurrentTime(currentTimeValue);
      // Update slider input directly for smooth thumb movement
      if (sliderRef.current) {
        sliderRef.current.value = currentTimeValue;
      }
      animationFrameRef.current = requestAnimationFrame(updateProgressSmooth);
    }
  }, [isPlaying]);

  // Event handlers
  const handleTimeUpdate = useCallback(() => {
    if (localAudioRef.current) {
      setCurrentTime(localAudioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (localAudioRef.current) {
      console.log("Metadata loaded, duration:", localAudioRef.current.duration);
      setDuration(localAudioRef.current.duration);
    }
  }, []);

  const handleEnded = useCallback(() => {
    console.log("Audio ended");
    if (onPlayPause) onPlayPause();
  }, [onPlayPause]);

  const handleError = useCallback((e) => {
    console.error("Audio error:", e.target.error?.message || e);
  }, []);

  // Setup audio element with event listeners
  useEffect(() => {
    const audio = localAudioRef.current;
    if (!audio) return;

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("playing", () => console.log("Audio playing"));
    audio.addEventListener("pause", () => console.log("Audio paused"));

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("playing", () => {});
      audio.removeEventListener("pause", () => {});
    };
  }, [handleTimeUpdate, handleLoadedMetadata, handleEnded, handleError]);

  // Load track
  useEffect(() => {
    if (!track || !localAudioRef.current) return;

    console.log("Loading track:", track.name, "URL:", track.previewUrl);
    localAudioRef.current.src = track.previewUrl;
    localAudioRef.current.load();
    setCurrentTime(0);
    setDuration(0);
  }, [track]);

  // Handle play/pause
  useEffect(() => {
    const audio = localAudioRef.current;
    if (!audio) return;

    if (isPlaying) {
      console.log("Play requested");
      audio.play().catch((err) => {
        console.error("Play error:", err.name, err.message);
        if (onPlayPause) onPlayPause();
      });
      // Start smooth animation loop
      animationFrameRef.current = requestAnimationFrame(updateProgressSmooth);
    } else {
      console.log("Pause requested");
      audio.pause();
      // Cancel animation loop
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, updateProgressSmooth, onPlayPause]);

  // Handle volume
  useEffect(() => {
    if (localAudioRef.current) {
      localAudioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = () => {
    console.log("Play/pause clicked");
    if (onPlayPause) onPlayPause();
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    console.log("Seeking to:", newTime);
    if (localAudioRef.current) {
      localAudioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    console.log("Volume changed to:", newVolume);
    if (onVolumeChange) onVolumeChange(newVolume);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  if (!track) return null;

  return (
    <div className="AudioPlayer">
      <div className="AudioPlayer-header">
        <h3>Now Playing</h3>
        <button className="AudioPlayer-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <audio ref={localAudioRef} crossOrigin="anonymous" preload="auto" />

      <div className="AudioPlayer-info">
        <p className="AudioPlayer-track">{track.name}</p>
        <p className="AudioPlayer-artist">{track.artist}</p>
        <p className="AudioPlayer-album">{track.album}</p>
      </div>

      <div className="AudioPlayer-progress">
        <span className="AudioPlayer-time">{formatTime(currentTime)}</span>
        <input
          ref={sliderRef}
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          className="AudioPlayer-slider"
          style={{
            background: `linear-gradient(to right, #00FFFF 0%, #00FFFF ${progressPercent}%, #94a3b8 ${progressPercent}%, #94a3b8 100%)`,
          }}
        />
        <span className="AudioPlayer-duration">{formatTime(duration)}</span>
      </div>

      <div className="AudioPlayer-controls">
        <button className="AudioPlayer-skip-btn" title="Previous">
          ⏮
        </button>
        <button
          className={`AudioPlayer-button ${isPlaying ? "playing" : ""}`}
          onClick={handlePlayPause}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button className="AudioPlayer-skip-btn" title="Next">
          ⏭
        </button>
      </div>

      <div className="AudioPlayer-volume">
        <span className="AudioPlayer-volume-icon">🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="AudioPlayer-volume-slider"
          style={{
            background: `linear-gradient(to right, #00FFFF 0%, #00FFFF ${
              volume * 100
            }%, #94a3b8 ${volume * 100}%, #94a3b8 100%)`,
          }}
        />
        <span className="AudioPlayer-volume-value">
          {Math.round(volume * 100)}%
        </span>
      </div>

      <div className="AudioPlayer-visualizer">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="visualizer-bar"
            style={{
              animation: isPlaying ? `pulse 0.5s ease-in-out infinite` : "none",
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioPlayer;

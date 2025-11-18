import React, { useEffect, useRef, useState, useCallback } from "react";
import Visualizer from "../Visualizer/Visualizer";
import "./MusicPlayerModal.css";

const MusicPlayerModal = ({
  track,
  onClose,
  audioRef,
  isPlaying,
  onPlayPause,
  volume,
  onVolumeChange,
  onNextTrack,
  onPrevTrack,
  isModalOpen,
  onOpenModal,
  onCloseModal,
}) => {
  const localAudioRef = audioRef || useRef(null);
  const sliderRef = useRef(null);
  const previousTrackRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const animationFrameRef = useRef(null);
  const [audioData, setAudioData] = useState({
    bassLevel: 0,
    midLevel: 0,
    trebleLevel: 0,
  });

  // Smooth animation loop using requestAnimationFrame
  const updateProgressSmooth = useCallback(() => {
    if (localAudioRef.current) {
      const currentTimeValue = localAudioRef.current.currentTime;
      setCurrentTime(currentTimeValue);
      if (sliderRef.current) {
        sliderRef.current.value = currentTimeValue;
      }
    }
    animationFrameRef.current = requestAnimationFrame(updateProgressSmooth);
  }, []);

  // Event handlers
  const handleTimeUpdate = useCallback(() => {
    if (localAudioRef.current) {
      setCurrentTime(localAudioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (localAudioRef.current) {
      setDuration(localAudioRef.current.duration);
    }
  }, []);

  const handleEnded = useCallback(() => {
    if (onPlayPause) onPlayPause();
  }, [onPlayPause]);

  const handleError = useCallback((e) => {
    console.error("Audio error:", e.target.error?.message || e);
  }, []);

  // Monitorear cambios de tamaño de pantalla para desktop/mobile
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Setup audio element with event listeners
  useEffect(() => {
    const audio = localAudioRef.current;
    if (!audio) return;

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [handleTimeUpdate, handleLoadedMetadata, handleEnded, handleError]);

  // Load track and auto-show modal on desktop when track starts playing
  useEffect(() => {
    if (!track || !localAudioRef.current) return;

    // Only load new track if it's actually different from the previous one
    if (previousTrackRef.current?.id !== track.id) {
      localAudioRef.current.src = track.previewUrl;
      localAudioRef.current.load();
      setCurrentTime(0);
      setDuration(0);
      previousTrackRef.current = track;
    }
  }, [track?.id]);

  // Start continuous progress update loop when modal opens
  useEffect(() => {
    if (isModalOpen) {
      animationFrameRef.current = requestAnimationFrame(updateProgressSmooth);
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isModalOpen, updateProgressSmooth]);

  // Handle play/pause
  useEffect(() => {
    const audio = localAudioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error("Play error:", err.name, err.message);
        if (onPlayPause) onPlayPause();
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, onPlayPause]);

  // Handle volume
  useEffect(() => {
    if (localAudioRef.current) {
      localAudioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (onPlayPause) onPlayPause();
  };

  const handlePrevTrack = () => {
    if (onPrevTrack) onPrevTrack();
  };

  const handleNextTrack = () => {
    if (onNextTrack) onNextTrack();
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (localAudioRef.current) {
      localAudioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    // Apply volume directly to audio to avoid interruption
    if (localAudioRef.current) {
      localAudioRef.current.volume = newVolume;
    }
    // Update parent state after direct application
    if (onVolumeChange) onVolumeChange(newVolume);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  // Calculate dynamic background based on audio levels
  const getBackgroundStyle = () => {
    const { bassLevel, midLevel, trebleLevel } = audioData;

    // Create dynamic colors based on audio levels
    const bass = Math.floor(bassLevel * 255);
    const mid = Math.floor(midLevel * 255);
    const treble = Math.floor(trebleLevel * 255);

    const color1 = `rgba(${bass}, ${Math.floor(bass * 0.4)}, ${Math.floor(
      bass * 0.8
    )}, 0.6)`;
    const color2 = `rgba(${Math.floor(mid * 0.4)}, ${Math.floor(
      mid * 0.4
    )}, ${mid}, 0.6)`;
    const color3 = `rgba(${Math.floor(
      treble * 0.4
    )}, ${treble}, ${treble}, 0.6)`;

    return {
      background: `linear-gradient(135deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`,
      transition: "background 0.1s ease",
    };
  };

  const handleAudioData = useCallback((data) => {
    setAudioData(data);
  }, []);

  return (
    <>
      {/* Bottom Player Bar - Spotify Style */}
      <div className="MusicPlayerBar" onClick={track ? onOpenModal : undefined}>
        {/* Left Section - Track Info */}
        <div className="player-bar-left">
          <div className="player-bar-icon">
            {track?.imageUrl ? (
              <img
                src={track.imageUrl}
                alt={track?.album}
                className="player-bar-album-art"
              />
            ) : (
              <span>♪</span>
            )}
          </div>
          <div className="player-bar-text">
            <p className="player-bar-track">
              {track ? track.name : "No track selected"}
            </p>
            <p className="player-bar-artist">
              {track ? track.artist : "Play a song to start"}
            </p>
          </div>
        </div>

        {/* Center Section - Progress and Controls */}
        <div className="player-bar-center">
          <div className="player-bar-controls">
            <button
              className="player-bar-btn"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevTrack();
              }}
              title="Previous"
              disabled={!track}
            >
              ⏮
            </button>
            <button
              className={`player-bar-btn play-btn ${
                isPlaying ? "playing" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handlePlayPause();
              }}
              title={isPlaying ? "Pause" : "Play"}
              disabled={!track}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button
              className="player-bar-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleNextTrack();
              }}
              title="Next"
              disabled={!track}
            >
              ⏭
            </button>
          </div>
          <div className="player-bar-progress-section">
            <span className="time-display">{formatTime(currentTime)}</span>
            <input
              ref={sliderRef}
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className="progress-slider-bar"
              style={{
                background: `linear-gradient(to right, #00FFFF 0%, #00FFFF ${progressPercent}%, #94a3b8 ${progressPercent}%, #94a3b8 100%)`,
              }}
            />
            <span className="time-display">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Section - Volume */}
        <div className="player-bar-right">
          <span className="volume-icon">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider-bar"
            style={{
              background: `linear-gradient(to right, #00FFFF 0%, #00FFFF ${
                volume * 100
              }%, #94a3b8 ${volume * 100}%, #94a3b8 100%)`,
            }}
          />
        </div>
      </div>

      {/* Modal - Full Player for Mobile, Album Display for Desktop */}
      {isModalOpen && track && (
        <div className="MusicPlayerModal-overlay" onClick={onCloseModal}>
          <div
            className="MusicPlayerModal"
            onClick={(e) => e.stopPropagation()}
            style={getBackgroundStyle()}
          >
            {/* Close Button */}
            <button
              className="MusicPlayerModal-close"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onCloseModal();
              }}
              style={{ pointerEvents: isDesktop ? "all" : "auto" }}
            >
              ✕
            </button>

            {/* Album Art */}
            <div className="MusicPlayerModal-album">
              {track?.imageUrl ? (
                <img
                  src={track.imageUrl}
                  alt={track.album}
                  className="album-image"
                />
              ) : (
                <div className="album-placeholder">
                  <span>♪</span>
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="MusicPlayerModal-info">
              <h2 className="MusicPlayerModal-track">{track.name}</h2>
              <p className="MusicPlayerModal-artist">{track.artist}</p>
              <p className="MusicPlayerModal-album-text">{track.album}</p>
            </div>

            {/* Audio Visualizer - Desktop Only */}
            <Visualizer
              audioRef={localAudioRef}
              isPlaying={isPlaying}
              onAudioData={handleAudioData}
            />

            {/* Progress Bar - Mobile Only */}
            <div className="MusicPlayerModal-progress">
              <span className="time-display">{formatTime(currentTime)}</span>
              <input
                ref={sliderRef}
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleProgressChange}
                className="progress-slider"
                style={{
                  background: `linear-gradient(to right, #00FFFF 0%, #00FFFF ${progressPercent}%, #94a3b8 ${progressPercent}%, #94a3b8 100%)`,
                }}
                disabled={!track}
              />
              <span className="time-display">{formatTime(duration)}</span>
            </div>

            {/* Controls - Mobile Only */}
            <div className="MusicPlayerModal-controls">
              <button
                className="control-btn prev-btn"
                onClick={handlePrevTrack}
                title="Previous"
              >
                ⏮
              </button>
              <button
                className={`control-btn play-btn ${isPlaying ? "playing" : ""}`}
                onClick={handlePlayPause}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button
                className="control-btn next-btn"
                onClick={handleNextTrack}
                title="Next"
              >
                ⏭
              </button>
            </div>

            {/* Volume Control - Mobile Only */}
            <div className="MusicPlayerModal-volume">
              <span className="volume-icon">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                style={{
                  background: `linear-gradient(to right, #00FFFF 0%, #00FFFF ${
                    volume * 100
                  }%, #94a3b8 ${volume * 100}%, #94a3b8 100%)`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicPlayerModal;

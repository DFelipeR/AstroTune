import React, { useEffect, useRef, useState, useCallback } from "react";
import "./Visualizer.css";

let audioContext = null;
let analyser = null;
let source = null;

const SpotifyBottomPlayer = ({
  audioRef,
  currentTrack,
  isPlaying,
  onPlayPause,
  volume,
  onVolumeChange,
}) => {
  const canvasRef = useRef(null);
  const sliderRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const animationFrameRef = useRef(null);
  const visualizerAnimRef = useRef(null);

  // Update smooth progress
  const updateProgressSmooth = useCallback(() => {
    if (audioRef?.current && isPlaying) {
      const currentTimeValue = audioRef.current.currentTime;
      setCurrentTime(currentTimeValue);
      if (sliderRef.current) {
        sliderRef.current.value = currentTimeValue;
      }
      animationFrameRef.current = requestAnimationFrame(updateProgressSmooth);
    }
  }, [isPlaying, audioRef]);

  // Setup visualizer
  useEffect(() => {
    if (!audioRef?.current || !canvasRef.current) return;

    const audio = audioRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      try {
        source = audioContext.createMediaElementAudioSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
      } catch (e) {
        console.log("Already connected");
      }
    }

    if (audioContext.state === "suspended") {
      document.addEventListener("click", () => audioContext.resume(), {
        once: true,
      });
    }

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      visualizerAnimRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barCount = 128;
      const barWidth = canvas.width / barCount;
      const maxHeight = canvas.height * 0.7;

      for (let i = 0; i < barCount; i++) {
        const index = Math.floor((i / barCount) * dataArray.length);
        const barHeight = (dataArray[index] / 255) * maxHeight;

        ctx.fillStyle = `hsl(180, 100%, 50%)`; // Cyan color

        const x = i * barWidth + 1;
        const y = canvas.height - barHeight;
        const w = barWidth - 2;
        const h = barHeight;
        const r = w / 2;

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.fill();
      }
    };

    const handlePlay = () => {
      if (audioContext.state === "suspended") audioContext.resume();
      if (visualizerAnimRef.current)
        cancelAnimationFrame(visualizerAnimRef.current);
      draw();
    };

    const handlePause = () => {
      if (visualizerAnimRef.current)
        cancelAnimationFrame(visualizerAnimRef.current);
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (sliderRef.current) {
        sliderRef.current.value = audio.currentTime;
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioRef]);

  // Update smooth progress
  useEffect(() => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateProgressSmooth);
    }
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, updateProgressSmooth]);

  // Handle volume
  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);

  const handlePlayPause = () => {
    onPlayPause();
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef?.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (onVolumeChange) onVolumeChange(newVolume);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="spotify-player">
      <div className="player-left">
        <div className="player-album-art">
          <div className="album-placeholder">♪</div>
        </div>
        <div className="player-track-info">
          <div className="player-track-name">{currentTrack?.name}</div>
          <div className="player-track-artist">{currentTrack?.artist}</div>
        </div>
      </div>

      <div className="player-center">
        <button className="player-play-btn" onClick={handlePlayPause}>
          {isPlaying ? "⏸" : "▶"}
        </button>

        <div className="player-visualizer">
          <canvas
            ref={canvasRef}
            width={400}
            height={60}
            className="player-canvas"
          />
        </div>

        <div className="player-progress-section">
          <span className="player-time">{formatTime(currentTime)}</span>
          <input
            ref={sliderRef}
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="player-progress-slider"
            style={{
              background: `linear-gradient(to right, #00FFFF 0%, #00FFFF ${progressPercent}%, #1f2937 ${progressPercent}%, #1f2937 100%)`,
            }}
          />
          <span className="player-duration">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-right">
        <button className="player-btn volume-btn">🔊</button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="player-volume-slider"
          style={{
            background: `linear-gradient(to right, #00FFFF 0%, #00FFFF ${
              volume * 100
            }%, #1f2937 ${volume * 100}%, #1f2937 100%)`,
          }}
        />
      </div>
    </div>
  );
};

export default SpotifyBottomPlayer;

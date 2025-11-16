import React, { useEffect, useRef, useState, useCallback } from "react";
import "./Visualizer.css";

const SpotifyBottomPlayer = ({
  audioRef,
  currentTrack,
  isPlaying,
  onPlayPause,
  volume,
  onVolumeChange,
  onNextTrack,
  onPrevTrack,
}) => {
  const canvasRef = useRef(null);
  const sliderRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const animationFrameRef = useRef(null);
  const visualizerAnimRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  // Inicializar Web Audio API - más robusto
  const initAudioContext = useCallback(() => {
    if (audioContextRef.current || !audioRef?.current) return;

    try {
      const audioElement = audioRef.current;
      let context = audioContextRef.current;

      if (!context) {
        context = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = context;
      }

      if (context.state === "suspended") {
        context.resume().catch(() => {});
      }

      // Solo crear source una vez
      if (!sourceRef.current) {
        try {
          const source = context.createMediaElementAudioSource(audioElement);
          const analyser = context.createAnalyser();
          analyser.fftSize = 256;
          analyser.smoothingTimeConstant = 0.8;

          source.connect(analyser);
          analyser.connect(context.destination);

          analyserRef.current = analyser;
          sourceRef.current = source;

          console.log("Web Audio API inicializado correctamente");
        } catch (sourceError) {
          console.error("Error conectando source:", sourceError.message);
          // Fallback: crear analyser sin source
          const analyser = context.createAnalyser();
          analyser.fftSize = 256;
          analyserRef.current = analyser;
        }
      }
    } catch (e) {
      console.error("Error en Web Audio:", e.message);
    }
  }, [audioRef]);

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

  // Setup visualizer - FIXED VERSION
  useEffect(() => {
    if (!audioRef?.current || !canvasRef.current) return;

    const audio = audioRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Inicializar Web Audio una sola vez
    initAudioContext();

    let animationPhase = 0;
    let isDrawing = false;

    const draw = () => {
      // Siempre continuar dibujando
      visualizerAnimRef.current = requestAnimationFrame(draw);

      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 128;
      const barWidth = canvas.width / barCount;
      const maxHeight = canvas.height * 0.7;

      let dataArray = new Uint8Array(barCount);

      // Modo 1: Si Web Audio funciona
      if (analyserRef.current) {
        try {
          analyserRef.current.getByteFrequencyData(dataArray);
          // Si todos los valores son 0, usar fallback
          if (dataArray.every((v) => v === 0)) {
            // Usar animacion sinusoidal cuando no hay audio
            const timeProgression = (audio.currentTime || 0) * 2;
            for (let i = 0; i < barCount; i++) {
              const offset = (i / barCount) * Math.PI * 2;
              dataArray[i] = Math.sin(timeProgression + offset) * 40 + 40;
            }
          }
        } catch (e) {
          // Error en analyser, usar fallback
          for (let i = 0; i < barCount; i++) {
            dataArray[i] = Math.sin((i + animationPhase) * 0.05) * 60 + 30;
          }
          animationPhase += 0.3;
        }
      } else {
        // Modo 2: Sin Web Audio - animacion pura
        const timeProgression = (audio.currentTime || 0) * 2;
        for (let i = 0; i < barCount; i++) {
          const offset = (i / barCount) * Math.PI * 2;
          dataArray[i] = Math.sin(timeProgression + offset) * 60 + 40;
        }
      }

      // Dibujar barras
      for (let i = 0; i < barCount; i++) {
        const value = Math.max(0, dataArray[i]);
        const barHeight = (value / 255) * maxHeight;

        ctx.fillStyle = "hsl(180, 100%, 50%)";

        const x = i * barWidth + 1;
        const y = canvas.height - barHeight;
        const w = barWidth - 2;
        const h = barHeight;
        const r = Math.min(w / 2, 3);

        // Dibujar barra con bordes redondeados
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        if (h > 0) {
          ctx.quadraticCurveTo(x + w, y, x + w, y + r);
          ctx.lineTo(x + w, y + h - r);
          ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        } else {
          ctx.lineTo(x + w, y);
        }
        ctx.lineTo(x + r, y + h);
        if (h > 0) {
          ctx.quadraticCurveTo(x, y + h, x, y + h - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
        } else {
          ctx.lineTo(x, y);
        }
        ctx.fill();
      }
    };

    // Iniciar animacion
    draw();

    // Resume audio context on first interaction
    const resumeAudio = () => {
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume().catch(() => {});
      }
    };

    document.addEventListener("click", resumeAudio);

    return () => {
      if (visualizerAnimRef.current) {
        cancelAnimationFrame(visualizerAnimRef.current);
      }
      document.removeEventListener("click", resumeAudio);
    };
  }, [audioRef, initAudioContext]);

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

  // Handle audio events
  useEffect(() => {
    if (!audioRef?.current) return;

    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (sliderRef.current) {
        sliderRef.current.value = audio.currentTime;
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioRef]);

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
          <div className="player-track-name">
            {currentTrack?.name || "No track selected"}
          </div>
          <div className="player-track-artist">
            {currentTrack?.artist || "Select a song to play"}
          </div>
        </div>
      </div>

      <div className="player-center">
        <button
          className="player-nav-btn"
          onClick={onPrevTrack}
          title="Previous track"
          disabled={!currentTrack}
        >
          ⏮
        </button>

        <button
          className="player-play-btn"
          onClick={handlePlayPause}
          disabled={!currentTrack}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button
          className="player-nav-btn"
          onClick={onNextTrack}
          title="Next track"
          disabled={!currentTrack}
        >
          ⏭
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
            disabled={!currentTrack}
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

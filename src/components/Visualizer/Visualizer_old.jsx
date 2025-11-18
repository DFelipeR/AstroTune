import React, { useEffect, useRef } from "react";
import "./Visualizer.css";

const Visualizer = ({ audioRef, isPlaying, onAudioData }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const dataArrayRef = useRef(null);

  // Initialize Web Audio API
  useEffect(() => {
    if (!audioRef?.current) return;

    const setupAudio = async () => {
      try {
        // Create AudioContext
        if (!audioContextRef.current) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioContextRef.current = new AudioContext();
        }

        // Create analyser
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

        // Connect source only once
        if (!sourceRef.current) {
          const source = audioContextRef.current.createMediaElementSource(
            audioRef.current
          );
          source.connect(analyser);
          analyser.connect(audioContextRef.current.destination);
          sourceRef.current = source;
        }

        // Resume context
        if (audioContextRef.current.state === "suspended") {
          await audioContextRef.current.resume();
        }
      } catch (error) {
        console.error("Audio setup error:", error);
      }
    };

    setupAudio();

    // Resume on play
    const handlePlay = () => {
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume();
      }
    };

    audioRef.current.addEventListener("play", handlePlay);

    return () => {
      audioRef.current?.removeEventListener("play", handlePlay);
    };
  }, [audioRef]);

  // Draw visualizer - starts immediately and runs continuously
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    let phase = 0;
    let isActive = true;

    console.log("🎨 Visualizer animation starting...");

    const draw = () => {
      if (!isActive) return;
      animationRef.current = requestAnimationFrame(draw);

      const { width, height } = canvas;

      if (width === 0 || height === 0) return;

      // Clear canvas
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(10, 10, 31, 0.3)");
      gradient.addColorStop(1, "rgba(26, 26, 63, 0.3)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const barCount = 80;
      const barWidth = (width / barCount) * 0.75;
      const gap = (width / barCount) * 0.25;

      let bars = new Uint8Array(barCount);
      let bass = 0.2;
      let mid = 0.2;
      let treble = 0.2;

      // Always increment phase for continuous animation
      phase += 0.05;

      // Try to get audio data when playing
      if (analyserRef.current && isPlaying) {
        try {
          const data = dataArrayRef.current;
          analyserRef.current.getByteFrequencyData(data);

          // Process frequency data
          for (let i = 0; i < barCount; i++) {
            const idx = Math.floor((i / barCount) * data.length);
            let val = data[idx];

            // Boost frequencies
            if (i >= barCount * 0.65) val = Math.min(255, val * 2.5);
            else if (i >= barCount * 0.3) val = Math.min(255, val * 1.8);
            else val = Math.min(255, val * 1.5);

            bars[i] = Math.max(val, 20);
          }

          // Calculate levels
          const b = Math.floor(barCount * 0.3);
          const m = Math.floor(barCount * 0.65);

          let bSum = 0,
            mSum = 0,
            tSum = 0;
          for (let i = 0; i < b; i++) bSum += bars[i];
          for (let i = b; i < m; i++) mSum += bars[i];
          for (let i = m; i < barCount; i++) tSum += bars[i];

          bass = Math.max(bSum / b / 255, 0.2);
          mid = Math.max(mSum / (m - b) / 255, 0.2);
          treble = Math.max(tSum / (barCount - m) / 255, 0.2);
        } catch (err) {
          // If audio fails, use fallback
          for (let i = 0; i < barCount; i++) {
            const offset = (i / barCount) * Math.PI * 4;
            bars[i] = Math.abs(Math.sin(phase + offset)) * 100 + 25;
          }
          bass = Math.abs(Math.sin(phase)) * 0.3;
          mid = Math.abs(Math.sin(phase + 1)) * 0.3;
          treble = Math.abs(Math.sin(phase + 2)) * 0.3;
        }
      } else {
        // Fallback wave animation when not playing
        const intensity = isPlaying ? 100 : 40;
        const base = isPlaying ? 25 : 15;

        for (let i = 0; i < barCount; i++) {
          const offset = (i / barCount) * Math.PI * 4;
          bars[i] = Math.abs(Math.sin(phase + offset)) * intensity + base;
        }

        bass = Math.abs(Math.sin(phase)) * 0.3;
        mid = Math.abs(Math.sin(phase + 1)) * 0.3;
        treble = Math.abs(Math.sin(phase + 2)) * 0.3;
      }

      // Send data to parent
      if (onAudioData) {
        onAudioData({ bassLevel: bass, midLevel: mid, trebleLevel: treble });
      }

      // Draw bars
      for (let i = 0; i < barCount; i++) {
        const value = bars[i];
        const h = Math.min((value / 255) * height * 0.85, height);
        const barHeight = Math.max(h, 4);

        const x = i * (barWidth + gap);
        const y = height - barHeight;

        const grad = ctx.createLinearGradient(x, height, x, y);

        if (i < barCount * 0.3) {
          grad.addColorStop(0, "rgba(255, 0, 100, 0.7)");
          grad.addColorStop(1, "rgba(255, 0, 200, 1)");
          ctx.shadowColor = "#FF0064";
        } else if (i < barCount * 0.65) {
          grad.addColorStop(0, "rgba(102, 0, 255, 0.7)");
          grad.addColorStop(1, "rgba(153, 51, 255, 1)");
          ctx.shadowColor = "#6600FF";
        } else {
          grad.addColorStop(0, "rgba(0, 255, 255, 0.7)");
          grad.addColorStop(1, "rgba(0, 200, 255, 1)");
          ctx.shadowColor = "#00FFFF";
        }

        ctx.fillStyle = grad;
        ctx.shadowBlur = isPlaying ? 10 : 5;

        const r = Math.min(barWidth / 2, 3);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + barWidth - r, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
        ctx.lineTo(x + barWidth, height - r);
        ctx.quadraticCurveTo(x + barWidth, height, x + barWidth - r, height);
        ctx.lineTo(x + r, height);
        ctx.quadraticCurveTo(x, height, x, height - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
      }

      ctx.shadowBlur = 0;
    };

    draw();

    return () => {
      isActive = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []); // Empty dependencies - runs once and animates forever

  return (
    <div className="Visualizer">
      <canvas ref={canvasRef} className="Visualizer-canvas" />
    </div>
  );
};

export default Visualizer;

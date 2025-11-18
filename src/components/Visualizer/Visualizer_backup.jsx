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
        if (!audioContextRef.current) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioContextRef.current = new AudioContext();
          console.log("✓ AudioContext created");
        }

        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

        if (!sourceRef.current) {
          const source = audioContextRef.current.createMediaElementSource(
            audioRef.current
          );
          source.connect(analyser);
          analyser.connect(audioContextRef.current.destination);
          sourceRef.current = source;
          console.log("✓ Audio source connected");
        }

        if (audioContextRef.current.state === "suspended") {
          await audioContextRef.current.resume();
          console.log("✓ AudioContext resumed");
        }
      } catch (error) {
        console.error("❌ Audio setup error:", error);
      }
    };

    setupAudio();

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

  // Draw visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId = null;
    let phase = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      console.log(`Canvas size: ${canvas.width}x${canvas.height}`);
    };

    resize();
    window.addEventListener("resize", resize);

    console.log("🚀 Starting animation loop");

    const animate = () => {
      const { width, height } = canvas;

      // Clear
      ctx.fillStyle = "rgba(10, 10, 31, 0.5)";
      ctx.fillRect(0, 0, width, height);

      const barCount = 80;
      const barWidth = (width / barCount) * 0.7;
      const gap = (width / barCount) * 0.3;

      // Always animate
      phase += 0.05;

      // Generate wave
      for (let i = 0; i < barCount; i++) {
        const offset = (i / barCount) * Math.PI * 4;
        const value = Math.abs(Math.sin(phase + offset)) * 80 + 20;
        const h = (value / 100) * height * 0.8;

        const x = i * (barWidth + gap);
        const y = height - h;

        // Color based on position
        if (i < barCount * 0.3) {
          ctx.fillStyle = "#ff0064";
        } else if (i < barCount * 0.65) {
          ctx.fillStyle = "#9933ff";
        } else {
          ctx.fillStyle = "#00ffff";
        }

        ctx.fillRect(x, y, barWidth, h);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener("resize", resize);
      console.log("🛑 Animation stopped");
    };
  }, []);

  return (
    <div className="Visualizer">
      <canvas ref={canvasRef} className="Visualizer-canvas" />
    </div>
  );
};

export default Visualizer;

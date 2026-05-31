"use client";

import React, { useState, useEffect, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  rot: number;
  size: number;
}

interface Theme {
  id: string;
  name: string;
  color: string;
  glow: string;
}

const THEMES: Theme[] = [
  { id: "crimson", name: "Crimson Love", color: "#ff2a5f", glow: "rgba(255, 42, 95, 0.5)" },
  { id: "purple", name: "Cosmic Purple", color: "#a855f7", glow: "rgba(168, 85, 247, 0.5)" },
  { id: "pink", name: "Electric Pink", color: "#ec4899", glow: "rgba(236, 72, 153, 0.5)" },
  { id: "gold", name: "Amber Fire", color: "#f97316", glow: "rgba(249, 115, 22, 0.5)" },
  { id: "cyan", name: "Aurora Cyan", color: "#06b6d4", glow: "rgba(6, 182, 212, 0.5)" },
];

export default function Home() {
  const [bpm, setBpm] = useState<number>(75);
  const [activeTheme, setActiveTheme] = useState<Theme>(THEMES[0]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Periodic particle cleanup to prevent memory leaks
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles((prev) => prev.filter((p) => Date.now() - p.id < 1000));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  const handleHeartClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    // Get click coordinates relative to the heart-wrapper
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Spawn multiple micro-hearts
    const newParticles: Particle[] = Array.from({ length: 8 }).map((_, i) => {
      const angle = (Math.random() * 360 * Math.PI) / 180;
      const speed = 50 + Math.random() * 120;
      return {
        id: Date.now() + Math.random() + i,
        x: clickX,
        y: clickY,
        tx: Math.cos(angle) * speed,
        ty: -100 - Math.random() * 120, // drift upwards
        rot: (Math.random() - 0.5) * 120,
        size: 0.6 + Math.random() * 0.9,
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);
  };

  return (
    <div
      className="app-container"
      ref={containerRef}
      style={
        {
          "--heart-color": activeTheme.color,
          "--heart-glow": activeTheme.glow,
          "--pulse-duration": `${60 / bpm}s`,
        } as React.CSSProperties
      }
    >
      {/* Background Orbs */}
      <div className="glow-orb orb-1" />
      <div className="glow-orb orb-2" />

      {/* Main Glass Card */}
      <main className="glass-card">
        <h1 className="title">Honey&apos;s Heart</h1>
        <p className="subtitle">Touch the heart to release your feelings</p>

        {/* Heart Container */}
        <div className="heart-wrapper" onClick={handleHeartClick}>
          {/* Animated SVG Heart */}
          <svg
            className="heart-svg heart-pulse"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
              fill="url(#heartGradient)"
            />
            <defs>
              <radialGradient
                id="heartGradient"
                cx="35%"
                cy="35%"
                r="65%"
                fx="35%"
                fy="35%"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.4} />
                <stop offset="25%" stopColor="var(--heart-color)" />
                <stop offset="100%" stopColor="#8b0000" />
              </radialGradient>
            </defs>
          </svg>

          {/* Render Active Particles */}
          {particles.map((p) => (
            <svg
              key={p.id}
              className="particle-heart"
              viewBox="0 0 24 24"
              style={
                {
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  "--tx": `${p.tx}px`,
                  "--ty": `${p.ty}px`,
                  "--rot": `${p.rot}deg`,
                  transform: `translate(-50%, -50%) scale(${p.size})`,
                } as React.CSSProperties
              }
              width={20}
              height={20}
            >
              <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
            </svg>
          ))}
        </div>

        {/* Control Panel */}
        <div className="control-panel">
          {/* BPM Slider */}
          <div className="control-group">
            <div className="control-header">
              <span>HEART RATE</span>
              <span className="control-value">{bpm} BPM</span>
            </div>
            <input
              type="range"
              min="40"
              max="180"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="custom-range"
            />
          </div>

          {/* Color Palette Selector */}
          <div className="control-group">
            <div className="control-header">
              <span>COLOR PALETTE</span>
              <span className="control-value" style={{ color: activeTheme.color }}>
                {activeTheme.name}
              </span>
            </div>
            <div className="theme-picker">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme)}
                  className={`theme-dot ${activeTheme.id === theme.id ? "active" : ""}`}
                  style={
                    {
                      backgroundColor: theme.color,
                      color: theme.color,
                    } as React.CSSProperties
                  }
                  aria-label={`Select ${theme.name} theme`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Signature */}
      <footer className="footer">
        Made with <span>❤️</span> for Honey
      </footer>
    </div>
  );
}

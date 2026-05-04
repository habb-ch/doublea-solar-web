"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Abstrakte Premium-Visualisierung: Schweizer Hausdach mit Solarpanels,
 * Lichtreflexen und Energiefluss-Linien — komplett SVG, keine Stockbilder.
 */
export function HeroVisual() {
  const reduce = useReducedMotion();

  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-br from-[#0b1f33] via-[#0b1f33] to-[#07111d] shadow-[0_30px_80px_-30px_rgba(11,31,51,0.55)]">
      {/* Sun glow */}
      <div className="absolute -top-10 -right-10 size-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(245,184,65,0.42)_0%,transparent_60%)] blur-2xl" />
      {/* Emerald glow */}
      <div className="absolute -bottom-16 -left-16 size-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(107,160,37,0.38)_0%,transparent_60%)] blur-2xl" />

      <svg
        viewBox="0 0 600 480"
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="panel" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#1a3a55" />
            <stop offset="100%" stopColor="#0b1f33" />
          </linearGradient>
          <linearGradient id="panelHi" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id="roof" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#9aa4b1" />
            <stop offset="100%" stopColor="#5a6675" />
          </linearGradient>
          <linearGradient id="house" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#e7eef5" />
            <stop offset="100%" stopColor="#c7d2dd" />
          </linearGradient>
          <linearGradient id="energy" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(245,184,65,0)" />
            <stop offset="50%" stopColor="rgba(245,184,65,0.95)" />
            <stop offset="100%" stopColor="rgba(245,184,65,0)" />
          </linearGradient>
          <pattern
            id="cells"
            width="32"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <rect width="32" height="20" fill="url(#panel)" />
            <rect
              x="0.5"
              y="0.5"
              width="31"
              height="19"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
            />
            <line
              x1="16"
              y1="0"
              x2="16"
              y2="20"
              stroke="rgba(255,255,255,0.05)"
            />
          </pattern>
        </defs>

        {/* Subtle grid */}
        <g opacity="0.07" stroke="white" strokeWidth="0.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="480" />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2="600" y2={i * 40} />
          ))}
        </g>

        {/* House body */}
        <motion.g
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <polygon points="120,260 300,150 480,260 480,420 120,420" fill="url(#house)" />
          <polygon points="120,260 300,150 480,260" fill="url(#roof)" />
          <rect x="270" y="320" width="60" height="100" fill="#0b1f33" opacity="0.85" />
          <rect x="170" y="310" width="50" height="50" fill="#0b1f33" opacity="0.7" />
          <rect x="380" y="310" width="50" height="50" fill="#0b1f33" opacity="0.7" />
        </motion.g>

        {/* Panels — staggered tiles */}
        <g>
          {[
            { x: 175, y: 200, w: 70, h: 38, d: 0 },
            { x: 250, y: 195, w: 70, h: 38, d: 0.05 },
            { x: 325, y: 190, w: 70, h: 38, d: 0.1 },
            { x: 400, y: 195, w: 70, h: 38, d: 0.15 },
            { x: 175, y: 240, w: 70, h: 32, d: 0.2 },
            { x: 250, y: 235, w: 70, h: 32, d: 0.25 },
            { x: 325, y: 230, w: 70, h: 32, d: 0.3 },
            { x: 400, y: 235, w: 70, h: 32, d: 0.35 },
          ].map((p, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: reduce ? 0 : 0.2 + p.d,
                duration: reduce ? 0 : 0.5,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              style={{ transformOrigin: `${p.x + p.w / 2}px ${p.y + p.h / 2}px` }}
            >
              <rect
                x={p.x}
                y={p.y}
                width={p.w}
                height={p.h}
                fill="url(#cells)"
                rx="2"
              />
              <rect
                x={p.x}
                y={p.y}
                width={p.w}
                height={p.h * 0.45}
                fill="url(#panelHi)"
                rx="2"
              />
            </motion.g>
          ))}
        </g>

        {/* Energy flow lines */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.8, duration: reduce ? 0 : 0.6 }}
        >
          {[
            "M520,80 C460,140 420,200 480,260",
            "M540,140 C500,180 480,210 490,260",
            "M560,40 C500,120 470,180 470,255",
          ].map((d, i) => (
            <g key={i}>
              <path d={d} stroke="rgba(245,184,65,0.18)" strokeWidth="1.4" fill="none" />
              <motion.path
                d={d}
                stroke="url(#energy)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="40 240"
                animate={
                  reduce
                    ? { strokeDashoffset: 0 }
                    : { strokeDashoffset: [0, -280] }
                }
                transition={{
                  duration: 4 + i * 0.7,
                  repeat: reduce ? 0 : Infinity,
                  ease: "linear",
                }}
              />
            </g>
          ))}
        </motion.g>

        {/* Sun core */}
        <motion.circle
          cx="540"
          cy="70"
          r="22"
          fill="#f5b841"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.4, duration: reduce ? 0 : 0.5 }}
        />
        <motion.circle
          cx="540"
          cy="70"
          r="34"
          fill="rgba(245,184,65,0.22)"
          animate={
            reduce
              ? { scale: 1 }
              : { scale: [1, 1.08, 1], opacity: [0.6, 0.85, 0.6] }
          }
          transition={{ duration: 4, repeat: reduce ? 0 : Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "540px 70px" }}
        />
      </svg>

      {/* Foreground stat chip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.9, duration: reduce ? 0 : 0.5 }}
        className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center gap-3 rounded-2xl bg-white/8 px-4 py-3 text-xs text-white/85 backdrop-blur-md sm:left-6 sm:bottom-6 sm:right-auto sm:max-w-sm"
      >
        <span className="size-2 shrink-0 rounded-full bg-[color:var(--solar-emerald)]" />
        <span className="leading-snug">
          Standortanalyse · Auslegung · Förderung · Installation · Monitoring
        </span>
      </motion.div>
    </div>
  );
}

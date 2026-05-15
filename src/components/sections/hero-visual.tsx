"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Realistische Solardach-Szene als SVG: Schweizer Einfamilienhaus mit
 * geneigtem, voll belegtem Photovoltaik-Dach, Morgenhimmel, Sonne und
 * weichen Lichtreflexen. Komplett vektorbasiert — skaliert verlustfrei,
 * on-brand, kein Stockfoto. Auf Mobile flacher (16:10), auf Desktop 5:4.
 */
export function HeroVisual() {
  const reduce = useReducedMotion();

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-black/5 shadow-[0_30px_80px_-30px_rgba(11,31,51,0.55)] sm:aspect-[5/4]">
      <svg
        viewBox="0 0 600 480"
        className="absolute inset-0 size-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* Himmel: warmer Morgen oben → klares Blau */}
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FCE9C6" />
            <stop offset="32%" stopColor="#EBD4D0" />
            <stop offset="62%" stopColor="#B8C9DC" />
            <stop offset="100%" stopColor="#9DB6CE" />
          </linearGradient>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF3D6" />
            <stop offset="35%" stopColor="rgba(245,184,65,0.55)" />
            <stop offset="100%" stopColor="rgba(245,184,65,0)" />
          </radialGradient>
          {/* Dachfläche links (Schatten) und rechts (Sonne) */}
          <linearGradient id="roofShade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1d3a52" />
            <stop offset="100%" stopColor="#0e2336" />
          </linearGradient>
          <linearGradient id="roofLit" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#27496b" />
            <stop offset="100%" stopColor="#16304a" />
          </linearGradient>
          <linearGradient id="panelSheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.34)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F1ECE4" />
            <stop offset="100%" stopColor="#DAD2C6" />
          </linearGradient>
          <linearGradient id="wallSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D8CFC2" />
            <stop offset="100%" stopColor="#BEB4A4" />
          </linearGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9DAE7E" />
            <stop offset="100%" stopColor="#7C8E60" />
          </linearGradient>
        </defs>

        {/* Himmel */}
        <rect width="600" height="480" fill="url(#sky)" />

        {/* Sonne + Glow */}
        <circle cx="468" cy="96" r="150" fill="url(#sunGlow)" />
        <motion.circle
          cx="468"
          cy="96"
          r="30"
          fill="#FFE9B0"
          animate={
            reduce ? { opacity: 1 } : { opacity: [0.92, 1, 0.92] }
          }
          transition={{ duration: 5, repeat: reduce ? 0 : Infinity, ease: "easeInOut" }}
        />

        {/* Weiche Wolken */}
        <g fill="#ffffff" opacity="0.5">
          <ellipse cx="120" cy="80" rx="58" ry="17" />
          <ellipse cx="165" cy="70" rx="40" ry="14" />
          <ellipse cx="300" cy="135" rx="48" ry="13" opacity="0.7" />
        </g>

        {/* Wiese */}
        <rect x="0" y="392" width="600" height="88" fill="url(#ground)" />
        <path
          d="M0 392 Q 150 372 320 388 T 600 380 V480 H0 Z"
          fill="url(#ground)"
        />

        {/* Haus-Körper */}
        <g>
          {/* Seitenwand (Giebel, im Schatten) */}
          <polygon points="150,300 150,410 250,410 250,260 200,210" fill="url(#wallSide)" />
          {/* Frontwand */}
          <polygon points="250,260 250,410 470,410 470,260 360,200" fill="url(#wall)" />
          {/* Fenster Front */}
          <rect x="285" y="300" width="46" height="56" rx="3" fill="#27496b" />
          <rect x="285" y="300" width="46" height="28" rx="3" fill="rgba(255,255,255,0.22)" />
          <rect x="392" y="300" width="46" height="56" rx="3" fill="#27496b" />
          <rect x="392" y="300" width="46" height="28" rx="3" fill="rgba(255,255,255,0.22)" />
          {/* Tür */}
          <rect x="345" y="338" width="40" height="72" rx="2" fill="#1d3a52" />
        </g>

        {/* DACH — geneigt, 3/4-Perspektive, voll belegt */}
        {/* Linke (schattige) Dachfläche */}
        <polygon points="150,300 200,210 360,200 290,300" fill="url(#roofShade)" />
        {/* Rechte (sonnige) Dachfläche */}
        <polygon points="360,200 470,260 540,300 290,300" fill="url(#roofLit)" />

        {/* Panel-Raster links */}
        <g clipPath="url(#clipLeft)">
          <clipPath id="clipLeft">
            <polygon points="150,300 200,210 360,200 290,300" />
          </clipPath>
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 6 }).map((_, c) => {
              const x = 162 + c * 33 - r * 4;
              const y = 218 + r * 17;
              return (
                <rect
                  key={`l-${r}-${c}`}
                  x={x}
                  y={y}
                  width="29"
                  height="14"
                  fill="#0b1f33"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="0.6"
                  rx="1"
                />
              );
            }),
          )}
          <polygon
            points="150,300 200,210 360,200 290,300"
            fill="url(#panelSheen)"
            opacity="0.5"
          />
        </g>

        {/* Panel-Raster rechts (heller, Sonnenreflexion) */}
        <g clipPath="url(#clipRight)">
          <clipPath id="clipRight">
            <polygon points="360,200 470,260 540,300 290,300" />
          </clipPath>
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 7 }).map((_, c) => {
              const x = 300 + c * 33 + r * 4;
              const y = 212 + r * 17;
              return (
                <rect
                  key={`r-${r}-${c}`}
                  x={x}
                  y={y}
                  width="29"
                  height="14"
                  fill="#13314c"
                  stroke="rgba(255,255,255,0.10)"
                  strokeWidth="0.6"
                  rx="1"
                />
              );
            }),
          )}
          <motion.polygon
            points="360,200 470,260 540,300 290,300"
            fill="url(#panelSheen)"
            animate={reduce ? { opacity: 0.55 } : { opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: reduce ? 0 : Infinity, ease: "easeInOut" }}
          />
        </g>

        {/* Dachfirst-Linie */}
        <line x1="200" y1="210" x2="360" y2="200" stroke="#0b1f33" strokeWidth="2.5" />
        <line x1="360" y1="200" x2="290" y2="300" stroke="#0b1f33" strokeWidth="2" opacity="0.5" />

        {/* Atmosphäre / Lichtschleier */}
        <rect width="600" height="480" fill="url(#sunGlow)" opacity="0.12" />
      </svg>

      {/* Stat-Chip unten */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.6, duration: reduce ? 0 : 0.5 }}
        className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2 rounded-2xl bg-[color:var(--solar-navy)]/85 px-4 py-2.5 text-xs text-white/90 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm"
      >
        <span className="size-2 shrink-0 rounded-full bg-[color:var(--solar-emerald)]" />
        <span className="leading-snug">
          Standortanalyse · Auslegung · Förderung · Installation · Wartung
        </span>
      </motion.div>
    </div>
  );
}

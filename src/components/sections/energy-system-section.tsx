"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BatteryCharging,
  Cpu,
  Fan,
  Plug,
  PlugZap,
  SunMedium,
  TowerControl,
  Zap,
} from "lucide-react";

/**
 * "Ihr Energiesystem" — Infografik nach dem Vorbild grosser EVU-Diagramme,
 * adaptiert für die Schweiz und DoubleA Solar. Stilisierter Haus-Schnitt
 * als SVG, Hexagon-Badges als HTML-Overlay (für Icons + Labels +
 * Responsiveness), animierte Energiefluss-Linien. Auf Mobile wird statt
 * des räumlichen Diagramms eine gestapelte Komponentenliste gezeigt.
 */

type Node = {
  id: string;
  label: string;
  icon: typeof SunMedium;
  /** Position in % des Diagramm-Containers (Desktop). */
  x: number;
  y: number;
  tone: "grid" | "solar" | "managed";
};

const nodes: Node[] = [
  { id: "grid", label: "Netzanschluss", icon: TowerControl, x: 7, y: 40, tone: "grid" },
  { id: "meter", label: "Netzstrom (EVU)", icon: Zap, x: 24, y: 78, tone: "grid" },
  { id: "pv", label: "Photovoltaik­anlage", icon: SunMedium, x: 55, y: 12, tone: "solar" },
  { id: "carport", label: "Carport-Solar", icon: SunMedium, x: 33, y: 36, tone: "solar" },
  { id: "wallbox", label: "Wallbox", icon: PlugZap, x: 38, y: 66, tone: "managed" },
  { id: "heatpump", label: "Wärmepumpe", icon: Fan, x: 52, y: 50, tone: "managed" },
  { id: "inverter", label: "Wechselrichter", icon: Plug, x: 55, y: 82, tone: "solar" },
  { id: "storage", label: "Energiespeicher", icon: BatteryCharging, x: 70, y: 82, tone: "managed" },
  { id: "manager", label: "Energiemanager", icon: Cpu, x: 88, y: 60, tone: "managed" },
];

const toneClasses: Record<Node["tone"], string> = {
  grid: "border-[#b3334f] bg-[#b3334f] text-white",
  solar: "border-[color:var(--solar-emerald)] bg-[color:var(--solar-emerald)] text-white",
  managed: "border-[color:var(--solar-gold)] bg-[color:var(--solar-gold)] text-[color:var(--solar-navy)]",
};

const flows: { d: string; color: string; dur: number }[] = [
  // Grid ↔ Meter ↔ Wechselrichter (rot)
  { d: "M 7 46 L 7 78 L 22 78", color: "#b3334f", dur: 3.4 },
  { d: "M 26 78 L 53 78", color: "#b3334f", dur: 3.0 },
  // Solar → Wechselrichter (grün)
  { d: "M 55 18 L 55 60 L 55 78", color: "var(--solar-emerald)", dur: 2.6 },
  { d: "M 35 41 L 35 78 L 53 78", color: "var(--solar-emerald)", dur: 3.2 },
  // Wechselrichter → Speicher → Manager → Verbraucher (gold)
  { d: "M 57 80 L 68 80", color: "var(--solar-gold)", dur: 2.4 },
  { d: "M 72 78 L 86 78 L 88 64", color: "var(--solar-gold)", dur: 2.8 },
  { d: "M 86 60 L 54 54", color: "var(--solar-gold)", dur: 3.0 },
  { d: "M 86 60 L 40 66", color: "var(--solar-gold)", dur: 3.4 },
];

export function EnergySystemSection() {
  const reduce = useReducedMotion();

  return (
    <section className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--solar-emerald)]">
          Ihr Energiesystem
        </p>
        <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-[42px]">
          Alles greift ineinander – aus einer Hand geplant.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Photovoltaik, Speicher, Wärmepumpe, Wallbox und intelligente Steuerung
          arbeiten als ein System. Wir planen, installieren und betreuen alle
          Komponenten so, dass sie optimal zusammenspielen.
        </p>
      </div>

      {/* DESKTOP: räumliches Diagramm */}
      <div className="relative mt-12 hidden lg:block">
        <div className="relative mx-auto aspect-[16/8] w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-[#eef4fa] to-[#dde8f2]">
          <HouseScene />

          {/* Flow-Linien */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
            aria-hidden="true"
          >
            {flows.map((f, i) => (
              <g key={i}>
                <path d={f.d} fill="none" stroke={f.color} strokeWidth="0.5" opacity="0.2" />
                <motion.path
                  d={f.d}
                  fill="none"
                  stroke={f.color}
                  strokeWidth="0.7"
                  strokeLinecap="round"
                  strokeDasharray="3 9"
                  animate={reduce ? { strokeDashoffset: 0 } : { strokeDashoffset: [0, -24] }}
                  transition={{
                    duration: f.dur,
                    repeat: reduce ? 0 : Infinity,
                    ease: "linear",
                  }}
                />
              </g>
            ))}
          </svg>

          {/* Hexagon-Badges */}
          {nodes.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={`flex size-12 items-center justify-center border-2 ${toneClasses[n.tone]} shadow-md`}
                    style={{
                      clipPath:
                        "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="whitespace-nowrap rounded-md bg-white/85 px-2 py-0.5 text-[11px] font-semibold text-[color:var(--solar-navy)] shadow-sm backdrop-blur-sm">
                    {n.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <Legend />
      </div>

      {/* MOBILE: gestapelte Komponentenliste */}
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:hidden">
        {nodes.map((n, i) => {
          const Icon = n.icon;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: reduce ? 0 : i * 0.04, duration: reduce ? 0 : 0.4 }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <span
                className={`flex size-11 shrink-0 items-center justify-center border-2 ${toneClasses[n.tone]}`}
                style={{
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              >
                <Icon className="size-5" />
              </span>
              <span className="text-sm font-semibold text-foreground">
                {n.label}
              </span>
            </motion.div>
          );
        })}
        <div className="sm:col-span-2">
          <Legend />
        </div>
      </div>
    </section>
  );
}

function Legend() {
  const items = [
    { color: "#b3334f", label: "Netzstrom – Bezug & Einspeisung" },
    { color: "var(--solar-emerald)", label: "Solarstrom (DC) vom Dach" },
    { color: "var(--solar-gold)", label: "Gesteuerte Energieflüsse (Speicher, WP, EV)" },
  ];
  return (
    <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      {items.map((it) => (
        <li
          key={it.label}
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <span
            className="h-1 w-6 rounded-full"
            style={{ background: it.color }}
          />
          {it.label}
        </li>
      ))}
    </ul>
  );
}

/** Stilisierter Haus-Schnitt als SVG-Hintergrund (kein 3D-Render). */
function HouseScene() {
  return (
    <svg
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="esRoof" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1d3a52" />
          <stop offset="100%" stopColor="#0e2336" />
        </linearGradient>
        <linearGradient id="esWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e6ecf2" />
        </linearGradient>
        <linearGradient id="esGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfe0d0" />
          <stop offset="100%" stopColor="#b9d0bb" />
        </linearGradient>
      </defs>

      {/* Boden */}
      <ellipse cx="560" cy="470" rx="520" ry="60" fill="url(#esGround)" opacity="0.6" />

      {/* Strommast links */}
      <g stroke="#9aa7b4" strokeWidth="3" fill="none" opacity="0.7">
        <path d="M70 70 L70 360 M40 360 L100 360 M52 200 L88 200 M46 270 L94 270" />
        <path d="M40 90 L130 110 M40 130 L130 150" strokeWidth="1.6" />
      </g>

      {/* Carport mit Panels */}
      <g>
        <polygon points="300,330 470,330 450,300 320,300" fill="url(#esRoof)" />
        <g stroke="rgba(255,255,255,0.12)" strokeWidth="1">
          <line x1="335" y1="303" x2="318" y2="327" />
          <line x1="370" y1="303" x2="356" y2="327" />
          <line x1="405" y1="303" x2="394" y2="327" />
          <line x1="440" y1="303" x2="432" y2="327" />
        </g>
        <rect x="312" y="330" width="6" height="70" fill="#9aa7b4" />
        <rect x="452" y="330" width="6" height="70" fill="#9aa7b4" />
      </g>

      {/* Haus-Körper */}
      <g>
        <polygon points="560,150 760,150 860,230 660,230" fill="url(#esWall)" opacity="0.5" />
        <rect x="560" y="230" width="300" height="200" fill="url(#esWall)" />
        {/* Dach mit PV */}
        <polygon points="560,230 660,120 880,120 780,230" fill="url(#esRoof)" />
        <g stroke="rgba(255,255,255,0.14)" strokeWidth="1.4">
          {Array.from({ length: 7 }).map((_, c) => (
            <line
              key={c}
              x1={580 + c * 42}
              y1={228}
              x2={668 + c * 30}
              y2={128}
            />
          ))}
          {Array.from({ length: 4 }).map((_, r) => (
            <line
              key={r}
              x1={560 + r * 28}
              y1={230 - r * 30}
              x2={780 + r * 24}
              y2={230 - r * 30}
            />
          ))}
        </g>
        {/* Fenster */}
        <rect x="600" y="280" width="50" height="70" rx="3" fill="#27496b" opacity="0.85" />
        <rect x="690" y="280" width="50" height="70" rx="3" fill="#27496b" opacity="0.85" />
        <rect x="780" y="280" width="50" height="70" rx="3" fill="#27496b" opacity="0.85" />
        {/* Kamin */}
        <rect x="820" y="110" width="22" height="46" fill="#5a6675" />
      </g>
    </svg>
  );
}

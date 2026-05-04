import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "navy" | "light";
  /** Wenn true: nur das Symbol ohne Wortmarke (z.B. für Favicons / kleine UIs). */
  iconOnly?: boolean;
};

/**
 * Markenzeichen DoubleA Solar Solutions: Solarpanel-Dach in Form eines "A"
 * mit warmer Sonnen-Gradient an der linken Flanke. Komplett SVG, skaliert
 * verlustfrei, passt sich automatisch an dunkle und helle Sektionen an.
 */
export function Logo({ className, variant = "navy", iconOnly = false }: LogoProps) {
  const wordmark = variant === "navy" ? "var(--solar-navy)" : "#f8faf7";
  const muted = variant === "navy" ? "var(--muted-foreground)" : "rgba(248,250,247,0.65)";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-semibold tracking-tight",
        className,
      )}
      aria-label="DoubleA Solar Solutions"
    >
      <LogoMark className="size-9" />
      {!iconOnly && (
        <span className="flex flex-col leading-tight">
          <span className="text-[15px]" style={{ color: wordmark }}>
            DoubleA Solar
          </span>
          <span
            className="text-[10px] font-medium uppercase tracking-[0.22em]"
            style={{ color: muted }}
          >
            Solutions
          </span>
        </span>
      )}
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id="aaSun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7C84A" />
          <stop offset="55%" stopColor="#F5982F" />
          <stop offset="100%" stopColor="#F26B25" />
        </linearGradient>
        <linearGradient id="aaPanel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C7E37A" />
          <stop offset="100%" stopColor="#A8CC60" />
        </linearGradient>
        <linearGradient id="aaPanelHi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* Sonnen-Gradient an der linken A-Flanke */}
      <path
        d="M14 50 L31 12 L34 12 L19 50 Z"
        fill="url(#aaSun)"
      />

      {/* Rechte A-Flanke aus Solarpanels */}
      <g>
        {/* Obere Reihe – 3 Zellen */}
        <path d="M30 28 L36 12 L43 12 L37.5 28 Z" fill="url(#aaPanel)" />
        <path d="M37.5 28 L43 12 L50 12 L44.5 28 Z" fill="url(#aaPanel)" />
        <path d="M44.5 28 L50 12 L57 12 L51.5 28 Z" fill="url(#aaPanel)" />

        {/* Untere Reihe – 3 Zellen, leicht breiter wegen A-Form */}
        <path d="M24 50 L30 28 L37.5 28 L31.5 50 Z" fill="url(#aaPanel)" />
        <path d="M31.5 50 L37.5 28 L44.5 28 L38.5 50 Z" fill="url(#aaPanel)" />
        <path d="M38.5 50 L44.5 28 L51.5 28 L45.5 50 Z" fill="url(#aaPanel)" />

        {/* Subtle Glanz-Highlight nur auf oberer Reihe */}
        <path
          d="M30 28 L36 12 L57 12 L51.5 28 Z"
          fill="url(#aaPanelHi)"
        />

        {/* Zell-Trennlinien */}
        <g stroke="rgba(11,31,51,0.18)" strokeWidth="0.6" fill="none">
          <line x1="37.5" y1="28" x2="43" y2="12" />
          <line x1="44.5" y1="28" x2="50" y2="12" />
          <line x1="31.5" y1="50" x2="37.5" y2="28" />
          <line x1="38.5" y1="50" x2="44.5" y2="28" />
          <line x1="45.5" y1="50" x2="51.5" y2="28" />
          <line x1="30" y1="28" x2="51.5" y2="28" />
        </g>
      </g>

      {/* Bodenlinie */}
      <line
        x1="12"
        y1="52"
        x2="58"
        y2="52"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="1.2"
      />
    </svg>
  );
}

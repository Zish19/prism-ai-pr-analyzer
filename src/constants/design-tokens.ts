// ---------------------------------------------------------------------------
// PRISM Design Tokens
// Centralised design language consumed by components and Tailwind config.
// ---------------------------------------------------------------------------

/** Typography presets --------------------------------------------------------*/
export const typography = {
  hero: { fontSize: "4.5rem", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em" },
  h1:   { fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.025em" },
  h2:   { fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.02em" },
  h3:   { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.35, letterSpacing: "-0.015em" },
  body: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.6, letterSpacing: "0em" },
  caption: { fontSize: "0.8125rem", fontWeight: 500, lineHeight: 1.5, letterSpacing: "0.01em" },
  mono: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.7, letterSpacing: "0em" },
} as const;

/** Spacing scale (in px) ----------------------------------------------------*/
export const spacing = {
  "2xs": 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
  "4xl": 96,
} as const;

/** Border‑radius presets ----------------------------------------------------*/
export const borderRadius = {
  button: "0.625rem",   // 10px
  card: "1rem",         // 16px
  panel: "1.25rem",     // 20px
  badge: "9999px",      // pill
  input: "0.5rem",      // 8px
} as const;

/** Shadow presets -----------------------------------------------------------*/
export const shadows = {
  glass:
    "0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
  "elevation-sm": "0 2px 8px rgba(0,0,0,0.25)",
  "elevation-md": "0 4px 16px rgba(0,0,0,0.35)",
  "elevation-lg": "0 8px 32px rgba(0,0,0,0.45)",
  glow: "0 0 20px rgba(139,92,246,0.35), 0 0 60px rgba(6,182,212,0.15)",
  "glow-cyan": "0 0 20px rgba(6,182,212,0.3)",
  "glow-purple": "0 0 20px rgba(139,92,246,0.3)",
} as const;

/** Animation timing presets (ms) --------------------------------------------*/
export const animationTiming = {
  fast: 150,
  normal: 300,
  slow: 500,
  xslow: 800,
} as const;

/** Easing curves ------------------------------------------------------------*/
export const easings = {
  smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
  bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  spring: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

export type TypographyToken = keyof typeof typography;
export type SpacingToken = keyof typeof spacing;

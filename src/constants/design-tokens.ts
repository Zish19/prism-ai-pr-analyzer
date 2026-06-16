// ---------------------------------------------------------------------------
// PRISM Design Tokens — Minimal, grayscale-first
// ---------------------------------------------------------------------------

export const typography = {
  hero: { fontSize: "3rem", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em" },
  h1:   { fontSize: "1.875rem", fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.025em" },
  h2:   { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.015em" },
  h3:   { fontSize: "1rem", fontWeight: 600, lineHeight: 1.4, letterSpacing: "-0.01em" },
  body: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.6, letterSpacing: "0em" },
  caption: { fontSize: "0.75rem", fontWeight: 500, lineHeight: 1.5, letterSpacing: "0.01em" },
  mono: { fontSize: "0.8125rem", fontWeight: 400, lineHeight: 1.7, letterSpacing: "0em" },
} as const;

export const spacing = {
  "2xs": 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
} as const;

export const borderRadius = {
  button: "0.5rem",
  card: "0.75rem",
  panel: "0.75rem",
  badge: "9999px",
  input: "0.375rem",
} as const;

export const shadows = {
  subtle: "0 1px 2px rgba(0,0,0,0.3)",
  elevated: "0 4px 12px rgba(0,0,0,0.4)",
  inset: "inset 0 1px 0 rgba(255,255,255,0.03)",
} as const;

export const animationTiming = {
  fast: 150,
  normal: 200,
  slow: 400,
} as const;

export const easings = {
  smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
  spring: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

export type TypographyToken = keyof typeof typography;
export type SpacingToken = keyof typeof spacing;

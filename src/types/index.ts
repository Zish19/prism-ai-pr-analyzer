// ---------------------------------------------------------------------------
// PRISM Core Type Definitions
// ---------------------------------------------------------------------------

/** Risk severity levels used across the application */
export type RiskLevel = "low" | "medium" | "high" | "critical";

/** Review category dimensions */
export type ReviewCategory =
  | "security"
  | "performance"
  | "code-quality"
  | "architecture";

/** Status variants for UI components */
export type StatusVariant = "success" | "warning" | "danger";

/** Accent color options for PRISM components */
export type AccentColor = "purple" | "cyan" | "success" | "warning" | "danger";

/** Trend direction for metric displays */
export type TrendDirection = "up" | "down" | "neutral";

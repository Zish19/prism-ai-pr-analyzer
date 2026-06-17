export type Severity = "critical" | "high" | "medium" | "low";
export type Dimension = "security" | "performance" | "architecture" | "quality";

import type { FileDiff } from "@/data/mock-diff";

export interface AnalyzerEngine {
  name: string;
  analyze: (files: FileDiff[]) => Finding[];
}

export interface Finding {
  id: string;
  dimension: Dimension;
  severity: Severity;
  title: string;
  description: string;
  file?: string;
  line?: number;
}

export interface DimensionScore {
  score: number;
  issues: Finding[];
}

export interface ReviewResult {
  summary: string;
  mergeProbability: number;
  riskScore: number;
  riskLevel: "Critical" | "Risky" | "Moderate" | "Safe";
  scores: {
    security: DimensionScore;
    performance: DimensionScore;
    architecture: DimensionScore;
    quality: DimensionScore;
  };
  totalIssues: number;
}

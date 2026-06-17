export type Severity = "critical" | "high" | "medium" | "low";
export type Dimension = "security" | "performance" | "architecture" | "quality";

export interface Finding {
  id: string;
  dimension: Dimension;
  severity: Severity;
  message: string;
  file: string;
  line: number;
}

export interface DimensionScore {
  score: number;
  issues: Finding[];
}

export interface ReviewResult {
  summary: string;
  mergeProbability: number;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  scores: {
    security: DimensionScore;
    performance: DimensionScore;
    architecture: DimensionScore;
    quality: DimensionScore;
  };
  totalIssues: number;
}

export interface AnalyzerContext {
  file: string;
  lines: string[];
  startIndex: number; // For diff lines mapping
}

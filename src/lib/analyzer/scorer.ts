import { Dimension, DimensionScore, Finding, ReviewResult } from "./types";

const SEVERITY_WEIGHTS = {
  critical: 25,
  high: 15,
  medium: 8,
  low: 3,
};

function getRiskLevel(score: number): ReviewResult["riskLevel"] {
  if (score <= 20) return "Safe";
  if (score <= 45) return "Moderate";
  if (score <= 70) return "Risky";
  return "Critical";
}

function calculateDimensionScore(findings: Finding[]): DimensionScore {
  let penalty = 0;
  for (const finding of findings) {
    penalty += SEVERITY_WEIGHTS[finding.severity];
  }
  const score = Math.max(0, 100 - penalty);
  return {
    score,
    issues: findings,
  };
}

export function generateReviewResult(allFindings: Finding[]): ReviewResult {
  const securityFindings = allFindings.filter((f) => f.dimension === "security");
  const performanceFindings = allFindings.filter((f) => f.dimension === "performance");
  const architectureFindings = allFindings.filter((f) => f.dimension === "architecture");
  const qualityFindings = allFindings.filter((f) => f.dimension === "quality");

  const scores = {
    security: calculateDimensionScore(securityFindings),
    performance: calculateDimensionScore(performanceFindings),
    architecture: calculateDimensionScore(architectureFindings),
    quality: calculateDimensionScore(qualityFindings),
  };

  let totalPenalty = 0;
  for (const finding of allFindings) {
    totalPenalty += SEVERITY_WEIGHTS[finding.severity];
  }

  const finalScore = Math.min(totalPenalty, 100);
  const totalIssues = allFindings.length;
  const mergeProbability = Math.max(0, 100 - finalScore);

  let summary = `Analysis complete. Found ${totalIssues} potential risks across ${allFindings.length ? new Set(allFindings.map(f => f.dimension)).size : 0} dimensions.`;
  
  if (finalScore >= 71) {
    summary += " Critical risks detected; merging is highly discouraged without immediate remediation.";
  } else if (finalScore >= 46) {
    summary += " Significant risks detected; thorough review recommended before merge.";
  } else if (finalScore >= 21) {
    summary += " Moderate code smells detected. Consider addressing before merge.";
  } else {
    summary += " Code looks solid. Minimal risks detected.";
  }

  return {
    summary,
    mergeProbability,
    riskScore: finalScore,
    riskLevel: getRiskLevel(finalScore),
    scores,
    totalIssues,
  };
}

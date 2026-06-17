import type { Finding, DimensionScore, ReviewResult, Dimension } from "./types";
import { analyzeSecurity } from "./security";
import { analyzePerformance } from "./performance";
import { analyzeQuality } from "./quality";
import { analyzeArchitecture } from "./architecture";
import type { FileDiff } from "@/data/mock-diff";

const PENALTY_MAP: Record<string, number> = {
  critical: 20,
  high: 10,
  medium: 5,
  low: 2,
};

function calculateDimension(findings: Finding[], dimension: Dimension): DimensionScore {
  const dimensionFindings = findings.filter(f => f.dimension === dimension);
  
  const totalPenalty = dimensionFindings.reduce(
    (sum, finding) => sum + (PENALTY_MAP[finding.severity] || 0),
    0
  );
  
  const score = Math.max(0, 100 - totalPenalty);
  
  return {
    score,
    issues: dimensionFindings,
  };
}

export function analyzeDiffs(diffs: FileDiff[]): ReviewResult {
  const allFindings: Finding[] = [];
  
  // Extract added lines from all hunks for analysis
  for (const diff of diffs) {
    for (const hunk of diff.hunks) {
      const addedLines = hunk.lines.filter(l => l.type === "add" || l.type === "context");
      const linesText = addedLines.map(l => l.content);
      const startIndex = addedLines[0]?.lineNew || 1;
      
      const ctx = {
        file: diff.path,
        lines: linesText,
        startIndex,
      };
      
      allFindings.push(...analyzeSecurity(ctx));
      allFindings.push(...analyzePerformance(ctx));
      allFindings.push(...analyzeQuality(ctx));
      allFindings.push(...analyzeArchitecture(ctx));
    }
  }
  
  const security = calculateDimension(allFindings, "security");
  const performance = calculateDimension(allFindings, "performance");
  const architecture = calculateDimension(allFindings, "architecture");
  const quality = calculateDimension(allFindings, "quality");
  
  // Weighted average for merge probability
  const mergeProbability = Math.round(
    (security.score * 0.4) + 
    (performance.score * 0.25) + 
    (architecture.score * 0.2) + 
    (quality.score * 0.15)
  );
  
  let riskLevel: "Critical" | "High" | "Medium" | "Low" = "Low";
  let summary = "Well-structured code. Ready for merge.";
  
  if (mergeProbability < 70 || security.score < 80) {
    riskLevel = "Critical";
    summary = "Critical issues detected. Do not merge.";
  } else if (mergeProbability < 85 || performance.score < 85) {
    riskLevel = "High";
    summary = "Significant issues found. Revisions requested.";
  } else if (mergeProbability < 95) {
    riskLevel = "Medium";
    summary = "Minor suggestions around code structure and safety.";
  }
  
  return {
    summary,
    mergeProbability,
    riskLevel,
    scores: {
      security,
      performance,
      architecture,
      quality,
    },
    totalIssues: allFindings.length,
  };
}

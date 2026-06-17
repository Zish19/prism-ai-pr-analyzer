import { FileDiff } from "@/data/mock-diff";
import { AnalyzerEngine, Finding } from "./types";

const QUALITY_PATTERNS: Array<{
  regex: RegExp;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  confidence: "high" | "medium" | "low";
  confidenceReason: string;
}> = [
  {
    regex: /console\.(log|debug|info)\s*\(/,
    title: "Console Statement",
    description: "Console statement left in code. These should be removed before merging to production.",
    severity: "low",
    confidence: "high",
    confidenceReason: "Deterministic match: Direct usage of console logging methods.",
  },
  {
    regex: /\b(TODO|FIXME|HACK)\b/i,
    title: "Unresolved TODO",
    description: "A TODO, FIXME, or HACK comment was found. Ensure this doesn't represent incomplete critical logic.",
    severity: "low",
    confidence: "high",
    confidenceReason: "Deterministic match: Explicit technical debt markers.",
  },
  {
    regex: /\bvar\s+\w+/,
    title: "Usage of 'var'",
    description: "Found 'var' declaration. Use 'let' or 'const' for block-scoped variables.",
    severity: "low",
    confidence: "high",
    confidenceReason: "Deterministic match: Usage of legacy variable declaration.",
  },
  {
    regex: /:\s*any\b/,
    title: "Usage of 'any' type",
    description: "TypeScript 'any' type detected. This defeats the purpose of strong typing. Use 'unknown' or specific types.",
    severity: "medium",
    confidence: "high",
    confidenceReason: "Deterministic match: Explicit usage of 'any' type in TypeScript.",
  },
  {
    regex: /\b(?:const|let)\s+[a-z]\s*=/i,
    title: "Single-letter Variable",
    description: "A single-letter variable was declared. Use descriptive naming for better maintainability.",
    severity: "low",
    confidence: "low",
    confidenceReason: "Subjective metric: Single-letter variables may be acceptable in localized contexts (e.g., loops).",
  },
  {
    regex: /^\s*\/\/\s*(const|let|var|function|if|for|while|import|export)\b/,
    title: "Commented-out Code",
    description: "Code appears to be commented out. Remove dead code before merging.",
    severity: "low",
    confidence: "medium",
    confidenceReason: "Heuristic match: Commented lines resemble structural code, but could be documentation.",
  }
];

export const qualityEngine: AnalyzerEngine = {
  name: "quality",
  analyze: (files: FileDiff[]): Finding[] => {
    const findings: Finding[] = [];

    for (const file of files) {
      for (const hunk of file.hunks) {
        for (const line of hunk.lines) {
          if (line.type !== "add") continue;

          for (const pattern of QUALITY_PATTERNS) {
            if (pattern.regex.test(line.content)) {
              findings.push({
                dimension: "quality",
                severity: pattern.severity,
                confidence: pattern.confidence,
                confidenceReason: pattern.confidenceReason,
                title: pattern.title,
                description: pattern.description,
                file: file.path,
                line: line.lineNew,
                id: `qual-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              });
            }
          }
        }
      }
    }

    return findings;
  },
};

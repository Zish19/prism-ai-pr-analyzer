import { FileDiff } from "@/data/mock-diff";
import { AnalyzerEngine, Finding } from "./types";

const QUALITY_PATTERNS = [
  {
    regex: /console\.(log|debug|info)\s*\(/,
    title: "Console Statement",
    description: "Console statement left in code. These should be removed before merging to production.",
    severity: "low" as const,
  },
  {
    regex: /\b(TODO|FIXME|HACK)\b/i,
    title: "Unresolved TODO",
    description: "A TODO, FIXME, or HACK comment was found. Ensure this doesn't represent incomplete critical logic.",
    severity: "low" as const,
  },
  {
    regex: /\bvar\s+\w+/,
    title: "Usage of 'var'",
    description: "Found 'var' declaration. Use 'let' or 'const' for block-scoped variables.",
    severity: "low" as const,
  },
  {
    regex: /:\s*any\b/,
    title: "Usage of 'any' type",
    description: "TypeScript 'any' type detected. This defeats the purpose of strong typing. Use 'unknown' or specific types.",
    severity: "medium" as const,
  },
  {
    regex: /\b(?:const|let)\s+[a-z]\s*=/i,
    title: "Single-letter Variable",
    description: "A single-letter variable was declared. Use descriptive naming for better maintainability.",
    severity: "low" as const,
  },
  {
    regex: /^\s*\/\/\s*(const|let|var|function|if|for|while|import|export)\b/,
    title: "Commented-out Code",
    description: "Code appears to be commented out. Remove dead code before merging.",
    severity: "low" as const,
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

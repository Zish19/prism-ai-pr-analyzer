import type { Finding, AnalyzerContext } from "./types";

const QUALITY_RULES = [
  {
    regex: /\b(TODO|FIXME|XXX)\b/,
    message: "Unresolved developer note detected.",
    severity: "low" as const,
  },
  {
    regex: /console\.(log|debug|info)\s*\(/,
    message: "Development logging artifact left in code.",
    severity: "medium" as const,
  },
  {
    regex: /^\s*\/\/\s*if\s*\(.*\)\s*\{/i,
    message: "Commented out logic detected. Remove dead code.",
    severity: "low" as const,
  }
];

export function analyzeQuality(context: AnalyzerContext): Finding[] {
  const findings: Finding[] = [];
  
  context.lines.forEach((line, index) => {
    for (const rule of QUALITY_RULES) {
      if (rule.regex.test(line)) {
        findings.push({
          id: `qual-${context.file}-${index}`,
          dimension: "quality",
          severity: rule.severity,
          message: rule.message,
          file: context.file,
          line: context.startIndex + index,
        });
      }
    }
  });
  
  return findings;
}

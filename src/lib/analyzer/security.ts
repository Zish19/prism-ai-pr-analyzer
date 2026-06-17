import { FileDiff } from "@/data/mock-diff";
import { AnalyzerEngine, Finding } from "./types";

const SECURITY_PATTERNS: Array<{
  regex: RegExp;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  confidence: "high" | "medium" | "low";
  confidenceReason: string;
}> = [
  {
    regex: /(api[_-]?key|secret|token|password)\s*[:=]/i,
    title: "Hardcoded Secret/Password",
    description: "Potential hardcoded credential or secret detected. Secrets should be injected via environment variables.",
    severity: "critical",
    confidence: "medium",
    confidenceReason: "Pattern match on common naming conventions, might catch mock data or benign strings.",
  },
  {
    regex: /AKIA[0-9A-Z]{16}/,
    title: "AWS Access Key",
    description: "AWS Access Key ID detected. This is a critical security vulnerability if exposed.",
    severity: "critical",
    confidence: "high",
    confidenceReason: "Deterministic match: AWS key prefix and length.",
  },
  {
    regex: /eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/,
    title: "Hardcoded JWT Token",
    description: "A JSON Web Token (JWT) string was detected. Tokens should not be checked into source control.",
    severity: "high",
    confidence: "high",
    confidenceReason: "Deterministic match: Standard JWT header prefix.",
  },
  {
    regex: /\b(eval|Function|exec|child_process\.exec)\s*\(/,
    title: "Dangerous Function Call",
    description: "Usage of dangerous runtime evaluation functions detected. This can lead to code injection attacks.",
    severity: "high",
    confidence: "high",
    confidenceReason: "Deterministic match: Direct usage of dangerous APIs.",
  },
  {
    // A simplistic heuristic for naive SQL concatenation
    regex: /SELECT\s+.*FROM\s+.*\bWHERE\s+.*\s*[+=]\s*[\w.]+/,
    title: "Potential SQL Injection",
    description: "String concatenation detected in a SQL query. Use parameterized queries or an ORM to prevent SQL injection.",
    severity: "high",
    confidence: "low",
    confidenceReason: "Naive pattern match for SQL string formatting, prone to false positives.",
  }
];

export const securityEngine: AnalyzerEngine = {
  name: "security",
  analyze: (files: FileDiff[]): Finding[] => {
    const findings: Finding[] = [];

    for (const file of files) {
      for (const hunk of file.hunks) {
        for (const line of hunk.lines) {
          if (line.type !== "add") continue;

          for (const pattern of SECURITY_PATTERNS) {
            if (pattern.regex.test(line.content)) {
              findings.push({
                dimension: "security",
                severity: pattern.severity,
                confidence: pattern.confidence,
                confidenceReason: pattern.confidenceReason,
                title: pattern.title,
                description: pattern.description,
                file: file.path,
                line: line.lineNew,
                id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              });
            }
          }
        }
      }
    }

    return findings;
  },
};

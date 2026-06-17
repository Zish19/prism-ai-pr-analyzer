import type { Finding, AnalyzerContext } from "./types";

const SECURITY_RULES = [
  {
    regex: /(password|secret|api_key|token|auth)\s*=\s*['"][^'"]+['"]/i,
    message: "Hardcoded secret detected. Use environment variables or a secrets manager.",
    severity: "critical" as const,
  },
  {
    regex: /eval\s*\(/i,
    message: "Unsafe use of eval() detected. This can lead to code injection vulnerabilities.",
    severity: "critical" as const,
  },
  {
    regex: /SELECT\s+.*FROM\s+.*\$\{/i,
    message: "Potential SQL Injection detected. Use parameterized queries.",
    severity: "high" as const,
  },
  {
    regex: /(strcpy|sprintf|gets)\s*\(/i,
    message: "Unsafe C function detected. Use bounded alternatives like strncpy or snprintf.",
    severity: "high" as const,
  }
];

export function analyzeSecurity(context: AnalyzerContext): Finding[] {
  const findings: Finding[] = [];
  
  context.lines.forEach((line, index) => {
    for (const rule of SECURITY_RULES) {
      if (rule.regex.test(line)) {
        findings.push({
          id: `sec-${context.file}-${index}`,
          dimension: "security",
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

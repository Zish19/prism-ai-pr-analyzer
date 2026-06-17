import { ReviewResult } from "@/lib/analyzer/types";

export function generateMarkdownReport(repoPath: string, result: ReviewResult): string {
  const date = new Date().toLocaleDateString();
  
  let md = `# PRISM Analysis Report\n\n`;
  md += `**Target**: \`${repoPath}\`\n`;
  md += `**Date**: ${date}\n`;
  md += `**Risk Score**: ${result.riskScore}/100 (${result.riskLevel})\n`;
  md += `**Merge Probability**: ${result.mergeProbability}%\n\n`;
  md += `> ${result.summary}\n\n`;

  const dimensions = [
    { title: "Security Findings", data: result.scores.security },
    { title: "Performance Findings", data: result.scores.performance },
    { title: "Architecture Findings", data: result.scores.architecture },
    { title: "Quality Findings", data: result.scores.quality },
  ];

  for (const dim of dimensions) {
    md += `## ${dim.title}\n\n`;
    if (dim.data.issues.length === 0) {
      md += `- *No issues detected.*\n\n`;
    } else {
      for (const issue of dim.data.issues) {
        md += `- **[${issue.severity.toUpperCase()}]** ${issue.title}\n`;
        md += `  - ${issue.description}\n`;
        if (issue.file) {
          md += `  - Location: \`${issue.file}${issue.line ? `:${issue.line}` : ''}\`\n`;
        }
      }
      md += `\n`;
    }
  }

  return md;
}

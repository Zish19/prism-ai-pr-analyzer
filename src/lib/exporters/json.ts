import { ReviewResult } from "@/lib/analyzer/types";

export function generateJSONReport(repoPath: string, result: ReviewResult): string {
  const report = {
    metadata: {
      target: repoPath,
      analyzedAt: new Date().toISOString(),
      generator: "PRISM AI",
    },
    results: result,
  };
  return JSON.stringify(report, null, 2);
}

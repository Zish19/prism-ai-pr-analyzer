import { FileDiff } from "@/data/mock-diff";
import { AnalyzerEngine, Finding } from "./types";

export const performanceEngine: AnalyzerEngine = {
  name: "performance",
  analyze: (files: FileDiff[]): Finding[] => {
    const findings: Finding[] = [];

    for (const file of files) {
      for (const hunk of file.hunks) {
        let loopDepth = 0;
        const lineStack: number[] = [];

        for (const line of hunk.lines) {
          if (line.type === "remove") continue;

          // Extremely naive heuristic for nested loops
          const text = line.content.trim();

          if (text.startsWith("for ") || text.startsWith("for(") || text.startsWith("while ") || text.startsWith("while(")) {
            loopDepth++;
            lineStack.push(line.lineNew || 0);

            if (loopDepth > 1 && line.type === "add") {
              // Base case: just a nested loop
              findings.push({
                dimension: "performance",
                severity: "low",
                confidence: "low",
                confidenceReason: "Pattern match based on nested loops only; no expensive operations detected.",
                title: "Nested Loop Detected",
                description: "O(n^2) or worse complexity detected via nested loops. Verify if this operates on large datasets.",
                file: file.path,
                line: line.lineNew,
                id: `perf-loop-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              });
            }
          }

          const hasDbCall = text.match(/\b(find|findOne|SELECT|INSERT|UPDATE|query|aggregate|db\.|prisma\.)\b/i);
          const hasApiCall = text.match(/\b(fetch|axios|http\.|https\.)\b/i);

          if (hasDbCall || hasApiCall) {
            if (loopDepth > 0 && line.type === "add") {
              findings.push({
                dimension: "performance",
                severity: "high",
                confidence: "high",
                confidenceReason: "Deterministic match: Expensive I/O (Database/API) occurs inside an iteration block.",
                title: "N+1 Query / Network Call in Loop",
                description: "A network request or database query was found inside a loop. This is a classic N+1 performance anti-pattern.",
                file: file.path,
                line: line.lineNew,
                id: `perf-io-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              });
            }
          }

          if (text.includes("}")) {
            if (loopDepth > 0) {
              loopDepth--;
              lineStack.pop();
            }
          }
        }
      }
    }

    return findings;
  },
};

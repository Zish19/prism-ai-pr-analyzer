import type { Finding, AnalyzerContext } from "./types";

export function analyzePerformance(context: AnalyzerContext): Finding[] {
  const findings: Finding[] = [];
  
  let loopNesting = 0;
  
  context.lines.forEach((line, index) => {
    // Nested loop detection
    if (/^\s*(for|while)\s*\(/.test(line)) {
      loopNesting++;
      if (loopNesting >= 2) {
        findings.push({
          id: `perf-loop-${context.file}-${index}`,
          dimension: "performance",
          severity: loopNesting >= 3 ? "high" : "medium",
          message: `Nested loop depth of ${loopNesting} detected. O(n^${loopNesting}) complexity can cause performance degradation.`,
          file: context.file,
          line: context.startIndex + index,
        });
      }
    }
    
    // Decrease loop nesting (very naive approach for demonstration)
    if (line.includes("}") && loopNesting > 0) {
      loopNesting--;
    }
    
    // Expensive allocations in loop
    if (loopNesting > 0 && /malloc\s*\(|new\s+[A-Z]/.test(line)) {
      findings.push({
        id: `perf-alloc-${context.file}-${index}`,
        dimension: "performance",
        severity: "high",
        message: "Memory allocation inside a loop detected. Consider pre-allocating outside the loop.",
        file: context.file,
        line: context.startIndex + index,
      });
    }
  });
  
  return findings;
}

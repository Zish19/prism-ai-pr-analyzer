import type { Finding, AnalyzerContext } from "./types";

export function analyzeArchitecture(context: AnalyzerContext): Finding[] {
  const findings: Finding[] = [];
  
  let currentFuncStart = -1;
  
  context.lines.forEach((line, index) => {
    // Basic function start detection (e.g. `int func_name(`)
    if (/^[a-zA-Z_][a-zA-Z0-9_]*\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\(/.test(line)) {
      currentFuncStart = index;
    }
    
    // Warn if a function exceeds ~40 lines in a diff hunk 
    // (In reality this requires AST parsing, but for diff analysis we approximate)
    if (currentFuncStart !== -1 && (index - currentFuncStart) > 40) {
      if ((index - currentFuncStart) % 40 === 1) { // Only report once per function
        findings.push({
          id: `arch-len-${context.file}-${index}`,
          dimension: "architecture",
          severity: "medium",
          message: "Function exceeds recommended length (40 lines). Consider breaking it into smaller, composable units.",
          file: context.file,
          line: context.startIndex + currentFuncStart,
        });
      }
    }
    
    if (line.trim() === "}") {
      currentFuncStart = -1;
    }
    
    // Deep nesting detection
    const indentLevel = (line.match(/^\s+/) || [""])[0].length / 4; // assuming 4 spaces
    if (indentLevel > 4) {
      findings.push({
        id: `arch-nest-${context.file}-${index}`,
        dimension: "architecture",
        severity: "medium",
        message: `High cyclomatic complexity. Indentation level ${indentLevel} exceeds recommended maximum of 4.`,
        file: context.file,
        line: context.startIndex + index,
      });
    }
  });
  
  return findings;
}

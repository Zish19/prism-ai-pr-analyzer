import { FileDiff } from "@/data/mock-diff";
import { AnalyzerEngine, Finding } from "./types";

export const architectureEngine: AnalyzerEngine = {
  name: "architecture",
  analyze: (files: FileDiff[]): Finding[] => {
    const findings: Finding[] = [];

    for (const file of files) {
      let maxLine = 0;
      let maxNesting = 0;
      let currentNesting = 0;

      for (const hunk of file.hunks) {
        for (const line of hunk.lines) {
          if (line.lineNew && line.lineNew > maxLine) {
            maxLine = line.lineNew;
          }

          if (line.type !== "remove") {
            const text = line.content;
            // Naive bracket counting for nesting
            const opens = (text.match(/\{/g) || []).length;
            const closes = (text.match(/\}/g) || []).length;
            
            currentNesting += opens;
            currentNesting -= closes;
            
            if (currentNesting > maxNesting) {
              maxNesting = currentNesting;
            }

            if (currentNesting > 4 && line.type === "add") {
              findings.push({
                dimension: "architecture",
                severity: "medium",
                title: "Deep Nesting",
                description: "Deeply nested logic detected (level > 4). This is a probable architectural risk indicating the function should be refactored.",
                file: file.path,
                line: line.lineNew,
                id: `arch-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              });
              // Reset slightly to prevent spamming every line inside
              currentNesting = 3; 
            }
          }
        }
      }

      if (maxLine > 500) {
        findings.push({
          dimension: "architecture",
          severity: "medium",
          title: "Huge File",
          description: `This file has exceeded 500 lines (detected around line ${maxLine}). Consider breaking it down into smaller modules.`,
          file: file.path,
          line: maxLine,
          id: `arch-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        });
      }
    }

    return findings;
  },
};

import { FileDiff } from "@/data/mock-diff";
import { Finding, ReviewResult } from "./types";
import { securityEngine } from "./security";
import { performanceEngine } from "./performance";
import { architectureEngine } from "./architecture";
import { qualityEngine } from "./quality";
import { generateReviewResult } from "./scorer";

export function analyzePR(files: FileDiff[]): ReviewResult {
  let allFindings: Finding[] = [];

  const engines = [
    securityEngine,
    performanceEngine,
    architectureEngine,
    qualityEngine,
  ];

  for (const engine of engines) {
    try {
      const findings = engine.analyze(files);
      allFindings = allFindings.concat(findings);
    } catch (error) {
      console.error(`Engine ${engine.name} failed:`, error);
    }
  }

  return generateReviewResult(allFindings);
}

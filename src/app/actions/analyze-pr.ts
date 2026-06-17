"use server";

import { parseGitHubPRUrl } from "@/lib/github/parser";
import { fetchPRData } from "@/lib/github/fetch-pr";
import { analyzePR } from "@/lib/analyzer";
import { ReviewResult } from "@/lib/analyzer/types";
import { FileDiff } from "@/data/mock-diff";
import { GitHubPRMetadata } from "@/lib/types/github";

export type AnalyzeResult = {
  success: true;
  result: ReviewResult;
  files: FileDiff[];
  metadata: GitHubPRMetadata;
  isPartial: boolean;
} | {
  success: false;
  error: string;
};

export async function analyzePRAction(url: string): Promise<AnalyzeResult> {
  try {
    const pr = parseGitHubPRUrl(url);
    
    if (!pr) {
      return { success: false, error: "Invalid GitHub Pull Request URL." };
    }

    const prData = await fetchPRData(pr);
    const result = analyzePR(prData.files);

    return {
      success: true,
      result,
      files: prData.files,
      metadata: prData.metadata,
      isPartial: prData.isPartial,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "An unexpected error occurred while analyzing the PR." };
  }
}

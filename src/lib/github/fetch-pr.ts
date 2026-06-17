import { ParsedPR, GitHubPRMetadata, GitHubFile } from "@/lib/types/github";
import { githubFetch } from "./client";
import { parseUnifiedDiff } from "@/lib/diff-parser";
import { FileDiff } from "@/data/mock-diff";

const MAX_FILES = 50;
const MAX_PATCH_SIZE = 500_000;

export async function fetchPRData(pr: ParsedPR): Promise<{
  metadata: GitHubPRMetadata;
  files: FileDiff[];
  isPartial: boolean;
}> {
  const { owner, repo, pullNumber } = pr;

  // 1. Fetch Metadata
  const metadata = await githubFetch<GitHubPRMetadata>(
    `/repos/${owner}/${repo}/pulls/${pullNumber}`
  );

  // 2. Fetch Files
  // GitHub paginates files at 30 per page by default. Let's fetch up to MAX_FILES (e.g. 100 per page, take 1 page).
  const filesList = await githubFetch<GitHubFile[]>(
    `/repos/${owner}/${repo}/pulls/${pullNumber}/files?per_page=${MAX_FILES}`
  );

  let totalPatchSize = 0;
  let isPartial = false;
  const processedFiles: FileDiff[] = [];

  for (const file of filesList) {
    if (!file.patch) {
      // Binary file or too large
      continue;
    }

    totalPatchSize += file.patch.length;
    if (totalPatchSize > MAX_PATCH_SIZE) {
      isPartial = true;
      break;
    }

    // Our parser expects a unified diff format with the git header.
    // GitHub's JSON .patch property omits the header, so we inject a fake one.
    const fakeHeader = `diff --git a/${file.filename} b/${file.filename}\n`;
    const parsedFiles = parseUnifiedDiff(fakeHeader + file.patch);

    if (parsedFiles.length > 0) {
      processedFiles.push(parsedFiles[0]);
    }
  }

  return {
    metadata,
    files: processedFiles,
    isPartial,
  };
}

import { ParsedPR } from "@/lib/types/github";

const GITHUB_PR_REGEX = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)\/?$/;

export function parseGitHubPRUrl(url: string): ParsedPR | null {
  try {
    // Strip query parameters and hash if any
    const cleanUrl = url.split("?")[0].split("#")[0];
    const match = cleanUrl.match(GITHUB_PR_REGEX);
    
    if (!match) {
      return null;
    }

    const [, owner, repo, pullNumberStr] = match;
    const pullNumber = parseInt(pullNumberStr, 10);

    if (isNaN(pullNumber)) {
      return null;
    }

    return {
      owner,
      repo,
      pullNumber
    };
  } catch {
    return null;
  }
}

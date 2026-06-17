// ---------------------------------------------------------------------------
// GitHub Service — Parse PR URLs & type definitions
// ---------------------------------------------------------------------------

import type { PRMetadata } from "@/data/mock-review";

/**
 * Parse a GitHub PR URL into its components.
 * Supports formats:
 *   - https://github.com/owner/repo/pull/123
 *   - github.com/owner/repo/pull/123
 *   - owner/repo#123
 */
export function parseGitHubPrUrl(url: string): {
  owner: string;
  repo: string;
  prNumber: number;
} | null {
  // Try full URL format
  const urlMatch = url.match(
    /(?:https?:\/\/)?github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/
  );
  if (urlMatch) {
    return {
      owner: urlMatch[1],
      repo: urlMatch[2],
      prNumber: parseInt(urlMatch[3], 10),
    };
  }

  // Try shorthand: owner/repo#123
  const shortMatch = url.match(/^([^/]+)\/([^#]+)#(\d+)$/);
  if (shortMatch) {
    return {
      owner: shortMatch[1],
      repo: shortMatch[2],
      prNumber: parseInt(shortMatch[3], 10),
    };
  }

  return null;
}

/**
 * Shape of a file entry from the GitHub API PR files endpoint.
 */
export interface GitHubPRFile {
  filename: string;
  additions: number;
  deletions: number;
  status: string;
}

/**
 * Map the GitHub API PR response to our PRMetadata interface.
 */
export function mapToPRMetadata(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiData: any,
  files: GitHubPRFile[]
): PRMetadata {
  return {
    number: apiData.number,
    title: apiData.title,
    repo: apiData.base?.repo?.full_name || "unknown/repo",
    author: apiData.user?.login || "unknown",
    authorAvatar:
      apiData.user?.avatar_url ||
      "https://avatars.githubusercontent.com/u/1?v=4",
    baseBranch: apiData.base?.ref || "main",
    headBranch: apiData.head?.ref || "feature",
    status: apiData.merged
      ? "merged"
      : apiData.state === "closed"
        ? "closed"
        : "open",
    filesChanged: apiData.changed_files || files.length,
    additions: apiData.additions || 0,
    deletions: apiData.deletions || 0,
    commits: apiData.commits || 1,
    createdAt: apiData.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
    files: files.map((f) => ({
      name: f.filename,
      additions: f.additions,
      deletions: f.deletions,
    })),
  };
}

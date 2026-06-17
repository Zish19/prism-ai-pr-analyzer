import { GitHubAPIError } from "@/lib/types/github";

const GITHUB_API_BASE = "https://api.github.com";

export async function githubFetch<T>(endpoint: string): Promise<T> {
  const url = `${GITHUB_API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "PRISM-Analyzer",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(url, { headers, cache: "no-store" });

    if (!response.ok) {
      let errorMessage = `GitHub API Error: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Ignore if not JSON
      }
      
      throw new GitHubAPIError(response.status, errorMessage);
    }

    return await response.json() as T;
  } catch (error) {
    if (error instanceof GitHubAPIError) {
      throw error;
    }
    throw new GitHubAPIError(500, error instanceof Error ? error.message : "Unknown fetch error");
  }
}

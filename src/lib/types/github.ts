export type ParsedPR = {
  owner: string;
  repo: string;
  pullNumber: number;
};

export class GitHubAPIError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "GitHubAPIError";
  }
}

export type GitHubPRMetadata = {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed" | "all";
  user: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  created_at: string;
  updated_at: string;
  additions: number;
  deletions: number;
  changed_files: number;
  base: {
    ref: string;
    sha: string;
  };
  head: {
    ref: string;
    sha: string;
  };
};

export type GitHubFile = {
  sha: string;
  filename: string;
  status: "added" | "removed" | "modified" | "renamed" | "copied" | "changed" | "unchanged";
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
  raw_url: string;
  contents_url: string;
  patch?: string; // Not present if the file is too large or binary
};

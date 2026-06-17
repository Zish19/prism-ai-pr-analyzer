// ---------------------------------------------------------------------------
// API Route: /api/github/pr
// Server-side proxy for fetching GitHub PR data (avoids CORS)
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { mapToPRMetadata } from "@/services/github";
import { parseUnifiedDiff } from "@/lib/diff-parser";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const pr = searchParams.get("pr");

  if (!owner || !repo || !pr) {
    return NextResponse.json(
      { error: "Missing required params: owner, repo, pr" },
      { status: 400 }
    );
  }

  const prNumber = parseInt(pr, 10);
  if (isNaN(prNumber)) {
    return NextResponse.json(
      { error: "Invalid PR number" },
      { status: 400 }
    );
  }

  const apiBase = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
  const headers: Record<string, string> = {
    "User-Agent": "PRISM-AI-PR-Analyzer",
    Accept: "application/vnd.github.v3+json",
  };

  try {
    // 1. Fetch PR metadata
    const metaRes = await fetch(apiBase, { headers });
    if (!metaRes.ok) {
      if (metaRes.status === 404) {
        return NextResponse.json(
          { error: `PR #${prNumber} not found in ${owner}/${repo}. Make sure the repository is public.` },
          { status: 404 }
        );
      }
      if (metaRes.status === 403) {
        return NextResponse.json(
          { error: "GitHub API rate limit exceeded. Please wait a few minutes and try again." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `GitHub API error: ${metaRes.status} ${metaRes.statusText}` },
        { status: metaRes.status }
      );
    }
    const metaData = await metaRes.json();

    // 2. Fetch list of files changed
    const filesRes = await fetch(`${apiBase}/files?per_page=100`, { headers });
    const filesData = filesRes.ok ? await filesRes.json() : [];

    // 3. Fetch the raw diff
    const diffRes = await fetch(apiBase, {
      headers: {
        ...headers,
        Accept: "application/vnd.github.v3.diff",
      },
    });
    const rawDiff = diffRes.ok ? await diffRes.text() : "";

    // 4. Parse everything into our formats
    const prMetadata = mapToPRMetadata(metaData, filesData);
    const diffs = parseUnifiedDiff(rawDiff);

    return NextResponse.json({
      pr: prMetadata,
      diffs,
    });
  } catch (err) {
    console.error("GitHub API fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch PR data from GitHub. Please check your connection." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Unified Diff Parser
// Converts raw `git diff` / GitHub API diff text into our FileDiff[] format
// ---------------------------------------------------------------------------

import type { FileDiff, DiffHunk, DiffLine } from "@/data/mock-diff";

/**
 * Map file extension to a Shiki-compatible language identifier.
 */
function guessLanguage(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    c: "c",
    h: "c",
    cpp: "cpp",
    cc: "cpp",
    cxx: "cpp",
    hpp: "cpp",
    cs: "csharp",
    py: "python",
    rb: "ruby",
    go: "go",
    rs: "rust",
    java: "java",
    kt: "kotlin",
    swift: "swift",
    php: "php",
    css: "css",
    scss: "css",
    html: "html",
    htm: "html",
    xml: "xml",
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    toml: "toml",
    md: "markdown",
    sh: "bash",
    bash: "bash",
    zsh: "bash",
    sql: "sql",
    dockerfile: "dockerfile",
    makefile: "makefile",
    lua: "lua",
    r: "r",
    dart: "dart",
    vue: "vue",
    svelte: "svelte",
  };
  return map[ext] || "plaintext";
}

/**
 * Parse a raw unified diff string (from GitHub API or `git diff`) into
 * our internal FileDiff[] representation.
 */
export function parseUnifiedDiff(rawDiff: string): FileDiff[] {
  const files: FileDiff[] = [];
  if (!rawDiff || rawDiff.trim().length === 0) return files;

  // Split on file boundaries: "diff --git a/... b/..."
  const fileSections = rawDiff.split(/^diff --git /m).filter(Boolean);

  for (const section of fileSections) {
    const lines = section.split("\n");

    // First line: "a/path b/path"
    const headerMatch = lines[0]?.match(/a\/(.+?)\s+b\/(.+)/);
    if (!headerMatch) continue;

    const filePath = headerMatch[2]; // Use the "b" side (new path)
    const language = guessLanguage(filePath);

    const hunks: DiffHunk[] = [];
    let currentHunk: DiffHunk | null = null;
    let oldLine = 0;
    let newLine = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      // Hunk header: @@ -oldStart,oldCount +newStart,newCount @@
      const hunkMatch = line.match(
        /^@@\s+-(\d+)(?:,(\d+))?\s+\+(\d+)(?:,(\d+))?\s+@@(.*)$/
      );
      if (hunkMatch) {
        currentHunk = {
          header: line,
          lines: [],
        };
        hunks.push(currentHunk);
        oldLine = parseInt(hunkMatch[1], 10);
        newLine = parseInt(hunkMatch[3], 10);
        continue;
      }

      // Skip metadata lines (index, ---, +++)
      if (
        line.startsWith("index ") ||
        line.startsWith("--- ") ||
        line.startsWith("+++ ") ||
        line.startsWith("old mode") ||
        line.startsWith("new mode") ||
        line.startsWith("new file mode") ||
        line.startsWith("deleted file mode") ||
        line.startsWith("similarity index") ||
        line.startsWith("rename from") ||
        line.startsWith("rename to") ||
        line.startsWith("Binary files")
      ) {
        continue;
      }

      if (!currentHunk) continue;

      // Diff lines
      if (line.startsWith("+")) {
        const diffLine: DiffLine = {
          type: "add",
          lineNew: newLine,
          content: line.substring(1),
        };
        currentHunk.lines.push(diffLine);
        newLine++;
      } else if (line.startsWith("-")) {
        const diffLine: DiffLine = {
          type: "remove",
          lineOld: oldLine,
          content: line.substring(1),
        };
        currentHunk.lines.push(diffLine);
        oldLine++;
      } else if (line.startsWith(" ") || line === "") {
        // Context line (or empty line within a hunk)
        const diffLine: DiffLine = {
          type: "context",
          lineOld: oldLine,
          lineNew: newLine,
          content: line.startsWith(" ") ? line.substring(1) : line,
        };
        currentHunk.lines.push(diffLine);
        oldLine++;
        newLine++;
      }
      // "\No newline at end of file" — skip
    }

    // Only include files that have actual diff hunks
    if (hunks.length > 0) {
      files.push({ path: filePath, language, hunks });
    }
  }

  return files;
}

import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

let highlighterPromise: ReturnType<typeof createHighlighterCore> | null = null;

// Common languages to pre-load for fast highlighting
const LANG_IMPORTS = [
  import("shiki/langs/c.mjs"),
  import("shiki/langs/cpp.mjs"),
  import("shiki/langs/typescript.mjs"),
  import("shiki/langs/javascript.mjs"),
  import("shiki/langs/tsx.mjs"),
  import("shiki/langs/jsx.mjs"),
  import("shiki/langs/python.mjs"),
  import("shiki/langs/go.mjs"),
  import("shiki/langs/rust.mjs"),
  import("shiki/langs/java.mjs"),
  import("shiki/langs/json.mjs"),
  import("shiki/langs/yaml.mjs"),
  import("shiki/langs/css.mjs"),
  import("shiki/langs/html.mjs"),
  import("shiki/langs/bash.mjs"),
  import("shiki/langs/markdown.mjs"),
  import("shiki/langs/ruby.mjs"),
  import("shiki/langs/php.mjs"),
  import("shiki/langs/swift.mjs"),
  import("shiki/langs/kotlin.mjs"),
  import("shiki/langs/sql.mjs"),
  import("shiki/langs/toml.mjs"),
  import("shiki/langs/xml.mjs"),
  import("shiki/langs/dockerfile.mjs"),
  import("shiki/langs/makefile.mjs"),
];

// Languages that are safe to pass to Shiki (pre-loaded)
const SUPPORTED_LANGS = new Set([
  "c", "cpp", "typescript", "javascript", "tsx", "jsx",
  "python", "go", "rust", "java", "json", "yaml", "css",
  "html", "bash", "markdown", "ruby", "php", "swift",
  "kotlin", "sql", "toml", "xml", "dockerfile", "makefile",
]);

/**
 * Check if a language is supported by our highlighter.
 * Falls back to "plaintext" if not recognized.
 */
export function getSafeLanguage(lang: string): string {
  if (SUPPORTED_LANGS.has(lang)) return lang;
  return "plaintext";
}

export async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [
        import("shiki/themes/github-dark-dimmed.mjs")
      ],
      langs: LANG_IMPORTS,
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}


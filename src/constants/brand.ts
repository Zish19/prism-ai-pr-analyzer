export const BRAND = {
  name: "PRISM AI",
  shortName: "PRISM",
  description: "AI-powered pull request analysis platform",
  accentColor: "#3B82F6",
  theme: "dark",
  url: "https://github.com/prism-ai-pr-analyzer",
  author: "PRISM Team",
} as const;

export const BRAND_META = {
  title: `${BRAND.name} — AI PR Reviewer`,
  description: BRAND.description,
  themeColor: "#8b5cf6",
  keywords: [
    "pull request",
    "code review",
    "AI",
    "code quality",
    "security",
    "performance",
    "GitHub",
    "static analysis",
  ],
} as const;

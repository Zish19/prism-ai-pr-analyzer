export const BRAND = {
  name: "PRISM",
  shortName: "PRISM",
  description: "AI-Powered Pull Request Intelligence",
  accentColor: "#3B82F6",
  theme: "dark",
  url: "https://github.com/Zish19/prism-ai-pr-analyzer",
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

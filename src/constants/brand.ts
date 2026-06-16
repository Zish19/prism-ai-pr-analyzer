export const BRAND = {
  name: "PRISM",
  tagline: "AI-Powered Pull Request Intelligence",
  description:
    "AI-powered pull request analysis platform for code quality, security, and performance insights.",
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

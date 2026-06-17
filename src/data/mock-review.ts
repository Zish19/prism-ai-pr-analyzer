// ---------------------------------------------------------------------------
// Mock Review Data — OpenSSL PR #31336
// HPKE Suite Introspection Utility APIs
// ---------------------------------------------------------------------------

export interface ReviewIssue {
  id: string;
  file: string;
  line: number;
  severity: "info" | "warning" | "error";
  category: "security" | "performance" | "code-quality" | "architecture";
  message: string;
}

export interface ReviewScore {
  score: number;
  label: string;
  issues: ReviewIssue[];
}

export interface PRMetadata {
  number: number;
  title: string;
  repo: string;
  author: string;
  authorAvatar: string;
  baseBranch: string;
  headBranch: string;
  status: "open" | "closed" | "merged";
  filesChanged: number;
  additions: number;
  deletions: number;
  commits: number;
  createdAt: string;
  files?: any[];
}

export interface MockReview {
  pr: PRMetadata;
  scores: {
    security: ReviewScore;
    performance: ReviewScore;
    codeQuality: ReviewScore;
    architecture: ReviewScore;
  };
  mergeProbability: number;
  summary: string;
}

export const MOCK_PR: PRMetadata = {
  number: 31336,
  title: "Add utility APIs for HPKE suite introspection",
  repo: "openssl/openssl",
  author: "Zish19",
  authorAvatar: "https://avatars.githubusercontent.com/u/1?v=4",
  baseBranch: "master",
  headBranch: "hpke-suite-utils",
  status: "open",
  filesChanged: 5,
  additions: 287,
  deletions: 12,
  commits: 3,
  createdAt: "2025-06-14",
};

export const MOCK_REVIEW: MockReview = {
  pr: MOCK_PR,
  mergeProbability: 84,
  summary:
    "Well-structured addition of HPKE utility APIs. Minor suggestions around input validation and documentation coverage.",
  scores: {
    security: {
      score: 92,
      label: "Security",
      issues: [
        {
          id: "sec-1",
          file: "crypto/hpke/hpke_util.c",
          line: 47,
          severity: "warning",
          category: "security",
          message:
            "Consider adding NULL check for `suite` parameter before dereferencing in OSSL_HPKE_get_suite().",
        },
        {
          id: "sec-2",
          file: "crypto/hpke/hpke_util.c",
          line: 112,
          severity: "info",
          category: "security",
          message:
            "Buffer size for suite2str output is hardcoded. Consider using a named constant.",
        },
      ],
    },
    performance: {
      score: 96,
      label: "Performance",
      issues: [],
    },
    codeQuality: {
      score: 88,
      label: "Code Quality",
      issues: [
        {
          id: "cq-1",
          file: "include/openssl/hpke.h",
          line: 89,
          severity: "info",
          category: "code-quality",
          message:
            "Missing documentation comment for OSSL_HPKE_mode_is_supported() — add @param and @return.",
        },
        {
          id: "cq-2",
          file: "test/hpke_test.c",
          line: 234,
          severity: "warning",
          category: "code-quality",
          message:
            "Test only covers valid suites. Add negative test cases for invalid KEM/KDF/AEAD combinations.",
        },
      ],
    },
    architecture: {
      score: 94,
      label: "Architecture",
      issues: [
        {
          id: "arch-1",
          file: "crypto/hpke/hpke_util.c",
          line: 1,
          severity: "info",
          category: "architecture",
          message:
            "Good separation: utility functions in dedicated file rather than mixed into hpke.c.",
        },
      ],
    },
  },
};

export const MOCK_FILES = [
  { path: "crypto/hpke/hpke_util.c", additions: 184, deletions: 0, status: "added" as const },
  { path: "include/openssl/hpke.h", additions: 28, deletions: 4, status: "modified" as const },
  { path: "test/hpke_test.c", additions: 62, deletions: 8, status: "modified" as const },
  { path: "doc/man3/OSSL_HPKE_CTX_new.pod", additions: 11, deletions: 0, status: "modified" as const },
  { path: "util/libcrypto.num", additions: 4, deletions: 0, status: "modified" as const },
];

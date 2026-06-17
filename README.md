# PRISM 
## AI-Powered Pull Request Analyzer

PRISM is an advanced, automated intelligence engine designed to intercept and analyze pull requests before they merge. It detects security vulnerabilities, performance bottlenecks, architectural flaws, and code quality regressions, presenting them in a highly optimized, brutalist-inspired dashboard interface.

---

## 1. Core Architecture

PRISM is built on a modern, high-performance web stack prioritized for immediate feedback and uncompromised aesthetic delivery.

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 with a custom Brutalist Design System
- **Animation**: Framer Motion for scroll-linked and micro-interaction states
- **Syntax Highlighting**: Shiki for highly accurate token rendering
- **Authentication**: Clerk for enterprise-grade user management
- **Components**: Radix UI / Shadcn for accessible primitives

---

## 2. Intelligence Engines

PRISM evaluates pull requests across four distinct vectors, known as Heuristics or Dimensions:

### Security
Identifies critical vulnerabilities that expose systems to external threat vectors.
- Hardcoded secrets and API keys
- Unsafe dynamic evaluations (eval, setTimeout with strings)
- Command injection vectors
- Insecure direct object references

### Performance
Detects hidden runtime costs and inefficient computational logic.
- O(N^2) or higher nested loop complexities
- Expensive memory allocations within inner loops
- Blocking synchronous operations

### Architecture
Evaluates structural integrity and maintainability patterns.
- Excessive function length and cyclomatic complexity
- Deep control flow nesting
- Violation of Single Responsibility Principles

### Quality
Ensures adherence to clean code standards and repository conventions.
- Unresolved TODO or FIXME statements
- Residual debugging artifacts (console.log)
- Ambiguous variable naming conventions

---

## 3. The Dashboard

The PRISM dashboard provides a unified command center for PR review.

- **Command Palette**: Press `CTRL+K` (or `CMD+K`) to rapidly navigate between analysis runs, toggle the sidebar, or switch view modes.
- **Diff Viewer**: High-fidelity dual-pane or unified diff rendering powered by Shiki, allowing granular inspection of flagged lines.
- **Metrics Panel**: A statistical breakdown of the AI review, including severity distribution, dimension scores, and an overarching "Merge Probability" score.

---

## 4. Setup & Deployment

To run PRISM locally, ensure you have Node.js 20+ and pnpm installed.

### Installation

```bash
# Clone the repository
git clone https://github.com/Zish19/prism-ai-pr-analyzer.git

# Navigate into the project
cd prism-ai-pr-analyzer

# Install dependencies
pnpm install
```

### Environment Configuration

Create a `.env.local` file in the root directory and configure your Clerk Authentication keys.

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Execution

Start the Turbopack development server:

```bash
pnpm dev
```

Navigate to `http://localhost:3000` to access the application.

---

## 5. Design Philosophy

PRISM rejects generic, overly-softened corporate UI patterns. It embraces a technical, brutalist aesthetic defined by sharp corners, high-contrast monospace typography, and subtle grid backgrounds. 

The interface communicates raw data efficiently, honoring the precision required in software engineering. The dual-theme support (Dark Mode and Creamy Light Mode) ensures maximum readability across any environment without sacrificing brand identity.

---
*Developed by the PRISM Team. 2026.*

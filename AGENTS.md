# NEVER push, force push, commit, amend, or otherwise modify git history or remote branches without asking the user for explicit permission first. Always confirm with the user before performing any commit or push.

# Before any commit, run `pnpm lint` and verify it passes with 0 errors. Only proceed to commit + push after lint is clean.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# asgard-html2img

- **Framework**: Next.js 16.2.10 + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Linting**: ESLint 9
- **Package Manager**: pnpm
- **Directory**: src/ directory with App Router
- **Import Alias**: @/* → ./src/*
- **Dev**: pnpm dev (Turbopack)
- **Build**: pnpm build
- **Lint**: pnpm lint
- **Cloudflare Build**: pnpm cf:build
- **Cloudflare Deploy**: pnpm cf:deploy
- **Cloudflare Preview**: pnpm cf:preview

# Cloudflare Deployment

Uses @opennextjs/cloudflare (NOT the deprecated @cloudflare/next-on-pages).

Cloudflare Pages build command:
```
pnpm cf:build
```

Output directory: `.open-next`

Build also works as a one-step deploy to Cloudflare Workers:
```
pnpm cf:deploy
```

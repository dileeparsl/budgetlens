# Changelog

All notable changes to this project are documented in this file.

Changes are organized into the following categories:

- **Added:** New features or functionality introduced to the project.
- **Changed:** Modifications to existing functionality that do not add new features.
- **Fixed:** Bug fixes that resolve issues or correct unintended behavior.
- **Removed:** Features or components that have been removed from the project.

## [Unreleased]

### Added

- **Database**: Supabase tables (`categories`, `transactions`, `finance_settings`) with RLS policies, indexes, triggers — applied via Supabase MCP migration.
- **Backend deployment**: FastAPI deployed to Vercel serverless Python (`vercel.json` + `api/index.py`). Live at [backend-chi-wine-55.vercel.app](https://backend-chi-wine-55.vercel.app).
- **Frontend deployment**: Next.js deployed to Vercel. Live at [frontend-rho-ten-42.vercel.app](https://frontend-rho-ten-42.vercel.app).
- **Screenshots**: 10 app screenshots in `docs/screenshots/` covering all pages and CRUD actions.
- **End-to-end verification**: All API endpoints tested with real auth tokens; all pages verified via Browser MCP.

### Changed

- **Auth**: Refactored from service-role key + local JWT decode to anon key + `supabase.auth.get_user()` + per-request JWT forwarding for RLS. Simpler, no server secrets needed.
- **Config**: `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_JWT_SECRET` replaced with single `SUPABASE_ANON_KEY`.
- **Dependencies**: Removed `python-jose` (JWT decoding now handled by Supabase Auth API).
- **README**: Added screenshot gallery, corrected backend API URL.
- **Docs**: Updated `architecture.md`, `ai-workflow.md` with complete hackathon log.

### Fixed

- Frontend `NEXT_PUBLIC_API_URL` was pointing to wrong backend URL on Vercel — corrected and redeployed.

## [v0.1.0] - 2026-03-25

### Added

- **Initial monorepo setup:** Next.js (`frontend/`) + FastAPI (`backend/`), Supabase, Vercel + separate API host, GitHub.
- **Docs:** `docs/use-case.md`, `docs/architecture.md`, `docs/DESIGN.md` (*Aperture Experience*, Google Stitch), `docs/ai-workflow.md`, `docs/prompt-playbook.md`, `docs/hackathon-checklist.md`.
- **IDE:** Cursor (`.cursor/rules/`, `.cursor/skills/`), Google Antigravity (`GEMINI.md`, `.agent/skills/`), shared `AGENTS.md`.
- **Skills:** rapid-scaffold, deploy-free-hosting, hackathon-debug, ai-workflow-docs, git-commit-push, **design-aperture** (Cursor + Antigravity).
- **Community:** contributing, conduct, security, commit/branch/PR guidelines, Husky pre-commit, GitHub Actions CI.
- **Tooling:** `.env.example`, `scripts/`, `backend/` and `frontend/` README placeholders.

[Unreleased]: https://github.com/dileepadev/budgetlens/compare/v0.1.0...HEAD
[v0.1.0]: https://github.com/dileepadev/budgetlens/releases/tag/v0.1.0

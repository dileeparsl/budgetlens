---
name: git-commit-push
description: Automatically commit scoped changes with a conventional message and push to origin. Use after finishing a coherent set of edits — feature, fix, docs, config, or rule change.
---

# Auto Commit & Push

## Goal

After every coherent slice of work, stage, commit (conventional format), and
push so nothing is lost and the Git history shows the AI-assisted workflow.

## Instructions

1. **Stage** only files that belong to this change:
   - Prefer explicit paths: `git add path/to/file1 path/to/file2`
   - Use `git add -A` only when **all** dirty files are part of the same change.

2. **Commit** with a conventional message per `COMMIT_MESSAGE_GUIDELINES.md`:
   - Format: `type(scope): Short imperative summary`
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
   - Scopes: `repo`, `config`, `auth`, `api`, `ui`, `db`, or specific feature area

3. **Push** to origin on the current branch:
   - `git push origin HEAD`
   - If no upstream: `git push -u origin HEAD`

4. If `git status` shows nothing to commit, skip.

## Constraints

- **Never** stage `.env`, `*.pem`, or secrets listed in `.gitignore` / `SECURITY.md`.
- Do not commit half-done work unless the user asks for a WIP checkpoint.
- If push fails: attempt one fix (e.g. `git pull --rebase`), then report.
- One logical commit per completed slice — not mega-commits.

## Example

```
git add frontend/src/app/dashboard/page.tsx frontend/src/components/chart.tsx
git commit -m "feat(ui): Add dashboard page with spending chart"
git push origin HEAD
```

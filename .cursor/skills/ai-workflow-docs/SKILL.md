---
name: ai-workflow-docs
description: >-
  Generate and maintain AI workflow documentation for hackathon judging.
  Tracks prompts, AI tools used, time savings, and key decisions across all
  development stages. Use when documenting AI usage, creating workflow logs,
  preparing hackathon deliverables, or updating ai-workflow.md.
---

# AI Workflow Documentation Generator

## Purpose

This skill helps create comprehensive AI workflow documentation required for
RSL Mini-Hack '26 judging. AI coverage across multiple stages is a key
evaluation criterion.

## Document Structure

Create `docs/ai-workflow.md` with this template:

```markdown
# AI Workflow Documentation - RSL Mini-Hack '26

## Team/Participant: [Name]
## Date: March 25, 2026
## Use Case: Personal finance tracker (see docs/use-case.md)

---

## Tools Used
| Tool | Purpose | Stage |
|------|---------|-------|
| Cursor (Agent Mode) | Code generation, debugging | Coding, Debug |
| Cursor (Chat) | Architecture planning | Brainstorm |
| Google Stitch | UI explorations / prototypes | Design |
| docs/DESIGN.md | Aperture design system (Stitch export) | Design |
| Figma (+ MCP) | Components, specs, handoff | Design |
| Supabase | Database + Auth | Infrastructure |
| Vercel | Next.js (`frontend/`) deploy | Deploy |
| Railway / Render / Fly | FastAPI (`backend/`) deploy | Deploy |
| Mermaid MCP | Architecture diagrams | Design |

---

## Timeline & AI Interactions

### Phase 1: Brainstorming & Architecture (0-10 min)

#### [09:00] Architecture Design
- **Tool**: Cursor Chat
- **Prompt**: "[actual prompt]"
- **Result**: Generated system architecture with data model
- **Decision**: Monorepo Next.js + FastAPI + Supabase; Vercel + separate API host
- **Time Saved**: ~20 min vs manual planning

---

### Phase 2: Scaffolding (10-15 min)

#### [09:10] Project Bootstrap
- **Tool**: Cursor Agent
- **Prompt**: "[actual prompt]"
- **Result**: `frontend/` + `backend/` skeletons, env templates, local run verified
- **Time Saved**: ~15 min vs manual setup

---

### Phase 3: Backend Development (15-45 min)

#### [09:15] FastAPI + database
- **Tool**: Cursor Agent + Supabase
- **Prompt**: "[actual prompt]"
- **Result**: Tables + RLS; REST routes in `backend/` with Pydantic + `/docs`

---

### Phase 4: Frontend Development (15-50 min)

#### [09:20] UI Components
- **Tool**: Cursor Agent
- **Prompt**: "[actual prompt]"
- **Result**: Responsive pages with shadcn/ui

---

### Phase 5: Integration & Testing (45-60 min)

#### [09:45] End-to-End Testing
- **Tool**: Cursor Agent + Browser
- **Prompt**: "[actual prompt]"
- **Result**: All flows working

---

### Phase 6: Deployment (60-80 min)

#### [10:00] Production Deploy
- **Tool**: Cursor Agent + Vercel + API host
- **Prompt**: "[actual prompt]"
- **Result**: Frontend [Vercel URL], API [API URL]; CORS + Supabase URLs updated

---

### Phase 7: Documentation (80-90 min)

#### [10:20] Final Documentation
- **Tool**: Cursor Agent
- **Prompt**: "Generate AI workflow documentation"
- **Result**: This document

---

## Summary Statistics
| Metric | Value |
|--------|-------|
| Total AI Interactions | [count] |
| Tools Used | [count] |
| Stages Covered | Brainstorm, Design, Code, Debug, Test, Deploy |
| Estimated Time Saved | [estimate] |

## Key Insights
- [What worked well with AI tools]
- [What required human intervention]
- [Unexpected AI capabilities discovered]
```

## Quick-Log Command

During the hackathon, quickly append entries:

```markdown
### [HH:MM] [Stage] - [Brief Title]
- **Tool**: [tool]
- **Prompt**: "[prompt]"
- **Result**: [outcome]
```

## Post-Hackathon Compilation

After the session, review Cursor's chat history and agent transcripts to fill
in any gaps in documentation.

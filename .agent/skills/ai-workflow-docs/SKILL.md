---
name: ai-workflow-docs
description: Generate and maintain AI workflow documentation for hackathon judging. Tracks prompts, tools, time savings, and decisions. Use when documenting AI usage, updating docs/ai-workflow.md, or preparing deliverables.
---

# AI Workflow Documentation Generator

## Goal

Keep `docs/ai-workflow.md` up to date so it covers AI usage across all stages
(brainstorm, design, code, debug, test, deploy) — a key judging criterion.

## Instructions

### 1. Quick-log entry (during the hackathon)

Append to `docs/ai-workflow.md`:

```markdown
### [HH:MM] Stage - Brief Title
- **Tool**: Cursor Agent / Antigravity / Stitch / Figma / Supabase MCP / …
- **Prompt**: "[actual prompt or summary]"
- **Result**: What was generated or fixed
- **Time Saved**: Estimate vs manual
```

### 2. Tools table

Keep the tools table near the top current:

| Tool | Purpose | Stage |
| ---- | ------- | ----- |
| Cursor (Agent) | Code gen, debug | Coding, Debug |
| Google Antigravity | Agentic IDE, parallel agents | Coding, Debug |
| Google Stitch | UI prototyping | Design |
| docs/DESIGN.md | Aperture system spec | Design |
| Figma (+ MCP) | Component specs, handoff | Design |
| Supabase MCP | DB operations | Coding |
| Vercel | Frontend deploy | Deploy |
| Railway / Render / Fly | Backend deploy | Deploy |
| Mermaid MCP | Diagrams | Design |

### 3. Post-hackathon compilation

Review chat/agent transcripts from both Cursor and Antigravity. Fill any gaps,
add summary statistics (total interactions, tools used, estimated time saved).

## Constraints

- Log **every** meaningful AI interaction, not just code generation.
- Include design (Stitch, Figma) and deploy steps, not only coding.
- Keep entries concise; one per significant action.

---
name: design-aperture
description: Apply the BudgetLens "Aperture Experience" design system from Google Stitch when building UI in frontend/. Covers colors, glassmorphism, typography (Manrope + Inter), surfaces, buttons, charts, and the no-border rule.
---

# Design — The Aperture Experience (Antigravity)

## Goal

Implement the Stitch-derived visual language consistently in the Next.js app.

## Primary reference

**`docs/DESIGN.md`** — full specification ("The Digital Lens", palette, surfaces, components, do/don't).

## Quick checklist

- **Surfaces:** stack `#061423` → `#0f1c2c` → `#132030` → `#1e2b3b` for hierarchy
- **Primary CTA:** gradient `#2ddbde` → `#008486` at 135°, `rounded-full`, no hard border
- **Glass:** floating chrome uses backdrop blur 12–20px + translucent fill
- **Type:** Manrope headlines, Inter body/labels (label letter-spacing ~0.05em)
- **Charts:** green positive `#67e100`, cyan spend `#2ddbde`, error over-budget `#ffb4ab`
- **Forbidden:** 1px solid grey/white section borders; pure black `#000`; heavy default shadows

## Instructions

1. When the user asks for UI, styling, or "match Stitch," open **`docs/DESIGN.md`** and align tokens before writing JSX/Tailwind.
2. Map tokens to `globals.css` / Tailwind theme in `frontend/` so components stay consistent.
3. For accessibility-only edges, use ghost border `#3e494a` at ~15% opacity.

## Constraints

- Do not invent a parallel palette; extend `docs/DESIGN.md` only with team agreement.

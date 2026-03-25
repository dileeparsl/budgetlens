---
name: design-aperture
description: Apply the BudgetLens "Aperture Experience" design system from Google Stitch when building or refactoring UI in frontend/. Use for Tailwind tokens, glassmorphism, charts, buttons, surfaces, typography (Manrope + Inter), and avoiding forbidden borders.
---

# Design — The Aperture Experience

## When to use

- Building or polishing any page or component under `frontend/`
- Translating Stitch/Figma mocks into code
- Charts, dashboards, cards, nav, modals, forms

## Source of truth

Read **`docs/DESIGN.md`** in full before large UI changes. It defines:

- **North star:** "Digital Lens" — asymmetry, glass layers, cyan/teal palette, calm authority
- **Colors:** primary `#2ddbde`, secondary `#94d3c1`, tertiary `#67e100`, surface `#061423`, nested surfaces (`surface_container_*`), gradient 135° to `#008486`
- **No-line rule:** no opaque 1px section borders; use tonal shifts and nesting
- **Glass:** `backdrop-blur` 12–20px on floating UI
- **Typography:** Manrope (display/headlines), Inter (body/labels; ~0.05em tracking on labels)
- **Components:** `rounded-full` primary buttons with gradient; `rounded-xl` (1.5rem) lens cards; ghost borders `#3e494a` @ ~15% opacity only if needed
- **Charts:** positive = tertiary; spending = primary; over-budget = error `#ffb4ab`

## Instructions

1. Prefer **CSS variables** or Tailwind `theme.extend` mapped to the hex tokens in `docs/DESIGN.md`.
2. Default theme: **dark-first** (the spec is dark-primary); light mode only if explicitly required later.
3. **Recharts** (or similar): series colors must follow "Focal Chart" semantics in `docs/DESIGN.md`.
4. After implementing a major screen, verify: no pure `#000`, no harsh dividers, shadows only on true floaters.

## Constraints

- Do not contradict `docs/DESIGN.md` without an explicit product decision logged in `docs/architecture.md` or the PR description.

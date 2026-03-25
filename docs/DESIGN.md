# Design System Specification: The Aperture Experience

> **Source**: Google Stitch — canonical UI direction for BudgetLens. Implement in `frontend/` (Tailwind, shadcn/ui, CSS variables). Figma handoff should stay aligned with this document.

## 1. Overview & Creative North Star

Personal finance is often cluttered, stressful, and overwhelming. This design system seeks to transform that experience through the **Creative North Star: The Digital Lens.**

Rather than a flat spreadsheet, we treat the UI as a sophisticated optical instrument. By utilizing intentional asymmetry, overlapping "glass" layers, and a deep tonal palette inspired by the brand’s cyan-to-teal gradients, we help users "focus" on what matters. We break the rigid, boxy templates of traditional fintech by using soft, organic curves (up to **`xl` / 1.5rem**) and breathable whitespace to create a sense of calm authority.

## 2. Colors & Tonal Depth

### The Palette

The system is built on a **dark mode primary** theme that utilizes deep teals and vibrant cyans to establish trust and technological precision.

| Token / role | Hex | Usage |
| -------------- | --- | ----- |
| **Primary** — "Aperture Cyan" | `#2ddbde` | High-priority actions, focal points |
| **Secondary** — soft mint | `#94d3c1` | Secondary accents, balanced data viz |
| **Tertiary** — "Growth Green" | `#67e100` | Positive trends, success states |
| **Neutral surface** — "The Void" | `#061423` | Page / app foundation |

### The "No-Line" Rule

To maintain a premium, high-end feel, **do not use 1px solid borders to section content.** 100% opaque borders are strictly prohibited. Instead, define boundaries through:

1. **Background color shifts:** `surface_container_low` against `surface` to define sections.
2. **Tonal transitions:** Subtle shifts in luminance to imply the edge of a container.

### Surface Hierarchy & Nesting

Think of the UI as physical layers of frosted glass.

| Layer | Token | Hex | Use |
| ----- | ----- | --- | --- |
| Background | `surface` | `#061423` | App / page base |
| Large sections | `surface_container_low` | `#0f1c2c` | Major regions |
| Primary cards | `surface_container` | `#132030` | Default cards |
| Nested / active | `surface_container_high` | `#1e2b3b` | Nested elements, emphasis |

### The "Glass & Gradient" Rule

Floating elements (modals, tooltips, navigation bars) should use **glassmorphism**: semi-transparent `surface_variant` with **`backdrop-blur` 12px–20px**.

- **Signature texture:** For hero CTAs and data headers, use a **linear gradient** from **primary** (`#2ddbde`) to **primary_container** (`#008486`) at **135°**.

### Implementation note (Tailwind)

Map tokens to CSS variables in `frontend` (e.g. `globals.css` or `tailwind.config`): e.g. `--aperture-primary`, `--aperture-surface`, then use `bg-[var(--aperture-surface)]` or extend Tailwind `theme.extend.colors`.

## 3. Typography

Dual-font strategy: editorial sophistication + utility readability.

| Role | Font | Notes |
| ---- | ---- | ----- |
| Display & headlines | **Manrope** | `display-lg` ~3.5rem; `headline-md` ~1.75rem; wider tracking on large sizes |
| Body & titles | **Inter** | `body-md` 0.875rem for financial data; `body-sm` 0.75rem |
| Labels | **Inter** | `label-md` / `label-sm`; metadata; **letter-spacing ~0.05em** for a "pro" look |

Load via `next/font/google` (`Manrope`, `Inter`) and apply in layout.

## 4. Elevation & Depth

### The Layering Principle

Avoid "shadow on everything." Depth comes from **stacking surface tiers**: a lower tier on `surface_container_low` reads "recessed"; `surface_container_high` reads "lifted."

### Ambient Shadows

Shadows **only** for elements that float above the layout (FABs, modals).

- **Blur:** 32px–64px  
- **Opacity:** 4%–8%  
- **Color:** Tinted shadow (`#002020` / `on_primary_fixed`), not pure black  

### The "Ghost Border" Fallback

If accessibility requires a border, use a **Ghost Border**: **`outline_variant`** `#3e494a` at **~15% opacity**. It should be felt, not seen.

## 5. Components

### Buttons

- **Primary:** Gradient fill (primary → primary_container), `on_primary` text, **no border**, **`rounded-full`**.
- **Secondary:** `surface_container_high` fill + **primary** ghost border.
- **Interaction:** Hover: +10% background opacity; press: **scale 98%**.

### Cards & Lists

- **No dividers:** No lines between list items; use vertical gap (`spacing: 2` / 0.5rem) or subtle hover background shift.
- **Lens card:** **`rounded-xl` (1.5rem)** on main dashboard cards (lens metaphor).

### Input Fields

- **Default:** `surface_container_highest` fill.
- **Focus:** **2px** primary ghost border + subtle primary outer glow (**4px blur, ~10% opacity**).

### Specialized: "The Focal Chart"

Financial data: high contrast on dark backgrounds.

| Semantic | Color |
| -------- | ----- |
| Positive | `tertiary` `#67e100` |
| Neutral / spending | `primary` `#2ddbde` |
| Warning / over-budget | `error` `#ffb4ab` |

## 6. Do’s and Don’ts

### Do

- Use **asymmetrical** layouts; let a chart bleed off a container edge for scale.
- Use **`xl` (1.5rem)** rounding on large containers to soften the dark theme.
- **Prioritize whitespace** — avoid information panic.

### Don’t

- **Don’t** use 1px solid white or grey borders — it breaks the Lens aesthetic.
- **Don’t** use pure black (`#000000`). Use **`surface` `#061423`**.
- **Don’t** use heavy default drop shadows.

## 7. Cross-tool workflow

- **Stitch** — exploration and flows; this doc captures the exported system spec.
- **Figma** — components and tokens; keep names/values aligned with sections above.
- **Cursor / Antigravity** — load skill **`design-aperture`** (or read this file) when building UI.

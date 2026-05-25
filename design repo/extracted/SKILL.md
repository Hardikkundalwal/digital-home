---
name: digital-home-design
description: Use this skill to generate well-branded interfaces and assets for Digital Home, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

**Digital Home** is a warm, Apple-inspired personal-productivity PWA. Each "room" of a digital house represents a life context (Study / Work / My Room). Dark mode is primary.

Key files:
- `colors_and_type.css` — design tokens (drop in via `<link>` and use semantic vars like `var(--bg)`, `var(--accent)`)
- `assets/` — logos, app icon, favicon (SVG only)
- `ui_kits/digital-home/` — React mobile UI kit + interactive prototype demo
- `preview/` — small static specimens for individual tokens / components

When designing:
- Dark `#1a1a1a` bg, `#242424` surface, `#c4a882` gold accent, `#f5f0e8` warm white text
- Cards: 16px radius, gold hairline border `rgba(196,168,130,0.14)`, generous 20px padding
- Inputs: 8px radius
- Bottom sheet: 24px top radius, frosted glass, iOS sheet curve `cubic-bezier(0.32, 0.72, 0, 1)`
- Type: System UI only (`-apple-system`), tight tracking on display, generous line-height on body
- Icons: Lucide, 18px, monoline stroke
- Voice: warm, second-person, sentence case, placeholders end in `…`, one `✨` allowed
- Never: bluish gradients, emoji-as-decoration, colored left-borders, pure black, web fonts

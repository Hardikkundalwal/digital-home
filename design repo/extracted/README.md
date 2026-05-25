# Digital Home — Design System

> A warm, Apple-inspired design language for **Digital Home**: a personal-productivity PWA where each room of a house represents a life context (Study, Work, My Room).
> Users *live* in their digital home — so every surface should feel cozy, premium and quiet.

---

## Product context

**Digital Home** is a single‑user (with light multi‑user "shared room" support) PWA built around a 3D scene per life context. Each room is a private workspace:

| Room       | Purpose                              | Accent          |
| ---------- | ------------------------------------ | --------------- |
| My Room    | Personal tasks, notes                | `#c4a882` gold  |
| Study      | University tasks, notes, pomodoro, exams, subject folders | `#7a9e6b` sage  |
| Work       | Job tasks, notes, quick links        | `#6b8f9e` slate |
| Shared     | Household / friend collab            | gold            |

Inside each room you see a 3D space (React Three Fiber). Clicking a **piece of furniture** (desk, bookshelf, radio, corkboard, clock, chair) slides up a **bottom sheet** containing the relevant panel — tasks, notes, pomodoro timer, radio player, etc.

The aesthetic should evoke a quiet warm room at dusk: deep charcoal walls, a single amber lamp, a wooden shelf. Premium and minimal — never corporate, cold, generic or flat.

### Source materials

- Codebase (read-only, attached locally): `digital-home/`
- Project notes: [`reference/project-overview.md`](reference/project-overview.md)
- Compiled global CSS: [`reference/digital-home.css`](reference/digital-home.css)
- Live URL: https://digital-home-cc21b.web.app
- Stack: React 19 · Vite · Firebase (Firestore + Auth + Hosting) · React Three Fiber · Framer Motion · Lucide React

---

## Index

```
README.md                  ← you are here
SKILL.md                   ← portable skill description
colors_and_type.css        ← all design tokens + semantic type classes
assets/                    ← logos, app icons, favicon (SVG)
preview/                   ← per-card HTML specimens for the Design System tab
ui_kits/
  └── digital-home/        ← React UI kit recreating the PWA
       ├── README.md
       ├── index.html      ← interactive mobile prototype
       ├── components.jsx  ← shared primitives (Button, Card, Sheet, Toggle…)
       ├── HomeScreen.jsx
       ├── RoomScreen.jsx
       ├── panels.jsx      ← TasksPanel, PomodoroPanel, RadioPanel
       └── DoorScreen.jsx  ← auth / welcome
reference/                 ← unmodified source materials
```

---

## Content Fundamentals

The voice is **warm, calm, second-person and quietly poetic** — closer to a wellness app than a productivity tool. Copy reads like notes a friend would write in your home.

### Tone

- **You-form, never corporate.** The user is the resident. Examples: *"Welcome back, Hadron ✨"*, *"What should we call you?"*, *"Enter my home"*, *"Leave home"* (sign out).
- **Spaces are named, not labeled.** Buttons say *"Enter my home"* not *"Sign in"*; the logout icon is titled *"Leave home"*. The login screen is `Door.jsx`; the auth panel is `door-card`.
- **Verbs are gentle.** *Tune in* a radio, *write a note*, *track an exam*, *create or join a room*. Avoid *manage, configure, optimize*.
- **Empty states are honest, never hyped.** *"No tasks yet."* *"No exams added yet. Click + Add Exam to track one."* *"No shared rooms yet. Create or join one."*

### Casing

- **Sentence case throughout** for body, buttons, headings — never Title Case for UI labels. ("Add a task…", not "Add A Task…")
- **Headings stay short** — 1–3 words ideally (*Tasks*, *Timer*, *Subjects*, *FM Radio*, *Shared Rooms*).
- Room codes are uppercased & dash-separated: `OUR-X7K2`.

### Punctuation & micro-copy patterns

- Placeholder text ends in **`…`** with three dots, never a period: *"Add a task…"*, *"Your name…"*, *"Write a note…"*, *"Room code (e.g. OUR-X7K2)"*.
- One **`✨`** sparkle is allowed in the greeting. That's it — emoji is otherwise reserved for legacy emoji on furniture (`☕ Break`, `🎧 Binaural`) being replaced by Lucide icons.
- Errors are conversational: *"Room not found. Check the code and try again."*

### Personalization

The display name is used heavily — *"Hadron's Home"*, *"Hadron's Room"*, *"Hadron's Study"*, *"Hadron's Work"*. When no name is set, fall back to the room category (*"My Room"*, *"Study Room"*, *"Work Room"*) — never a generic "Your room".

### Vibe — examples to mirror

| Don't                          | Do                                  |
| ------------------------------ | ----------------------------------- |
| Sign In                        | Enter my home                       |
| Log out                        | Leave home                          |
| Username                       | What should we call you?            |
| Hello, user.                   | Welcome back, Hadron ✨             |
| Configure settings             | Settings                            |
| 0 tasks                        | 3 remaining                         |
| Add new task                   | Add a task…                         |
| Productivity timer             | Focus / Break (Pomodoro)            |
| Manage household               | Shared Rooms                        |

---

## Visual Foundations

### Palette

The palette is **two warm hues over deep neutrals** — gold and cream over charcoal. Nothing saturated, no chromatic gradients, no purples or blues outside the room accents.

| Token             | Hex        | Role                                  |
| ----------------- | ---------- | ------------------------------------- |
| `--bg`            | `#1a1a1a`  | Dark primary background               |
| `--surface`       | `#242424`  | Cards / sheets on dark                |
| `--surface-2`     | `#2b2b2b`  | Alt surface, deeper inputs            |
| `--border`        | `#333333`  | Hairline borders, dark                |
| `--fg`            | `#f5f0e8`  | Warm white text (never pure white)    |
| `--fg-muted`      | `#8a7f6e`  | Muted captions, warm taupe            |
| `--accent`        | `#c4a882`  | Gold accent — dark mode               |
| `--accent`(light) | `#8b6f47`  | Darker gold — light mode              |
| `--dh-cream-50`   | `#f5efe6`  | Light mode bg                         |
| Light surface     | `#ffffff`  | Light mode surface                    |
| Study accent      | `#7a9e6b`  | Sage green                            |
| Work accent       | `#6b8f9e`  | Dusty slate-blue                      |

**Rule:** Dark mode is primary. Most users will only ever see dark. Light mode is a faithful inversion with the *same hierarchy*, not a separate palette.

### Type

System UI exclusively — `-apple-system, BlinkMacSystemFont, "SF Pro Text"…`. No web fonts. This is deliberate: SF Pro is what users already trust on their phones, and it keeps the bundle tiny for a PWA.

- Headings: `600` weight, slightly tight tracking (`-0.01em` to `-0.02em`).
- Body: `400`, generous line-height (`1.5`).
- Numbers in timers use `font-variant-numeric: tabular-nums` and `letter-spacing: 2px`.
- Italic, muted is the "quote" voice (Daily Quote widget).

See `colors_and_type.css` for the full type ramp and helper classes.

### Spacing

Apple-inspired and **generous**. Default rhythm steps in 4px units; cards breathe at 20–24px inner padding; sections separate by 24–32px. Never crowd.

- Container max width on phone screens: `600px` (kept narrow even on desktop — the app feels held, not stretched).
- Card padding: `20px` (`var(--sp-5)`).
- Sheet padding: `24px` top, `16px` sides.

### Radii

Two radii do almost all the work:

- **`16px` cards** — every Room Card, Shared Room Card, weather pill cluster.
- **`8px` inputs / chips / buttons** — task inputs, preset buttons, btn-icon.
- **`24px` top corners on the bottom sheet** — the signature shape.
- **`999px` pills** — Trivia answer buttons, hint chips.
- The door card has an asymmetric `16/16/8/8` radius — feels like a slab.

### Cards

The signature card:

- Background: `#242424` (dark) / `#ffffff` (light)
- Border: `1px solid rgba(196,168,130,0.14)` — a **subtle gold hairline** that catches light. The thing that says "premium".
- Radius: `16px`
- Shadow: `0 1px 4px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.15)` — never aggressive. Lifts on hover to `0 4px 16px …` *and* `translateY(-2px)`.
- Optional **top accent bar:** `border-top: 3px solid var(--accent)` on Room Cards.

Never:
- Pure black borders, pure black shadows
- Colored left-border accents (the corporate cliché)
- Glassmorphism on cards (reserved for the bottom sheet only)

### Backgrounds

- **Flat charcoal** is the default — no patterns, no gradients on app surfaces.
- The Door (login) page is the **one exception**: a subtle warm wood gradient (`linear-gradient(135deg, #5a3e28, #3d2818)`) plus a 3px diagonal pin‑stripe at `87deg` and a glowing radial under the door. This is themed scenery, not the system.
- 3D room scenes provide their own background via R3F.
- Light mode body is `#f5efe6` (cream) — never pure white.

### Animation

Fades and slides only — no bounces, no springs heavier than the iOS sheet curve.

- **Card entry:** `fadeUp 0.4s ease both`, staggered `0.1s` between siblings.
- **Sheet:** `transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)` — Apple's modal curve.
- **Hover:** `0.2s ease` for shadow & translate.
- **Backdrop:** `opacity 0.3s ease`.
- **3D camera:** lerps toward clicked furniture, then back.
- Avoid bounces, scale-up reveals, particle anims, large rotations.

### Hover & press

- Cards: `box-shadow` deepens and `translateY(-2px)` on hover. No color change.
- Primary buttons (`.btn-primary`): `background` → `accent-hover` (slightly darker gold).
- Secondary / ghost: subtle `background` change to `var(--bg)`.
- Active/pressed: just remove the lift (don't shrink). Inputs gain a `3px` warm focus ring at `rgba(196,168,130,0.15)`.
- Toggle: gold fill with white knob, slides 18px right.

### Borders, dividers, shadows

- **Hairline borders** (`1px`) everywhere — never `2px+` on UI elements. The gold hairline is the design's whisper.
- **Inner glow / ring** for focus only: `box-shadow: 0 0 0 3px rgba(196,168,130,0.15)`.
- Section dividers are 1px in `var(--divider)` with generous (`24px+`) space around them.

### Transparency & blur

Reserved for the **bottom sheet** and **tour overlay**:

- Bottom sheet: `backdrop-filter: blur(20px) saturate(140%)` over a `rgba(36,36,36,0.78)` fill — frosted glass over the 3D scene. Always rounded 24px top.
- Tour modal overlay: `rgba(0,0,0,0.5)` + `blur(8px)`.
- Cards do **not** use blur. Only floating overlays do.

### Imagery vibe

Warm, soft-lit, **3D not photographic**. The product itself is the imagery — rendered rooms with golden lighting (light pours from a single warm source). No stock photos. No illustrations.

### Layout rules

- Mobile-first. Everything works one-handed on a phone first.
- Top scene bar: `<button> + <h1> + <button>`, 48px tall.
- Bottom sheet is the only floating surface that ever appears.
- Page max-width `600px`, centered.
- Scroll lives inside the sheet body, not the page.

---

## Iconography

**Lucide React** is the icon system. Always pull from `lucide-react`; never inline custom SVGs in components.

- **Stroke style:** 1.5px stroke, rounded caps/joins, monoline (Lucide's defaults).
- **Default size:** `18px` in headers and inline with text; `16px` in compact buttons; `15–18px` is the sweet spot.
- **Color:** `currentColor` — icons inherit `var(--accent)` in headers, `var(--fg-muted)` in subdued spots, `#fff` on filled accent buttons.

### Canonical icon mapping

| Concept           | Icon (lucide)    | Usage                       |
| ----------------- | ---------------- | --------------------------- |
| Home / brand      | `Home`           | Header H1, branding         |
| Sign out          | `DoorOpen`       | Top-right "Leave home"      |
| My Room           | `Bed`            | Room card                   |
| Study             | `BookOpen`       | Room card, Pomodoro label   |
| Work              | `Briefcase`      | Room card                   |
| Shared            | `Wifi`           | Shared rooms section        |
| Tasks             | `Pencil`         | Sheet title                 |
| Notes             | `ClipboardList`  | Sheet title                 |
| Pomodoro / Timer  | `Timer`          | Sheet title                 |
| Exams             | `Calendar`       | Sheet title                 |
| Radio             | `Radio`          | Sheet title, now-playing    |
| Settings          | `Settings`       | Sheet title                 |
| Help              | `HelpCircle`     | Top-right secondary action  |
| Play / Pause      | `Play` / `Pause` | Pomodoro, radio             |
| Reset             | `Undo2`          | Pomodoro reset, task toggle |
| Add               | `Plus`           | "+ Create" buttons          |
| Delete            | `X` / `Trash2`   | Task / exam delete          |
| Back              | `ArrowLeft`      | Scene bar back              |
| Forward           | `ArrowRight`     | Shared room card chevron    |
| Weather           | `Sun` `CloudSun` `Cloud` `CloudRain` `CloudSnow` `CloudLightning` `CloudFog` `CloudDrizzle` | Weather widget — mapped by Open-Meteo `weathercode` |

In static HTML / specimens here, **embed Lucide via CDN**:

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<i data-lucide="home"></i>
<script>lucide.createIcons();</script>
```

### Emoji

The **only** sanctioned emoji is the **`✨` sparkle** in the welcome greeting (*"Welcome back, Hadron ✨"*). Some legacy emoji remain in the codebase (`☕ Break`, `🎧 Binaural`, `🔒` locked room badge) and should be **migrated to Lucide** — flag them when you encounter them.

### Logos & app icons

Two stylistic versions, each in dark / light:

| File                          | Use                                       |
| ----------------------------- | ----------------------------------------- |
| `assets/logo-mark-dark.svg`   | Small house mark — gold on charcoal       |
| `assets/logo-mark-light.svg`  | Small house mark — gold on cream          |
| `assets/wordmark-dark.svg`    | Mark + "Digital Home" lockup, dark        |
| `assets/wordmark-light.svg`   | Mark + "Digital Home" lockup, light       |
| `assets/app-icon-dark.svg`    | 512px PWA icon, dark (rounded square)     |
| `assets/app-icon-light.svg`   | 512px PWA icon, light                     |
| `assets/favicon.svg`          | 32px favicon, dark                        |
| `assets/source-icon-*.svg`    | Original codebase icons (preserved)       |

The logo is a single-line house outline with the door cut out — abstract enough not to feel cartoonish, literal enough to read at 16px. Always pure stroke (`stroke-linejoin: round`, `stroke-linecap: round`), never filled.

---

## UI Kits

- **[`ui_kits/digital-home/`](ui_kits/digital-home/)** — React recreation of the mobile PWA. Renders the Door (auth) → Home → Room → Bottom sheet flow as an interactive prototype.

---

## ⚠️ Substitutions & caveats

- **No font files** are bundled — Digital Home uses system UI exclusively. If a future spec requires a webfont, document it here.
- **Lucide** is referenced via the CDN (`lucide@latest`) inside HTML specimens; the codebase imports `lucide-react`. These render identically.
- 3D room scenes themselves are not part of this design system (they live in `digital-home/src/components/room3d/`). UI panels and chrome over the 3D scene are documented here.
- The Pomodoro panel's binaural-beats toggle and Bed-panel sleep timer are documented at a high level only — they're domain-specific UI clusters.

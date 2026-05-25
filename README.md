# 🏡 Digital Home UI/UX (V2 Upgrade)

> A premium, Apple-inspired, and cozy personal productivity PWA with interactive 3D rooms. 

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Web%20App-gold?style=for-the-badge&logo=firebase&logoColor=white)](https://digital-home-cc21b.web.app)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev)
[![ThreeJS](https://img.shields.io/badge/Three.js-r184-charcoal?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![Firebase](https://img.shields.io/badge/Firebase-v12-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com)

---

## 📖 Project Overview & Purpose

**Digital Home** is a cozy, centralized digital space designed to act as your personal productivity center. Each 3D room represents a distinct life context—**Study**, **Work**, and **My Room (Personal)**. 

Rather than navigating standard corporate dashboards, users interact with an immersive 3D space by clicking on different pieces of furniture (like the desk, clock, or couch) to slides up elegant, contextual productivity panels. It is designed both for individual focus and **household collaboration** via real-time shared multiplayer rooms.

---

## 🎨 Design System & V2 Aesthetics

Digital Home is heavily inspired by Apple's signature hardware and software aesthetic guidelines, blended with a lofi room layout:

*   **Frosted Glassmorphism Sheets**: UI modals use `backdrop-filter: blur(20px) saturate(140%)` overlays with soft surface colors (`rgba(36,36,36,0.78)` for dark theme, `rgba(255,255,255,0.78)` for light theme).
*   **iOS Standard Animation Curves**: Fluid sheet slide-ups and state transitions utilize native Apple curves (`cubic-bezier(0.32, 0.72, 0, 1)`) with a native-feeling `0.4s` timing.
*   **Hairline Gold Borders**: Whisper-thin highlights (`rgba(196, 168, 130, 0.14)` for dark mode, `rgba(139, 111, 71, 0.14)` for light mode) outline all active components, cards, and modal grab handles to catch ambient shadows.
*   **Monoline Vector Icons**: Emojis have been migrated to precise, cohesive `lucide-react` vector elements set to a monoline stroke weight of `strokeWidth={1.5}`.
*   **Quiet Microcopy**: Professional, calm, second-person action copy with standard sentence casing throughout headers, placeholders, and loading ellipsis (`…`).

---

## 🚀 Outstanding Features

### 🎮 1. WebGL Interactive 3D Rooms
Experience full spatial immersion through multiple dedicated scenes:
*   **Study Room**: An interactive school classroom equipped with a customizable floating avatar and active zones.
*   **Personal Room & Work Space**: Photorealistic cozy living space configured in warm styling for My Room, and cool, modern office styling for Work Room.
*   **Orbit Controls & Camera Focus**: Fluid pan, zoom, and damping, alongside cameras that dynamically focus and zoom in on clicked furniture pieces.

### 👥 2. Real-Time Multiplayer Presence & Sync
*   **Cooperative Shared Rooms**: Create or join multiplayer sync rooms with invite codes.
*   **Synchronized State Panels**: Real-time synced shopping/task lists, shared notes, and synchronized audio players.
*   **Multiplayer Avatars**: See customizable 3D avatars representing online users walking and standing in the room in real-time!

### ⏳ 3. Cozy Productivity Suite
*   **Binaural Beats & Soundscapes**: Control binaural beats and ambient cozy loops (Rain, Ocean waves, crackling Fireplace, Forest rustles).
*   **Pomodoro Timer**: Classic Pomodoro timer (`Focus` and `Break` periods) integrated directly with lofi beats.
*   **Subjects & Folders**: Beautiful bookshelf organization for organizing school/work folders.
*   **Exams Tracker & TV Trivia**: Manage calendar deadlines and play interactive TV-stand trivia challenges.

---

## ⚡ Key Architectural Decisions

*   **Slide Sheet Modals (Non-Disruptive Flow)**: Clicking on furniture opens a smooth glassmorphic bottom sheet panel instead of navigating away to a new page, maintaining complete spatial immersion.
*   **Camera Lerp & Zoom Target**: The 3D camera smoothly lerps directly toward clicked furniture to look at it up-close, and gracefully lerps back to the room view when the panel is dismissed.
*   **Three.js Module Deduplication**: Enabled built-in Vite `dedupe` systems inside `vite.config.js` to solve global cache conflicts, resolving any rendering conflicts between React Three Fiber and Spline.
*   **Memory-Optimized Mesh Cloning**: Custom GLTF models utilize Drei's `<Clone>` wrapper to guarantee separate heap-allocation, eliminating race conditions on shared object graphs.
*   **Adaptive Viewport FOV**: Fully optimized for mobile screens. The camera dynamically adjusts its Field of View (FOV) to `75` on mobile screens for a wider isometric view, and `50` on desktop monitors for perfect room framing.

---

## 📂 Project Structure

```bash
├── public/
│   └── models/               # GLTF 3D models (classroom & vintage room)
├── src/
│   ├── pages/                # Main Room Pages (StudyRoom, WorkRoom, MyRoom, Home, Door)
│   ├── components/
│   │   ├── room3d/           # All 3D Scene graphics, shaders, and animations
│   │   │   ├── Furniture3D   # Low-poly interactive fallback furniture primitives
│   │   │   ├── Room3D        # Shared WebGL Canvas, lighting rigs, and camera systems
│   │   │   └── Study/My/Work # Context-specific GLTF room scenes
│   │   └── room/
│   │       ├── RoomSheet     # Premium sliding frosted bottom sheet
│   │       └── panels/       # Content panels (Tasks, Notes, Pomodoro, settings)
│   ├── hooks/                # Real-time Firebase Firestore data subscriptions
│   └── styles/
│       └── index.css         # Apple-inspired tailwind styles and CSS variables
```

---

## 🛠️ The Tech Stack

*   **Frontend Library**: React 19 (React-DOM, TypeScript compatible)
*   **3D Render Engine**: Three.js (r184), React Three Fiber (R3F)
*   **3D Declarative Helpers**: `@react-three/drei` (Clone nodes, OrbitControls, Environment presets, ContactShadows)
*   **Backend & DB**: Firebase v12 (Firestore Realtime DB, Auth, Hosting, Storage)
*   **Styling & Motion**: Tailwind CSS v4, Framer Motion
*   **Bundler**: Vite 8, Rolldown
*   **PWA Cache**: Workbox Progressive Web App configuration (`sw.js`)

---

## 💻 Quick Start & Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/digital-home.git
cd digital-home
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure credentials
Copy the public environment template and fill in your private Firebase API keys:
```bash
cp .env.example .env
```
Add your credentials to the newly created `.env` file (this file is pre-configured in `.gitignore` and will never be committed to GitHub).

### 4. Run local development server
```bash
npm run dev
```

### 5. Build for production & Deploy
```bash
npm run build
npx firebase deploy --only hosting
```

---

## 🧩 Architecture Flow

```mermaid
graph TD
    User([User Browser]) -->|Loads App| SPA[PWA / Vite App]
    SPA -->|Renders 3D View| R3F[React Three Fiber & Drei]
    R3F -->|Loads| GLTF[Photorealistic GLTF Models]
    SPA -->|Real-time Subscriptions| Firestore[Firebase Firestore]
    Firestore -->|Syncs Presence| Avatars[Multiplayer 3D Avatars]
    SPA -->|State Management| Hooks[usePresence / useTasks / useAudio]
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

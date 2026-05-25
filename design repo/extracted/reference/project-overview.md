# Digital Home

## Project Overview
Personal productivity PWA with 3D rooms. Each room is a life context 
(Study, Work, My Room) with furniture you click to open panels.

## Tech Stack
- React + Vite + PWA
- Firebase (Firestore, Auth, Hosting)
- React Three Fiber + @react-three/drei + @react-three/postprocessing
- Framer Motion + Lucide React
- Firebase project ID: digital-home-cc21b

## Commands
- Dev: `npm run dev`
- Build: `npm run build`  
- Deploy: `npm run deploy` (builds + deploys to Firebase Hosting)
- Deploy rules only: `firebase deploy --only firestore:rules`

## Project Structure
- `src/pages/` — room pages (StudyRoom, WorkRoom, MyRoom, Home, Door)
- `src/components/room3d/` — all 3D scene components
- `src/components/room3d/Furniture3D.jsx` — all furniture components
- `src/components/room3d/Room3D.jsx` — shared canvas, lighting, camera
- `src/components/room/panels/` — bottom sheet panel content
- `src/components/room/RoomSheet.jsx` — sliding bottom sheet
- `src/hooks/` — Firebase data hooks (useTasks, useNotes, useProfile etc)
- `src/styles/index.css` — all styles, supports dark mode
- `public/models/` — GLTF 3D models go here

## Key Decisions
- Furniture click opens bottom sheet panel, not a new page
- Camera lerps toward clicked furniture then back on close
- Dark mode supported via CSS variables
- Avatar sits at desk in every room with idle bob animation
- Shared rooms feature for household collaboration (Firestore realtime)

## Known Issues
- Work room ceiling color mismatch (being fixed)
- Mobile camera FOV needs to be wider (75 on mobile, 50 on desktop)
- Furniture built from primitives, replacing with GLTF models

## Live URL
https://digital-home-cc21b.web.app
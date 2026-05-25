# Digital Home — Mobile PWA UI Kit

High-fidelity React recreation of the Digital Home mobile PWA.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Interactive prototype — click Door → Home → Rooms → Panels |
| `components.jsx` | Primitives: Icon, buttons, inputs, Toggle, Sheet, RoomCard, TaskItem, WeatherPill, SceneBar |
| `DoorScreen.jsx` | Auth + name-entry screen |
| `panels.jsx` | TasksPanel, NotesPanel, PomodoroPanel, RadioPanel (with live countdown) |
| `HomeScreen.jsx` | Home with room grid, weather, shared rooms |
| `RoomScreen.jsx` | 3D scene atmosphere + furniture buttons + bottom sheet |

## Flow

```
DoorScreen (auth / name)
  └─▶ HomeScreen
        ├─▶ RoomScreen / my-room  →  Tasks · Notes
        ├─▶ RoomScreen / study    →  Tasks · Notes · Timer · Radio
        └─▶ RoomScreen / work     →  Tasks · Notes · Timer
```

## Usage

Open `index.html` in a browser. All files are co-located; no build step required.

## Design spec

- Dark `#1a1a1a` bg, `#242424` surface, `#c4a882` gold accent
- System UI font (`-apple-system`), 16px radius cards, 8px radius inputs
- Bottom sheet: `rgba(36,36,36,0.88)` + `backdrop-filter: blur(20px)`
- Lucide icons via CDN UMD

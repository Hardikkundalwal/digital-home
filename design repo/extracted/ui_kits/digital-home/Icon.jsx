// Icon.jsx — tiny inline Lucide-style icon set for Digital Home.
// Stroke 1.75, rounded caps. currentColor.
const Ic = ({ size = 18, stroke = 1.75, children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={stroke}
    strokeLinecap="round" strokeLinejoin="round"
    {...rest}>{children}</svg>
);

const Icon = {
  Home:    (p) => <Ic {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></Ic>,
  DoorOpen:(p) => <Ic {...p}><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h20"/><path d="M13 20V4l-6 2v14"/><path d="M11 12v.01"/></Ic>,
  Bed:     (p) => <Ic {...p}><path d="M2 9v11"/><path d="M22 13v7"/><path d="M2 13h20"/><path d="M2 13a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3"/><circle cx="7" cy="8" r="2"/></Ic>,
  BookOpen:(p) => <Ic {...p}><path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z"/><path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/></Ic>,
  Briefcase:(p) => <Ic {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></Ic>,
  Wifi:    (p) => <Ic {...p}><path d="M5 12.55a11 11 0 0 1 14 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></Ic>,
  Pencil:  (p) => <Ic {...p}><path d="M21.17 6.83a2.83 2.83 0 0 0-4-4L4 16v4h4z"/><path d="m15 5 4 4"/></Ic>,
  Clipboard:(p) => <Ic {...p}><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6"/><path d="M9 16h4"/></Ic>,
  Timer:   (p) => <Ic {...p}><path d="M10 2h4"/><path d="M12 14V8"/><circle cx="12" cy="14" r="8"/></Ic>,
  Calendar:(p) => <Ic {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></Ic>,
  Radio:   (p) => <Ic {...p}><path d="M4.9 19.1A10 10 0 0 1 4.9 4.9"/><path d="M7.8 16.2a6 6 0 0 1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.5"/><path d="M19.1 4.9a10 10 0 0 1 0 14.2"/></Ic>,
  Settings:(p) => <Ic {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.32.21.59.5.79.85.2.36.31.77.31 1.19V11a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Ic>,
  Help:    (p) => <Ic {...p}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></Ic>,
  Play:    (p) => <Ic {...p}><polygon points="6 3 20 12 6 21 6 3"/></Ic>,
  Pause:   (p) => <Ic {...p}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></Ic>,
  Undo:    (p) => <Ic {...p}><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></Ic>,
  Plus:    (p) => <Ic {...p}><path d="M12 5v14"/><path d="M5 12h14"/></Ic>,
  X:       (p) => <Ic {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></Ic>,
  Check:   (p) => <Ic {...p}><path d="M20 6 9 17l-5-5"/></Ic>,
  ArrowL:  (p) => <Ic {...p}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></Ic>,
  ArrowR:  (p) => <Ic {...p}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></Ic>,
  Sun:     (p) => <Ic {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></Ic>,
  CloudSun:(p) => <Ic {...p}><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></Ic>,
  CloudRain:(p) => <Ic {...p}><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/><path d="M17 18H7a5 5 0 0 1-.8-9.94 7 7 0 0 1 13.6 1.94A4 4 0 0 1 17 18Z"/></Ic>,
  Headphones:(p) => <Ic {...p}><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1zm14 0h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2a1 1 0 0 0 1-1z"/><path d="M21 14v-2a9 9 0 0 0-18 0v2"/></Ic>,
  Trash:   (p) => <Ic {...p}><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6 18 20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></Ic>,
  Sparkles:(p) => <Ic {...p}><path d="m12 3-1.9 5.8L4 11l6.1 1.9L12 19l1.9-6.1L20 11l-6.1-2.2z"/></Ic>,
};

window.Icon = Icon;

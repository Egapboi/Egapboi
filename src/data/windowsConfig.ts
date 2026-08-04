export interface WindowConfig {
  id: string;
  title: string;
  icon: string;
  workspace: number;
  defaultX: number;
  defaultY: number;
  defaultWidth: number;
  defaultHeight: number;
  component: string;
}

export const windowsConfig: WindowConfig[] = [
  {
    id: "about",
    title: "about.txt",
    icon: "terminal",
    workspace: 1,
    defaultX: 60,
    defaultY: 40,
    defaultWidth: 600,
    defaultHeight: 460,
    component: "about",
  },
  {
    id: "contact",
    title: "links/",
    icon: "link",
    workspace: 1,
    defaultX: 700,
    defaultY: 80,
    defaultWidth: 420,
    defaultHeight: 340,
    component: "contact",
  },
  {
    id: "projects",
    title: "projects/",
    icon: "folder",
    workspace: 2,
    defaultX: 80,
    defaultY: 40,
    defaultWidth: 900,
    defaultHeight: 520,
    component: "projects",
  },
  {
    id: "music",
    title: "ncmpcpp",
    icon: "music",
    workspace: 3,
    defaultX: 100,
    defaultY: 100,
    defaultWidth: 800,
    defaultHeight: 500,
    component: "music",
  },
  {
    id: "media",
    title: "now_playing.jpg",
    icon: "image",
    workspace: 3,
    defaultX: 100,
    defaultY: 100,
    defaultWidth: 600,
    defaultHeight: 400,
    component: "media",
  },
];

export const workspaces = [
  { id: 1, label: "home", icon: "home" },
  { id: 2, label: "code", icon: "code" },
  { id: 3, label: "media", icon: "music" },
];

export const keybinds = [
  { key: "q", description: "Close focused window" },
  { key: "m", description: "Minimize window" },
  { key: "Tab", description: "Cycle focus" },
  { key: "1 / 2 / 3", description: "Switch workspace" },
  { key: "?", description: "Toggle keybind sheet" },
  { key: "/", description: "Open command palette" },
  { key: "Esc", description: "Close overlay / unfocus" },
  { key: "Alt+Shift+Q", description: "Close window (modifier)" },
  { key: "Alt+Shift+K", description: "Command palette (modifier)" },
  { key: "Alt+Shift+←/→ (or H/L)", description: "Swap window positions" },
  { key: "Alt+Shift+F", description: "Toggle window floating state" },
  { key: "Alt+Shift+V", description: "Toggle layout split direction" },
];

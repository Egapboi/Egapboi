"use client";

import { create } from "zustand";

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  workspace: number;
  zIndex: number;
  minimized: boolean;
  focused: boolean;
  component: string;
  // Floating state properties
  isFloating: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WmState {
  windows: WindowState[];
  activeWorkspace: number;
  focusedWindowId: string | null;
  theme: "dark" | "high-contrast";
  audioEnabled: boolean;
  commandPaletteOpen: boolean;
  keybindSheetOpen: boolean;
  calendarOpen: boolean;
  nextZIndex: number;
  /** Split ratio (0-1) for the divider between tiled windows. 0.5 = equal split. */
  splitRatio: number;
  /** Layout direction for tiled windows */
  layoutDirection: "horizontal" | "vertical";

  // Playback state
  isPlaying: boolean;
  currentTrackId: string | null;
  volume: number;
  playbackTime: number;
  youtubePlayer: any;

  // Window actions
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  unfocusAll: () => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  cycleFocus: () => void;
  /** Swap the focused window's tile position in the given direction (-1 = left/up, +1 = right/down) */
  swapFocusedDirection: (direction: number) => void;
  /** Swap two windows' positions in the array */
  swapWindows: (id1: string, id2: string) => void;
  /** Set the split ratio for the divider */
  setSplitRatio: (ratio: number) => void;
  
  // Floating window actions
  toggleFloating: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;

  // Layout actions
  toggleLayoutDirection: () => void;

  // Playback actions
  playTrack: (videoId: string) => void;
  togglePlayback: () => void;
  setVolume: (v: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackTime: (t: number) => void;
  setYoutubePlayer: (p: any) => void;

  // Workspace actions
  setWorkspace: (n: number) => void;

  // UI toggles
  toggleTheme: () => void;
  toggleAudio: () => void;
  toggleCommandPalette: () => void;
  toggleKeybindSheet: () => void;
  toggleCalendar: () => void;
  closeAllOverlays: () => void;
}

const DEFAULT_WINDOWS: WindowState[] = [
  {
    id: "about",
    title: "about.txt",
    icon: "terminal",
    workspace: 1,
    zIndex: 1,
    minimized: false,
    focused: true,
    component: "about",
    isFloating: false,
    x: 100,
    y: 100,
    width: 600,
    height: 400,
  },
  {
    id: "contact",
    title: "links/",
    icon: "link",
    workspace: 1,
    zIndex: 0,
    minimized: false,
    focused: false,
    component: "contact",
    isFloating: false,
    x: 150,
    y: 150,
    width: 420,
    height: 340,
  },
  {
    id: "projects",
    title: "projects/",
    icon: "folder",
    workspace: 2,
    zIndex: 2,
    minimized: false,
    focused: false,
    component: "projects",
    isFloating: false,
    x: 100,
    y: 100,
    width: 900,
    height: 520,
  },
  {
    id: "music",
    title: "ncmpcpp",
    icon: "music",
    workspace: 3,
    zIndex: 1,
    minimized: false,
    focused: false,
    component: "music",
    isFloating: false,
    x: 100,
    y: 100,
    width: 800,
    height: 500,
  },
  {
    id: "media",
    title: "now_playing.jpg",
    icon: "image",
    workspace: 3,
    zIndex: 1,
    minimized: true,
    focused: false,
    component: "media",
    isFloating: false,
    x: 100,
    y: 100,
    width: 600,
    height: 400,
  },
];

export const useWmStore = create<WmState>((set, get) => ({
  windows: DEFAULT_WINDOWS,
  activeWorkspace: 1,
  focusedWindowId: "about",
  theme: "dark",
  audioEnabled: true,
  commandPaletteOpen: false,
  keybindSheetOpen: false,
  calendarOpen: false,
  nextZIndex: 3,
  splitRatio: 0.5,
  layoutDirection: "horizontal",
  isPlaying: false,
  currentTrackId: null,
  volume: 50,
  playbackTime: 0,
  youtubePlayer: null,

  openWindow: (id: string) => {
    set((state) => {
      const existing = state.windows.find((w) => w.id === id);
      if (existing) {
        return {
          windows: state.windows.map((w) =>
            w.id === id
              ? { ...w, minimized: false, focused: true, zIndex: state.nextZIndex }
              : { ...w, focused: false }
          ),
          focusedWindowId: id,
          activeWorkspace: existing.workspace,
          nextZIndex: state.nextZIndex + 1,
        };
      }
      return state;
    });
  },

  closeWindow: (id: string) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true, focused: false } : w
      ),
      focusedWindowId:
        state.focusedWindowId === id ? null : state.focusedWindowId,
    }));
  },

  focusWindow: (id: string) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? { ...w, focused: true, zIndex: state.nextZIndex }
          : { ...w, focused: false }
      ),
      focusedWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  unfocusAll: () => {
    set((state) => ({
      windows: state.windows.map((w) => ({ ...w, focused: false })),
      focusedWindowId: null,
    }));
  },

  minimizeWindow: (id: string) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true, focused: false } : w
      ),
      focusedWindowId:
        state.focusedWindowId === id ? null : state.focusedWindowId,
    }));
  },

  restoreWindow: (id: string) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? { ...w, minimized: false, focused: true, zIndex: state.nextZIndex }
          : { ...w, focused: false }
      ),
      focusedWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  cycleFocus: () => {
    set((state) => {
      const visibleWindows = state.windows.filter(
        (w) => w.workspace === state.activeWorkspace && !w.minimized
      );
      if (visibleWindows.length === 0) return state;

      const currentIndex = visibleWindows.findIndex(
        (w) => w.id === state.focusedWindowId
      );
      const nextIndex = (currentIndex + 1) % visibleWindows.length;
      const nextWindow = visibleWindows[nextIndex];

      return {
        windows: state.windows.map((w) =>
          w.id === nextWindow.id
            ? { ...w, focused: true, zIndex: state.nextZIndex }
            : { ...w, focused: false }
        ),
        focusedWindowId: nextWindow.id,
        nextZIndex: state.nextZIndex + 1,
      };
    });
  },

  swapFocusedDirection: (direction: number) => {
    set((state) => {
      if (!state.focusedWindowId) return state;
      // Only swap tiled windows
      const visibleTiledWindows = state.windows.filter(
        (w) => w.workspace === state.activeWorkspace && !w.minimized && !w.isFloating
      );
      const currentIndex = visibleTiledWindows.findIndex(
        (w) => w.id === state.focusedWindowId
      );
      if (currentIndex === -1) return state;

      const targetIndex = currentIndex + direction;
      if (targetIndex < 0 || targetIndex >= visibleTiledWindows.length) return state;

      const currentId = visibleTiledWindows[currentIndex].id;
      const targetId = visibleTiledWindows[targetIndex].id;

      const currentMainIndex = state.windows.findIndex((w) => w.id === currentId);
      const targetMainIndex = state.windows.findIndex((w) => w.id === targetId);

      const newWindows = [...state.windows];
      const temp = newWindows[currentMainIndex];
      newWindows[currentMainIndex] = newWindows[targetMainIndex];
      newWindows[targetMainIndex] = temp;

      return { windows: newWindows };
    });
  },

  swapWindows: (id1: string, id2: string) => {
    set((state) => {
      const idx1 = state.windows.findIndex((w) => w.id === id1);
      const idx2 = state.windows.findIndex((w) => w.id === id2);
      if (idx1 === -1 || idx2 === -1) return state;

      const newWindows = [...state.windows];
      const temp = newWindows[idx1];
      newWindows[idx1] = newWindows[idx2];
      newWindows[idx2] = temp;

      return { windows: newWindows };
    });
  },

  setSplitRatio: (ratio: number) => {
    set({ splitRatio: Math.max(0.1, Math.min(0.9, ratio)) });
  },

  toggleFloating: (id: string) => {
    set((state) => {
      return {
        windows: state.windows.map((w) => {
          if (w.id === id) {
            const isFloating = !w.isFloating;
            return {
              ...w,
              isFloating,
              // If becoming floating, ensure it's on top
              zIndex: isFloating ? state.nextZIndex : w.zIndex,
            };
          }
          return w;
        }),
        nextZIndex: state.windows.find(w => w.id === id && !w.isFloating) ? state.nextZIndex + 1 : state.nextZIndex,
      };
    });
  },

  moveWindow: (id: string, x: number, y: number) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, x, y } : w
      ),
    }));
  },

  resizeWindow: (id: string, width: number, height: number) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? { ...w, width: Math.max(200, width), height: Math.max(150, height) }
          : w
      ),
    }));
  },

  toggleLayoutDirection: () => {
    set((state) => ({
      layoutDirection: state.layoutDirection === "horizontal" ? "vertical" : "horizontal",
    }));
  },

  playTrack: (videoId: string) => {
    set({ currentTrackId: videoId, isPlaying: true });
    get().openWindow("media");
  },

  togglePlayback: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  setVolume: (v: number) => {
    set({ volume: Math.max(0, Math.min(100, v)) });
  },

  setIsPlaying: (playing: boolean) => {
    set({ isPlaying: playing });
  },

  setPlaybackTime: (t: number) => {
    set({ playbackTime: t });
  },

  setYoutubePlayer: (p: any) => {
    set({ youtubePlayer: p });
  },

  setWorkspace: (n: number) => {
    set((state) => ({
      activeWorkspace: n,
      windows: state.windows.map((w) => ({ ...w, focused: false })),
      focusedWindowId: null,
      splitRatio: 0.5, // reset split on workspace switch
    }));
  },

  toggleTheme: () => {
    set((state) => ({
      theme: state.theme === "dark" ? "high-contrast" : "dark",
    }));
  },

  toggleAudio: () => {
    set((state) => ({ audioEnabled: !state.audioEnabled }));
  },

  toggleCommandPalette: () => {
    set((state) => ({
      commandPaletteOpen: !state.commandPaletteOpen,
      keybindSheetOpen: false,
      calendarOpen: false,
    }));
  },

  toggleKeybindSheet: () => {
    set((state) => ({
      keybindSheetOpen: !state.keybindSheetOpen,
      commandPaletteOpen: false,
      calendarOpen: false,
    }));
  },

  toggleCalendar: () => {
    set((state) => ({
      calendarOpen: !state.calendarOpen,
    }));
  },

  closeAllOverlays: () => {
    set({
      commandPaletteOpen: false,
      keybindSheetOpen: false,
      calendarOpen: false,
    });
  },
}));

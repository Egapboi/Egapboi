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
  },
];

export const useWmStore = create<WmState>((set) => ({
  windows: DEFAULT_WINDOWS,
  activeWorkspace: 1,
  focusedWindowId: "about",
  theme: "dark",
  audioEnabled: false,
  commandPaletteOpen: false,
  keybindSheetOpen: false,
  calendarOpen: false,
  nextZIndex: 3,
  splitRatio: 0.5,

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
      const visibleWindows = state.windows.filter(
        (w) => w.workspace === state.activeWorkspace && !w.minimized
      );
      const currentIndex = visibleWindows.findIndex(
        (w) => w.id === state.focusedWindowId
      );
      if (currentIndex === -1) return state;

      const targetIndex = currentIndex + direction;
      if (targetIndex < 0 || targetIndex >= visibleWindows.length) return state;

      const currentId = visibleWindows[currentIndex].id;
      const targetId = visibleWindows[targetIndex].id;

      // Swap positions in the main windows array
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
    set({ splitRatio: Math.max(0.2, Math.min(0.8, ratio)) });
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

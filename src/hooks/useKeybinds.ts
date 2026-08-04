"use client";

import { useEffect } from "react";
import { useWmStore } from "@/store/useWmStore";

export function useKeybinds() {
  const {
    focusedWindowId,
    commandPaletteOpen,
    keybindSheetOpen,
    closeWindow,
    minimizeWindow,
    cycleFocus,
    setWorkspace,
    toggleCommandPalette,
    toggleKeybindSheet,
    closeAllOverlays,
    unfocusAll,
    swapFocusedDirection,
    toggleFloating,
    toggleLayoutDirection,
  } = useWmStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Alt+Shift combos work always (except in inputs)
      if (e.altKey && e.shiftKey && !isInput) {
        switch (e.key.toLowerCase()) {
          case "q":
            e.preventDefault();
            if (focusedWindowId) closeWindow(focusedWindowId);
            return;
          case "k":
            e.preventDefault();
            toggleCommandPalette();
            return;
          case "arrowleft":
          case "h":
            e.preventDefault();
            swapFocusedDirection(-1);
            return;
          case "arrowright":
          case "l":
            e.preventDefault();
            swapFocusedDirection(1);
            return;
          case "f":
            e.preventDefault();
            if (focusedWindowId) toggleFloating(focusedWindowId);
            return;
          case "v":
            e.preventDefault();
            toggleLayoutDirection();
            return;
        }
      }

      // Escape always works
      if (e.key === "Escape") {
        if (commandPaletteOpen || keybindSheetOpen) {
          closeAllOverlays();
        } else {
          unfocusAll();
        }
        return;
      }

      // Don't process single-key shortcuts if overlay is open (except Escape above)
      // or if typing in an input
      if (isInput) return;

      // Command palette search input is special - let "/" open it
      if (commandPaletteOpen) return;

      switch (e.key) {
        case "q":
          e.preventDefault();
          if (focusedWindowId) closeWindow(focusedWindowId);
          break;
        case "m":
          e.preventDefault();
          if (focusedWindowId) minimizeWindow(focusedWindowId);
          break;
        case "Tab":
          e.preventDefault();
          cycleFocus();
          break;
        case "1":
          e.preventDefault();
          setWorkspace(1);
          break;
        case "2":
          e.preventDefault();
          setWorkspace(2);
          break;
        case "3":
          e.preventDefault();
          setWorkspace(3);
          break;
        case "?":
          e.preventDefault();
          toggleKeybindSheet();
          break;
        case "/":
          e.preventDefault();
          toggleCommandPalette();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    focusedWindowId,
    commandPaletteOpen,
    keybindSheetOpen,
    closeWindow,
    minimizeWindow,
    cycleFocus,
    setWorkspace,
    toggleCommandPalette,
    toggleKeybindSheet,
    closeAllOverlays,
    unfocusAll,
    swapFocusedDirection,
    toggleFloating,
    toggleLayoutDirection,
  ]);
}

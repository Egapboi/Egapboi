"use client";

import { useWmStore } from "@/store/useWmStore";
import { WindowShell } from "./WindowShell";
import { AboutWindow } from "../Windows/AboutWindow";
import { ProjectsWindow } from "../Windows/ProjectsWindow";
import { ContactWindow } from "../Windows/ContactWindow";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";

const componentMap: Record<string, React.ComponentType> = {
  about: AboutWindow,
  projects: ProjectsWindow,
  contact: ContactWindow,
};

export interface TileRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const TILE_GAP = 4;

/** Compute tiling rectangles based on split ratio */
function computeTiles(
  count: number,
  viewW: number,
  viewH: number,
  splitRatio: number
): TileRect[] {
  const g = TILE_GAP;
  if (count === 0) return [];
  if (count === 1) {
    return [{ x: g, y: g, width: viewW - g * 2, height: viewH - g * 2 }];
  }
  if (count === 2) {
    const leftW = (viewW - g * 3) * splitRatio;
    const rightW = viewW - g * 3 - leftW;
    return [
      { x: g, y: g, width: leftW, height: viewH - g * 2 },
      { x: g * 2 + leftW, y: g, width: rightW, height: viewH - g * 2 },
    ];
  }
  // 3+: master (left, splitRatio width), stack on right
  const masterW = (viewW - g * 3) * splitRatio;
  const stackW = viewW - g * 3 - masterW;
  const stackCount = count - 1;
  const stackH = (viewH - g * (stackCount + 1)) / stackCount;
  const tiles: TileRect[] = [
    { x: g, y: g, width: masterW, height: viewH - g * 2 },
  ];
  for (let i = 0; i < stackCount; i++) {
    tiles.push({
      x: g * 2 + masterW,
      y: g + i * (stackH + g),
      width: stackW,
      height: stackH,
    });
  }
  return tiles;
}

export function Desktop() {
  const windows = useWmStore((s) => s.windows);
  const activeWorkspace = useWmStore((s) => s.activeWorkspace);
  const unfocusAll = useWmStore((s) => s.unfocusAll);
  const splitRatio = useWmStore((s) => s.splitRatio);
  const setSplitRatio = useWmStore((s) => s.setSplitRatio);
  const swapWindows = useWmStore((s) => s.swapWindows);
  const focusWindow = useWmStore((s) => s.focusWindow);

  const [viewport, setViewport] = useState({ w: 1200, h: 700 });
  useEffect(() => {
    const update = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight - 36 });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const visibleWindows = windows.filter(
    (w) => w.workspace === activeWorkspace && !w.minimized
  );

  const tiles = computeTiles(
    visibleWindows.length,
    viewport.w,
    viewport.h,
    splitRatio
  );

  // ─── Divider drag state ───
  const [isDividerDragging, setIsDividerDragging] = useState(false);
  const dividerRef = useRef<{ startX: number; startRatio: number } | null>(null);

  const onDividerPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dividerRef.current = { startX: e.clientX, startRatio: splitRatio };
      setIsDividerDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [splitRatio]
  );

  const onDividerPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dividerRef.current) return;
      const dx = e.clientX - dividerRef.current.startX;
      const dRatio = dx / (viewport.w - TILE_GAP * 3);
      setSplitRatio(dividerRef.current.startRatio + dRatio);
    },
    [viewport.w, setSplitRatio]
  );

  const onDividerPointerUp = useCallback(() => {
    dividerRef.current = null;
    setIsDividerDragging(false);
  }, []);

  // ─── Window drag-to-swap ───
  const [dragState, setDragState] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  const onWindowDragStart = useCallback(
    (id: string, e: React.PointerEvent) => {
      if (visibleWindows.length < 2) return; // No swap if only 1 window
      focusWindow(id);
      const winIndex = visibleWindows.findIndex((w) => w.id === id);
      const tile = tiles[winIndex];
      if (!tile) return;

      setDragState({
        id,
        offsetX: e.clientX - tile.x,
        offsetY: e.clientY - tile.y,
        currentX: e.clientX,
        currentY: e.clientY,
      });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [visibleWindows, tiles, focusWindow]
  );

  const onWindowDragMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState) return;
      setDragState((prev) =>
        prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null
      );
    },
    [dragState]
  );

  const onWindowDragEnd = useCallback(() => {
    if (!dragState) return;

    // Find which tile the cursor is over
    const { currentX, currentY, id } = dragState;
    const adjustedY = currentY - 36; // account for status bar offset
    for (let i = 0; i < tiles.length; i++) {
      const t = tiles[i];
      if (
        currentX >= t.x &&
        currentX <= t.x + t.width &&
        adjustedY >= t.y &&
        adjustedY <= t.y + t.height
      ) {
        const targetWin = visibleWindows[i];
        if (targetWin && targetWin.id !== id) {
          swapWindows(id, targetWin.id);
        }
        break;
      }
    }

    setDragState(null);
  }, [dragState, tiles, visibleWindows, swapWindows]);

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      unfocusAll();
    }
  };

  // Compute divider position for visual display
  const showDivider = visibleWindows.length >= 2;
  const dividerX = showDivider
    ? TILE_GAP + (viewport.w - TILE_GAP * 3) * splitRatio + TILE_GAP * 0.5
    : 0;

  return (
    <div
      id="desktop-canvas"
      className="fixed inset-0 top-9 overflow-hidden bg-[var(--desktop-bg)]"
      onClick={handleDesktopClick}
      onPointerMove={onWindowDragMove}
      onPointerUp={onWindowDragEnd}
    >
      {/* Desktop wallpaper pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--text) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <AnimatePresence>
        {visibleWindows.map((win, index) => {
          const Content = componentMap[win.component];
          if (!Content) return null;
          const tile = tiles[index];
          const isDragging = dragState?.id === win.id;

          return (
            <WindowShell
              key={win.id}
              windowState={win}
              tile={tile}
              isDragActive={isDragging}
              onTitleDragStart={(e) => onWindowDragStart(win.id, e)}
            >
              <Content />
            </WindowShell>
          );
        })}
      </AnimatePresence>

      {/* Draggable divider between tiles */}
      {showDivider && (
        <div
          className={`absolute top-0 bottom-0 z-[100] cursor-col-resize flex items-center justify-center
            ${isDividerDragging ? "bg-[var(--accent)]/20" : "hover:bg-[var(--accent)]/10"}
            transition-colors`}
          style={{
            left: dividerX - 4,
            width: 8,
          }}
          onPointerDown={onDividerPointerDown}
          onPointerMove={onDividerPointerMove}
          onPointerUp={onDividerPointerUp}
        >
          <div
            className={`w-0.5 h-12 rounded-full transition-colors
              ${isDividerDragging ? "bg-[var(--accent)]" : "bg-[var(--border)] hover:bg-[var(--accent)]/60"}`}
          />
        </div>
      )}

      {/* Drag ghost indicator */}
      {dragState && (
        <div
          className="fixed pointer-events-none z-[9998] rounded-lg border-2 border-dashed border-[var(--accent)]/60 bg-[var(--accent)]/5"
          style={{
            left: dragState.currentX - dragState.offsetX,
            top: dragState.currentY - dragState.offsetY - 36,
            width: 200,
            height: 100,
          }}
        />
      )}
    </div>
  );
}

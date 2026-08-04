"use client";

import { useWmStore } from "@/store/useWmStore";
import { WindowShell } from "./WindowShell";
import { AboutWindow } from "../Windows/AboutWindow";
import { ProjectsWindow } from "../Windows/ProjectsWindow";
import { ContactWindow } from "../Windows/ContactWindow";
import { MusicWindow } from "../Windows/MusicWindow";
import { MediaWindow } from "../Windows/MediaWindow";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";

const componentMap: Record<string, React.ComponentType> = {
  about: AboutWindow,
  projects: ProjectsWindow,
  contact: ContactWindow,
  music: MusicWindow,
  media: MediaWindow,
};

export interface TileRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const TILE_GAP = 4;

/** Compute tiling rectangles based on split ratio and direction */
function computeTiles(
  count: number,
  viewW: number,
  viewH: number,
  splitRatio: number,
  direction: "horizontal" | "vertical"
): TileRect[] {
  const g = TILE_GAP;
  if (count === 0) return [];
  if (count === 1) {
    return [{ x: g, y: g, width: viewW - g * 2, height: viewH - g * 2 }];
  }
  if (count === 2) {
    if (direction === "horizontal") {
      const leftW = (viewW - g * 3) * splitRatio;
      const rightW = viewW - g * 3 - leftW;
      return [
        { x: g, y: g, width: leftW, height: viewH - g * 2 },
        { x: g * 2 + leftW, y: g, width: rightW, height: viewH - g * 2 },
      ];
    } else {
      const topH = (viewH - g * 3) * splitRatio;
      const bottomH = viewH - g * 3 - topH;
      return [
        { x: g, y: g, width: viewW - g * 2, height: topH },
        { x: g, y: g * 2 + topH, width: viewW - g * 2, height: bottomH },
      ];
    }
  }

  // 3+: master (splitRatio), stack on remaining space
  if (direction === "horizontal") {
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
  } else {
    const masterH = (viewH - g * 3) * splitRatio;
    const stackH = viewH - g * 3 - masterH;
    const stackCount = count - 1;
    const stackW = (viewW - g * (stackCount + 1)) / stackCount;
    const tiles: TileRect[] = [
      { x: g, y: g, width: viewW - g * 2, height: masterH },
    ];
    for (let i = 0; i < stackCount; i++) {
      tiles.push({
        x: g + i * (stackW + g),
        y: g * 2 + masterH,
        width: stackW,
        height: stackH,
      });
    }
    return tiles;
  }
}

export function Desktop() {
  const windows = useWmStore((s) => s.windows);
  const activeWorkspace = useWmStore((s) => s.activeWorkspace);
  const unfocusAll = useWmStore((s) => s.unfocusAll);
  const splitRatio = useWmStore((s) => s.splitRatio);
  const setSplitRatio = useWmStore((s) => s.setSplitRatio);
  const swapWindows = useWmStore((s) => s.swapWindows);
  const focusWindow = useWmStore((s) => s.focusWindow);
  const layoutDirection = useWmStore((s) => s.layoutDirection);
  
  // Playback state for YouTube
  const currentTrackId = useWmStore((s) => s.currentTrackId);
  const isPlaying = useWmStore((s) => s.isPlaying);
  const volume = useWmStore((s) => s.volume);
  const setIsPlaying = useWmStore((s) => s.setIsPlaying);
  const setPlaybackTime = useWmStore((s) => s.setPlaybackTime);
  const setYoutubePlayer = useWmStore((s) => s.setYoutubePlayer);
  const youtubePlayer = useWmStore((s) => s.youtubePlayer);
  const playTrack = useWmStore((s) => s.playTrack);
  const playerRef = useRef<YouTubePlayer | null>(null);

  // Sync YouTube player with store
  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) playerRef.current.playVideo();
      else playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  // Track time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && youtubePlayer) {
      interval = setInterval(async () => {
        try {
          const time = await youtubePlayer.getCurrentTime();
          if (time !== undefined) setPlaybackTime(time);
        } catch(e) {
          console.error("Seeker error", e);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, youtubePlayer, setPlaybackTime]);

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

  const tiledWindows = visibleWindows.filter((w) => !w.isFloating);
  const floatingWindows = visibleWindows.filter((w) => w.isFloating);

  const tiles = computeTiles(
    tiledWindows.length,
    viewport.w,
    viewport.h,
    splitRatio,
    layoutDirection
  );

  // ─── Divider drag state ───
  const [isDividerDragging, setIsDividerDragging] = useState(false);
  const dividerRef = useRef<{ startX: number; startY: number; startRatio: number } | null>(null);

  const onDividerPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dividerRef.current = { startX: e.clientX, startY: e.clientY, startRatio: splitRatio };
      setIsDividerDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [splitRatio]
  );

  const onDividerPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dividerRef.current) return;
      if (layoutDirection === "horizontal") {
        const dx = e.clientX - dividerRef.current.startX;
        const dRatio = dx / (viewport.w - TILE_GAP * 3);
        setSplitRatio(dividerRef.current.startRatio + dRatio);
      } else {
        const dy = e.clientY - dividerRef.current.startY;
        const dRatio = dy / (viewport.h - TILE_GAP * 3);
        setSplitRatio(dividerRef.current.startRatio + dRatio);
      }
    },
    [viewport.w, viewport.h, layoutDirection, setSplitRatio]
  );

  const onDividerPointerUp = useCallback(() => {
    dividerRef.current = null;
    setIsDividerDragging(false);
  }, []);

  // ─── Window drag-to-swap (Tiled only) ───
  const [dragState, setDragState] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  const onTiledWindowDragStart = useCallback(
    (id: string, e: React.PointerEvent) => {
      if (tiledWindows.length < 2) return;
      focusWindow(id);
      const winIndex = tiledWindows.findIndex((w) => w.id === id);
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
    [tiledWindows, tiles, focusWindow]
  );

  const onTiledWindowDragMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState) return;
      setDragState((prev) =>
        prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null
      );
    },
    [dragState]
  );

  const onTiledWindowDragEnd = useCallback(() => {
    if (!dragState) return;

    const { currentX, currentY, id } = dragState;
    const adjustedY = currentY - 36;
    for (let i = 0; i < tiles.length; i++) {
      const t = tiles[i];
      if (
        currentX >= t.x &&
        currentX <= t.x + t.width &&
        adjustedY >= t.y &&
        adjustedY <= t.y + t.height
      ) {
        const targetWin = tiledWindows[i];
        if (targetWin && targetWin.id !== id) {
          swapWindows(id, targetWin.id);
        }
        break;
      }
    }

    setDragState(null);
  }, [dragState, tiles, tiledWindows, swapWindows]);

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      unfocusAll();
    }
  };

  const showDivider = tiledWindows.length >= 2;
  const dividerX = showDivider && layoutDirection === "horizontal"
    ? TILE_GAP + (viewport.w - TILE_GAP * 3) * splitRatio + TILE_GAP * 0.5
    : 0;
  const dividerY = showDivider && layoutDirection === "vertical"
    ? TILE_GAP + (viewport.h - TILE_GAP * 3) * splitRatio + TILE_GAP * 0.5
    : 0;

  return (
    <div
      id="desktop-canvas"
      className="fixed inset-0 top-9 overflow-hidden bg-[var(--desktop-bg)]"
      onClick={handleDesktopClick}
      onPointerMove={onTiledWindowDragMove}
      onPointerUp={onTiledWindowDragEnd}
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--text) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Hidden YouTube Player */}
      <div className="hidden">
        {currentTrackId && (
          <YouTube
            videoId={currentTrackId}
            opts={{
              playerVars: {
                autoplay: 1,
                controls: 0,
              },
            }}
            onReady={(e: YouTubeEvent) => {
              playerRef.current = e.target;
              setYoutubePlayer(e.target);
              e.target.setVolume(volume);
              if (isPlaying) e.target.playVideo();
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnd={() => {
              // Automatically play next track? We'll leave it to the user or handle it by store.
              setIsPlaying(false);
            }}
          />
        )}
      </div>

      <AnimatePresence>
        {/* Render Tiled Windows */}
        {tiledWindows.map((win, index) => {
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
              dragState={isDragging ? dragState : undefined}
              onTitleDragStart={(e) => onTiledWindowDragStart(win.id, e)}
            >
              <Content />
            </WindowShell>
          );
        })}

        {/* Render Floating Windows */}
        {floatingWindows.map((win) => {
          const Content = componentMap[win.component];
          if (!Content) return null;
          return (
            <WindowShell key={win.id} windowState={win}>
              <Content />
            </WindowShell>
          );
        })}
      </AnimatePresence>

      {/* Draggable divider between tiles */}
      {showDivider && (
        <div
          className={`absolute z-[100] flex items-center justify-center transition-colors
            ${layoutDirection === "horizontal" ? "cursor-col-resize top-0 bottom-0" : "cursor-row-resize left-0 right-0"}
            ${isDividerDragging ? "bg-[var(--accent)]/20" : "hover:bg-[var(--accent)]/10"}`}
          style={
            layoutDirection === "horizontal"
              ? { left: dividerX - 4, width: 8 }
              : { top: dividerY - 4, height: 8 }
          }
          onPointerDown={onDividerPointerDown}
          onPointerMove={onDividerPointerMove}
          onPointerUp={onDividerPointerUp}
        >
          <div
            className={`rounded-full transition-colors
              ${layoutDirection === "horizontal" ? "w-0.5 h-12" : "h-0.5 w-12"}
              ${isDividerDragging ? "bg-[var(--accent)]" : "bg-[var(--border)] hover:bg-[var(--accent)]/60"}`}
          />
        </div>
      )}
    </div>
  );
}

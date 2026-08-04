"use client";

import { motion } from "framer-motion";
import { useWmStore, WindowState } from "@/store/useWmStore";
import { Minus, X, Terminal, Link, FolderOpen } from "lucide-react";
import { TileRect } from "./Desktop";
import { useRef, useState, useCallback } from "react";

const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  terminal: Terminal,
  link: Link,
  folder: FolderOpen,
};

interface WindowShellProps {
  windowState: WindowState;
  tile?: TileRect;
  isDragActive?: boolean;
  dragState?: { offsetX: number; offsetY: number; currentX: number; currentY: number };
  onTitleDragStart?: (e: React.PointerEvent) => void;
  children: React.ReactNode;
}

export function WindowShell({
  windowState,
  tile,
  isDragActive,
  dragState,
  onTitleDragStart,
  children,
}: WindowShellProps) {
  const { id, title, icon, zIndex, focused, isFloating, x, y, width, height } = windowState;
  const focusWindow = useWmStore((s) => s.focusWindow);
  const closeWindow = useWmStore((s) => s.closeWindow);
  const minimizeWindow = useWmStore((s) => s.minimizeWindow);
  const moveWindow = useWmStore((s) => s.moveWindow);
  const resizeWindow = useWmStore((s) => s.resizeWindow);

  const Icon = iconMap[icon] || Terminal;

  // ─── Floating Drag Handlers ───
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);
  const [isFloatingDrag, setIsFloatingDrag] = useState(false);

  const onFloatDragStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    focusWindow(id);
    dragRef.current = { startX: e.clientX, startY: e.clientY, winX: x, winY: y };
    setIsFloatingDrag(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [id, x, y, focusWindow]);

  const onFloatDragMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    moveWindow(id, dragRef.current.winX + dx, dragRef.current.winY + dy);
  }, [id, moveWindow]);

  const onFloatDragEnd = useCallback(() => {
    dragRef.current = null;
    setIsFloatingDrag(false);
  }, []);

  // ─── Floating Resize Handlers ───
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  const onResizeStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    focusWindow(id);
    resizeRef.current = { startX: e.clientX, startY: e.clientY, startW: width, startH: height };
    setIsResizing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [id, width, height, focusWindow]);

  const onResizeMove = useCallback((e: React.PointerEvent) => {
    if (!resizeRef.current) return;
    const dx = e.clientX - resizeRef.current.startX;
    const dy = e.clientY - resizeRef.current.startY;
    resizeWindow(id, resizeRef.current.startW + dx, resizeRef.current.startH + dy);
  }, [id, resizeWindow]);

  const onResizeEnd = useCallback(() => {
    resizeRef.current = null;
    setIsResizing(false);
  }, []);

  // Compute actual display dimensions based on state
  // Live dragging (tiled swap) overrides position with dragState
  let finalX, finalY, finalW, finalH;

  if (isFloating) {
    finalX = x;
    finalY = y;
    finalW = width;
    finalH = height;
  } else if (isDragActive && dragState) {
    finalX = dragState.currentX - dragState.offsetX;
    finalY = dragState.currentY - dragState.offsetY - 36;
    finalW = tile?.width ?? 800;
    finalH = tile?.height ?? 500;
  } else {
    finalX = tile?.x ?? 0;
    finalY = tile?.y ?? 0;
    finalW = tile?.width ?? 800;
    finalH = tile?.height ?? 500;
  }

  // Common pointer down routing
  const handleTitlePointerDown = (e: React.PointerEvent) => {
    if (isFloating) {
      onFloatDragStart(e);
    } else {
      onTitleDragStart?.(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{
        opacity: isDragActive ? 0.8 : 1, // slight transparency while swapping
        scale: isDragActive ? 1.02 : 1,  // slight pop effect while swapping
        x: finalX,
        y: finalY,
        width: finalW,
        height: finalH,
      }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{
        type: "spring",
        stiffness: isDragActive || isFloatingDrag || isResizing ? 1000 : 300,
        damping: isDragActive || isFloatingDrag || isResizing ? 40 : 28,
        opacity: { duration: 0.15 },
        scale: { duration: 0.15 },
      }}
      style={{ zIndex: isDragActive ? 9990 : zIndex, position: "absolute" }}
      className={`flex flex-col rounded-lg overflow-hidden shadow-2xl
        ${
          focused
            ? "ring-1 ring-[var(--accent)]/40 shadow-[var(--accent)]/10"
            : "ring-1 ring-[var(--border)]"
        }
        ${isFloatingDrag || isResizing || isDragActive ? "select-none" : ""}`}
      onClick={() => focusWindow(id)}
    >
      {/* Title Bar */}
      <div
        className={`flex items-center justify-between h-8 px-3 shrink-0 cursor-grab active:cursor-grabbing
          ${
            focused
              ? "bg-[var(--titlebar-active)]"
              : "bg-[var(--titlebar-inactive)]"
          }`}
        onPointerDown={handleTitlePointerDown}
        onPointerMove={isFloating ? onFloatDragMove : undefined}
        onPointerUp={isFloating ? onFloatDragEnd : undefined}
      >
        <div className="flex items-center gap-2 text-xs text-[var(--text)]">
          <Icon size={12} className="text-[var(--accent)]" />
          <span className="font-mono truncate">{title}{isFloating ? " [float]" : ""}</span>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            className="p-1 rounded hover:bg-white/10 text-[var(--text-dim)] hover:text-yellow-400 transition-colors cursor-pointer"
            title="Minimize to tray"
          >
            <Minus size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            className="p-1 rounded hover:bg-red-500/20 text-[var(--text-dim)] hover:text-red-400 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-auto bg-[var(--window-bg)] scrollbar-thin ${isDragActive ? 'pointer-events-none' : ''}`}>
        {children}
      </div>

      {/* Resize Handle (only for floating windows) */}
      {isFloating && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
          onPointerDown={onResizeStart}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeEnd}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-[var(--text-dim)] opacity-40">
            <path d="M14 14L8 14M14 14L14 8M14 14L6 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

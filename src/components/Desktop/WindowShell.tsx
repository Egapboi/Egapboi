"use client";

import { motion } from "framer-motion";
import { useWmStore, WindowState } from "@/store/useWmStore";
import { Minus, X, Terminal, Link, FolderOpen } from "lucide-react";
import { TileRect } from "./Desktop";

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
  onTitleDragStart?: (e: React.PointerEvent) => void;
  children: React.ReactNode;
}

export function WindowShell({
  windowState,
  tile,
  isDragActive,
  onTitleDragStart,
  children,
}: WindowShellProps) {
  const { id, title, icon, zIndex, focused } = windowState;
  const focusWindow = useWmStore((s) => s.focusWindow);
  const closeWindow = useWmStore((s) => s.closeWindow);
  const minimizeWindow = useWmStore((s) => s.minimizeWindow);

  const Icon = iconMap[icon] || Terminal;

  const tileX = tile?.x ?? 0;
  const tileY = tile?.y ?? 0;
  const tileW = tile?.width ?? 800;
  const tileH = tile?.height ?? 500;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{
        opacity: isDragActive ? 0.5 : 1,
        scale: 1,
        x: tileX,
        y: tileY,
        width: tileW,
        height: tileH,
      }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 28,
        opacity: { duration: 0.15 },
      }}
      style={{ zIndex: isDragActive ? 9990 : zIndex, position: "absolute" }}
      className={`flex flex-col rounded-lg overflow-hidden shadow-2xl
        ${
          focused
            ? "ring-1 ring-[var(--accent)]/40 shadow-[var(--accent)]/10"
            : "ring-1 ring-[var(--border)]"
        }`}
      onClick={() => focusWindow(id)}
    >
      {/* Title Bar — drag handle for swapping */}
      <div
        className={`flex items-center justify-between h-8 px-3 shrink-0 cursor-grab active:cursor-grabbing
          ${
            focused
              ? "bg-[var(--titlebar-active)]"
              : "bg-[var(--titlebar-inactive)]"
          }`}
        onPointerDown={(e) => {
          e.preventDefault();
          onTitleDragStart?.(e);
        }}
      >
        <div className="flex items-center gap-2 text-xs text-[var(--text)]">
          <Icon size={12} className="text-[var(--accent)]" />
          <span className="font-mono truncate">{title}</span>
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
      <div className="flex-1 overflow-auto bg-[var(--window-bg)] scrollbar-thin">
        {children}
      </div>
    </motion.div>
  );
}

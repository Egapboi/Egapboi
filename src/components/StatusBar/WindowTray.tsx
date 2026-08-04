"use client";

import { useWmStore } from "@/store/useWmStore";
import { Terminal, Link, FolderOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  terminal: Terminal,
  link: Link,
  folder: FolderOpen,
};

export function WindowTray() {
  const windows = useWmStore((s) => s.windows);
  const activeWorkspace = useWmStore((s) => s.activeWorkspace);
  const restoreWindow = useWmStore((s) => s.restoreWindow);

  const minimizedWindows = windows.filter(
    (w) => w.workspace === activeWorkspace && w.minimized
  );

  if (minimizedWindows.length === 0) return null;

  return (
    <>
      <div className="w-px h-4 bg-[var(--bar-divider)]" />
      <div className="flex items-center gap-1">
        <AnimatePresence>
          {minimizedWindows.map((win) => {
            const Icon = iconMap[win.icon] || Terminal;
            return (
              <motion.button
                key={win.id}
                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: "auto" }}
                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => restoreWindow(win.id)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md 
                           bg-[var(--accent)]/8 border border-[var(--accent)]/20
                           text-[var(--bar-text-dim)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/15
                           transition-colors cursor-pointer text-[10px]"
                title={`Restore ${win.title}`}
              >
                <Icon size={10} className="text-[var(--accent)]" />
                <span className="max-w-[60px] truncate">{win.title}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
}

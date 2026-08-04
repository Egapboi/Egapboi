"use client";

import { useWmStore } from "@/store/useWmStore";
import { Terminal, Link, FolderOpen, Monitor } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  terminal: Terminal,
  link: Link,
  folder: FolderOpen,
};

export function FocusedWindowIndicator() {
  const focusedWindowId = useWmStore((s) => s.focusedWindowId);
  const windows = useWmStore((s) => s.windows);

  const focusedWindow = windows.find((w) => w.id === focusedWindowId);
  const Icon = focusedWindow
    ? iconMap[focusedWindow.icon] || Monitor
    : Monitor;
  const title = focusedWindow ? focusedWindow.title : "Desktop";

  return (
    <div className="flex items-center gap-1.5 text-[var(--bar-text)]">
      <Icon size={12} className="text-[var(--accent)]" />
      <span className="max-w-[200px] truncate">{title}</span>
    </div>
  );
}

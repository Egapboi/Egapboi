"use client";

import { useWmStore } from "@/store/useWmStore";
import { workspaces } from "@/data/windowsConfig";
import { Home, Code, Music } from "lucide-react";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  home: Home,
  code: Code,
  music: Music,
};

export function WorkspaceSwitcher() {
  const activeWorkspace = useWmStore((s) => s.activeWorkspace);
  const setWorkspace = useWmStore((s) => s.setWorkspace);

  return (
    <div className="flex items-center gap-1">
      {workspaces.map((ws) => {
        const Icon = iconMap[ws.icon];
        const isActive = activeWorkspace === ws.id;

        return (
          <button
            key={ws.id}
            id={`workspace-${ws.id}`}
            onClick={() => setWorkspace(ws.id)}
            className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors duration-200 cursor-pointer
              ${
                isActive
                  ? "text-[var(--accent)] bg-[var(--accent)]/10"
                  : "text-[var(--bar-text-dim)] hover:text-[var(--bar-text)] hover:bg-white/5"
              }`}
          >
            {isActive && (
              <motion.div
                layoutId="workspace-indicator"
                className="absolute inset-0 rounded-md bg-[var(--accent)]/10 border border-[var(--accent)]/30"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {Icon && <Icon size={12} />}
              <span>
                {ws.id}: {ws.label}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

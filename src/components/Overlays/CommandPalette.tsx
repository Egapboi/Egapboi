"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWmStore } from "@/store/useWmStore";
import {
  Search,
  Terminal,
  FolderOpen,
  Link,
  Home,
  Code,
  Music,
  Moon,
  Sun,
  HelpCircle,
} from "lucide-react";

interface PaletteAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const commandPaletteOpen = useWmStore((s) => s.commandPaletteOpen);
  const toggleCommandPalette = useWmStore((s) => s.toggleCommandPalette);
  const openWindow = useWmStore((s) => s.openWindow);
  const setWorkspace = useWmStore((s) => s.setWorkspace);
  const toggleTheme = useWmStore((s) => s.toggleTheme);
  const toggleKeybindSheet = useWmStore((s) => s.toggleKeybindSheet);
  const theme = useWmStore((s) => s.theme);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: PaletteAction[] = useMemo(
    () => [
      {
        id: "open-about",
        label: "Open about.txt",
        description: "View personal info & bio",
        icon: Terminal,
        action: () => { openWindow("about"); toggleCommandPalette(); },
        category: "Windows",
      },
      {
        id: "open-projects",
        label: "Open projects/",
        description: "Browse project portfolio",
        icon: FolderOpen,
        action: () => { openWindow("projects"); toggleCommandPalette(); },
        category: "Windows",
      },
      {
        id: "open-contact",
        label: "Open links/",
        description: "Contact & social links",
        icon: Link,
        action: () => { openWindow("contact"); toggleCommandPalette(); },
        category: "Windows",
      },
      {
        id: "ws-home",
        label: "Workspace 1: home",
        description: "Switch to home workspace",
        icon: Home,
        action: () => { setWorkspace(1); toggleCommandPalette(); },
        category: "Workspaces",
      },
      {
        id: "ws-code",
        label: "Workspace 2: code",
        description: "Switch to code workspace",
        icon: Code,
        action: () => { setWorkspace(2); toggleCommandPalette(); },
        category: "Workspaces",
      },
      {
        id: "ws-media",
        label: "Workspace 3: media",
        description: "Switch to media workspace",
        icon: Music,
        action: () => { setWorkspace(3); toggleCommandPalette(); },
        category: "Workspaces",
      },
      {
        id: "toggle-theme",
        label: `Switch to ${theme === "dark" ? "High Contrast" : "Dark"} Mode`,
        description: "Toggle appearance theme",
        icon: theme === "dark" ? Sun : Moon,
        action: () => { toggleTheme(); toggleCommandPalette(); },
        category: "Settings",
      },
      {
        id: "show-keybinds",
        label: "Show Keyboard Shortcuts",
        description: "View all available keybinds",
        icon: HelpCircle,
        action: () => { toggleKeybindSheet(); toggleCommandPalette(); },
        category: "Help",
      },
    ],
    [theme, openWindow, setWorkspace, toggleTheme, toggleKeybindSheet, toggleCommandPalette]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return actions;
    const q = query.toLowerCase();
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [query, actions]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === "Escape") {
      toggleCommandPalette();
    }
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10001]"
            onClick={toggleCommandPalette}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[520px] max-w-[90vw] z-[10002]
                       bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
              <Search size={16} className="text-[var(--accent)] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command..."
                className="flex-1 bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] outline-none font-mono"
              />
              <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-[var(--text-dim)] font-mono">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-64 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-[var(--text-dim)]">
                  No results found
                </div>
              ) : (
                filtered.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer
                        ${
                          index === selectedIndex
                            ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                            : "text-[var(--text)] hover:bg-white/5"
                        }`}
                    >
                      <Icon
                        size={16}
                        className={
                          index === selectedIndex
                            ? "text-[var(--accent)]"
                            : "text-[var(--text-dim)]"
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-mono truncate">
                          {action.label}
                        </div>
                        <div className="text-xs text-[var(--text-dim)] truncate">
                          {action.description}
                        </div>
                      </div>
                      <span className="text-[10px] text-[var(--text-dim)] bg-white/5 px-1.5 py-0.5 rounded font-mono">
                        {action.category}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2 border-t border-[var(--border)] text-[10px] text-[var(--text-dim)]">
              <span>
                <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono">↑↓</kbd> navigate
              </span>
              <span>
                <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono">↵</kbd> select
              </span>
              <span>
                <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono">/</kbd> toggle
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import { Home, Code, Link, Terminal, FolderOpen, MessageCircle, Music } from "lucide-react";
import { AboutWindow } from "../Windows/AboutWindow";
import { ProjectsWindow } from "../Windows/ProjectsWindow";
import { ContactWindow } from "../Windows/ContactWindow";
import { MusicWindow } from "../Windows/MusicWindow";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  { id: "about", label: "About", icon: Terminal, component: AboutWindow },
  { id: "projects", label: "Projects", icon: FolderOpen, component: ProjectsWindow },
  { id: "contact", label: "Links", icon: MessageCircle, component: ContactWindow },
  { id: "music", label: "Music", icon: Music, component: MusicWindow },
];

export function MobileView() {
  const [activeTab, setActiveTab] = useState("about");
  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component || AboutWindow;

  return (
    <div className="flex flex-col h-screen bg-[var(--desktop-bg)]">
      {/* Mobile Header */}
      <header className="flex items-center justify-between h-12 px-4 bg-[var(--bar-bg)] border-b border-[var(--bar-border)]">
        <div className="flex items-center gap-2 font-mono text-sm text-[var(--accent)]">
          <Home size={14} />
          <span className="font-bold">SKS</span>
        </div>
        <div className="text-xs text-[var(--bar-text-dim)] font-mono">
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="flex items-center justify-around h-14 bg-[var(--bar-bg)] border-t border-[var(--bar-border)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors cursor-pointer
                ${
                  isActive
                    ? "text-[var(--accent)]"
                    : "text-[var(--bar-text-dim)]"
                }`}
            >
              <Icon size={18} />
              <span className="text-[10px] font-mono">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mobile-tab-indicator"
                  className="absolute bottom-1 w-6 h-0.5 rounded-full bg-[var(--accent)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

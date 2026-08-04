"use client";

import { useWmStore } from "@/store/useWmStore";
import { Volume2, VolumeX, Sun, Moon, HelpCircle } from "lucide-react";

export function QuickToggles() {
  const audioEnabled = useWmStore((s) => s.audioEnabled);
  const toggleAudio = useWmStore((s) => s.toggleAudio);
  const theme = useWmStore((s) => s.theme);
  const toggleTheme = useWmStore((s) => s.toggleTheme);
  const toggleKeybindSheet = useWmStore((s) => s.toggleKeybindSheet);

  return (
    <div className="flex items-center gap-1">
      {/* Audio Toggle */}
      <button
        id="audio-toggle"
        onClick={toggleAudio}
        className="p-1.5 rounded-md hover:bg-white/10 text-[var(--bar-text-dim)] hover:text-[var(--bar-text)] transition-colors cursor-pointer"
        title={audioEnabled ? "Mute" : "Unmute"}
      >
        {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
      </button>

      {/* Theme Toggle */}
      <button
        id="theme-toggle"
        onClick={toggleTheme}
        className="p-1.5 rounded-md hover:bg-white/10 text-[var(--bar-text-dim)] hover:text-[var(--bar-text)] transition-colors cursor-pointer"
        title={theme === "dark" ? "High Contrast" : "Dark Mode"}
      >
        {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
      </button>

      {/* Keybind Helper */}
      <button
        id="keybind-trigger"
        onClick={toggleKeybindSheet}
        className="flex items-center gap-1 px-2 py-1 rounded-full 
                   bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-bold
                   hover:bg-[var(--accent)]/20 transition-colors cursor-pointer"
      >
        <HelpCircle size={10} />
        <span>?</span>
      </button>
    </div>
  );
}

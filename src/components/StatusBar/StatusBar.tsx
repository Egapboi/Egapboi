"use client";

import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { FocusedWindowIndicator } from "./FocusedWindowIndicator";
import { Clock } from "./Clock";
import { SystemMeters } from "./SystemMeters";
import { QuickToggles } from "./QuickToggles";
import { MusicWidget } from "./MusicWidget";
import { WindowTray } from "./WindowTray";

export function StatusBar() {
  return (
    <header
      id="status-bar"
      className="fixed top-0 left-0 right-0 z-[9999] h-9 flex items-center justify-between px-3 
                 bg-[var(--bar-bg)] backdrop-blur-xl border-b border-[var(--bar-border)]
                 font-mono text-xs select-none"
    >
      {/* Left: Workspaces + Focused Window */}
      <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0 overflow-hidden">
        <WorkspaceSwitcher />
        <div className="hidden sm:block w-px h-4 bg-[var(--bar-divider)]" />
        <div className="hidden sm:flex"><FocusedWindowIndicator /></div>
        <WindowTray />
      </div>

      {/* Center: Clock */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
        <Clock />
      </div>

      {/* Right: System Meters + Toggles */}
      <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
        <MusicWidget />
        <div className="hidden lg:block w-px h-4 bg-[var(--bar-divider)]" />
        <div className="hidden lg:flex"><SystemMeters /></div>
        <div className="hidden sm:block w-px h-4 bg-[var(--bar-divider)]" />
        <QuickToggles />
      </div>
    </header>
  );
}

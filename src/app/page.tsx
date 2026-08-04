"use client";

import { useEffect, useState } from "react";
import { useWmStore } from "@/store/useWmStore";
import { useKeybinds } from "@/hooks/useKeybinds";
import { StatusBar } from "@/components/StatusBar/StatusBar";
import { Desktop } from "@/components/Desktop/Desktop";
import { CommandPalette } from "@/components/Overlays/CommandPalette";
import { KeybindSheet } from "@/components/Overlays/KeybindSheet";
import { MobileView } from "@/components/Mobile/MobileView";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

export default function Home() {
  const theme = useWmStore((s) => s.theme);
  const isMobile = useIsMobile();

  // Register global keybinds
  useKeybinds();

  if (isMobile) {
    return (
      <div data-theme={theme}>
        <MobileView />
      </div>
    );
  }

  return (
    <div data-theme={theme} className="h-screen w-screen overflow-hidden">
      <StatusBar />
      <Desktop />
      <CommandPalette />
      <KeybindSheet />
    </div>
  );
}

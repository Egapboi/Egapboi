"use client";

import { useState, useEffect } from "react";
import { MemoryStick } from "lucide-react";

function useMemoryUsage() {
  const [memMB, setMemMB] = useState<number | null>(null);

  useEffect(() => {
    function update() {
      // performance.memory is Chrome-only (non-standard)
      const perf = performance as Performance & {
        memory?: { usedJSHeapSize: number };
      };
      if (perf.memory) {
        setMemMB(Math.round(perf.memory.usedJSHeapSize / (1024 * 1024)));
      }
    }
    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  }, []);

  return memMB;
}

export function SystemMeters() {
  const memMB = useMemoryUsage();

  if (memMB === null) return null; // Not supported in this browser

  return (
    <div className="flex items-center gap-1.5 text-[var(--bar-text-dim)]">
      <MemoryStick size={12} className="text-[var(--accent)]" />
      <span className="tabular-nums">{memMB} MB</span>
    </div>
  );
}

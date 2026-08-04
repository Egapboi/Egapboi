"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useWmStore } from "@/store/useWmStore";
import { keybinds } from "@/data/windowsConfig";
import { Keyboard, X } from "lucide-react";

export function KeybindSheet() {
  const keybindSheetOpen = useWmStore((s) => s.keybindSheetOpen);
  const toggleKeybindSheet = useWmStore((s) => s.toggleKeybindSheet);

  return (
    <AnimatePresence>
      {keybindSheetOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10001]"
            onClick={toggleKeybindSheet}
          />

          {/* Sheet */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       w-[460px] max-w-[90vw] z-[10002]
                       bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 text-[var(--text)]">
                <Keyboard size={16} className="text-[var(--accent)]" />
                <span className="font-mono text-sm font-bold">
                  Keyboard Shortcuts
                </span>
              </div>
              <button
                onClick={toggleKeybindSheet}
                className="p-1 rounded-md hover:bg-white/10 text-[var(--text-dim)] hover:text-[var(--text)] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Keybinds Table */}
            <div className="px-5 py-3 max-h-[60vh] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-[var(--text-dim)]">
                    <th className="text-left py-2 font-normal">Key</th>
                    <th className="text-left py-2 font-normal">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {keybinds.map((kb) => (
                    <tr
                      key={kb.key}
                      className="border-t border-[var(--border)]/50 hover:bg-white/3"
                    >
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-1">
                          {kb.key.split(" / ").map((k, i) => (
                            <span key={i} className="flex items-center gap-1">
                              {i > 0 && (
                                <span className="text-[var(--text-dim)] text-xs mx-0.5">
                                  /
                                </span>
                              )}
                              {k.split("+").map((part, j) => (
                                <kbd
                                  key={j}
                                  className="inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 
                                             rounded bg-white/8 border border-white/10 
                                             text-xs font-mono text-[var(--accent)]"
                                >
                                  {part}
                                </kbd>
                              ))}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 text-sm text-[var(--text)]">
                        {kb.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 border-t border-[var(--border)] text-[10px] text-[var(--text-dim)] text-center">
              Press <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono">?</kbd> or{" "}
              <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono">Esc</kbd> to close
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

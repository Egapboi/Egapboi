"use client";

import { MessageCircle, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const LINKS = [
  {
    id: "github",
    label: "GitHub",
    value: "Egapboi",
    url: "https://github.com/Egapboi",
    icon: GithubIcon,
    color: "text-white",
  },
  {
    id: "discord",
    label: "Discord",
    value: "@egapboi",
    icon: MessageCircle,
    color: "text-indigo-400",
    copyable: true,
  },
];

export function ContactWindow() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (value: string, id: string) => {
    navigator.clipboard.writeText(value);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-5 font-mono text-sm h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5 text-xs text-[var(--text-dim)]">
        <span className="text-green-400">sunil@arch</span>
        <span>:</span>
        <span className="text-blue-400">~/links</span>
        <span>$</span>
        <span className="text-[var(--text)]">cat contacts.json</span>
      </div>

      {/* Links */}
      <div className="space-y-3">
        {LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <div
              key={link.id}
              className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]
                         hover:border-[var(--accent)]/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <div>
                  <div className="text-xs text-[var(--text-dim)]">
                    {link.label}
                  </div>
                  <div className="text-[var(--text)] font-medium">
                    {link.value}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {link.copyable && (
                  <button
                    onClick={() => handleCopy(link.value, link.id)}
                    className="p-1.5 rounded-md hover:bg-white/10 text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                    title="Copy to clipboard"
                  >
                    {copied === link.id ? (
                      <Check size={14} className="text-green-400" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                )}
                {link.url && (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] text-xs
                               hover:bg-[var(--accent)]/20 transition-colors"
                  >
                    Open <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* JSON-style footer */}
      <div className="mt-5 text-xs text-[var(--text-dim)] opacity-50">
        <span className="text-[var(--accent)]">{"}"}</span>
        <span> {"// EOF"}</span>
      </div>
    </div>
  );
}

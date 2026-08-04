"use client";

import { useState, useEffect } from "react";
import { MapPin, GraduationCap, Wrench } from "lucide-react";

const INFO = {
  name: "Sunil Kumar Sahu",
  role: "EnC Student @ VIT-AP | Fresher | Software & Hardware Enthusiast",
  location: "Odisha, India",
  bio: "My primary interests are in desktop application development and automation. I specialize in working with C++, Python, and the Qt framework to build software solutions. Additionally, I enjoy Linux ricing and have used Arch Linux as my primary operating system for years.",
  techStack: ["Python", "C++", "Qt", "React", "Linux", "Git"],
};

const ASCII_ART = `
 ╔══════════════════════════════════════╗
 ║  ███████╗██╗  ██╗███████╗           ║
 ║  ██╔════╝██║ ██╔╝██╔════╝           ║
 ║  ███████╗█████╔╝ ███████╗           ║
 ║  ╚════██║██╔═██╗ ╚════██║           ║
 ║  ███████║██║  ██╗███████║           ║
 ║  ╚══════╝╚═╝  ╚═╝╚══════╝           ║
 ╚══════════════════════════════════════╝`;

export function AboutWindow() {
  const [displayedBio, setDisplayedBio] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < INFO.bio.length) {
        setDisplayedBio(INFO.bio.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 18);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const blink = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  return (
    <div className="p-5 font-mono text-sm text-[var(--text)] space-y-4 h-full">
      {/* ASCII Art Header */}
      <pre className="text-[var(--accent)] text-[10px] leading-tight whitespace-pre overflow-hidden">
        {ASCII_ART}
      </pre>

      {/* Prompt Line */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-green-400">sunil@arch</span>
        <span className="text-[var(--text-dim)]">:</span>
        <span className="text-blue-400">~</span>
        <span className="text-[var(--text-dim)]">$</span>
        <span className="text-[var(--text)]">cat about.txt</span>
      </div>

      {/* Info Block */}
      <div className="space-y-3 pl-1">
        <h2 className="text-lg font-bold text-[var(--accent)]">{INFO.name}</h2>

        <div className="flex items-center gap-2 text-[var(--text-dim)]">
          <GraduationCap size={14} className="text-[var(--accent)]" />
          <span>{INFO.role}</span>
        </div>

        <div className="flex items-center gap-2 text-[var(--text-dim)]">
          <MapPin size={14} className="text-[var(--accent)]" />
          <span>{INFO.location}</span>
        </div>

        {/* Bio with typing effect */}
        <div className="border-l-2 border-[var(--accent)]/30 pl-3 py-1">
          <p className="text-[var(--text-dim)] leading-relaxed">
            {displayedBio}
            <span
              className={`inline-block w-[6px] h-[14px] ml-0.5 align-middle bg-[var(--accent)] ${
                showCursor ? "opacity-100" : "opacity-0"
              }`}
            />
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex items-start gap-2">
          <Wrench size={14} className="text-[var(--accent)] mt-0.5" />
          <div className="flex flex-wrap gap-1.5">
            {INFO.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded text-xs bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

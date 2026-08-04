"use client";

import { projects } from "@/data/projectsData";
import { ExternalLink, Star, GitBranch } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export function ProjectsWindow() {
  return (
    <div className="p-5 h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5 font-mono text-xs text-[var(--text-dim)]">
        <span className="text-green-400">sunil@arch</span>
        <span>:</span>
        <span className="text-blue-400">~/projects</span>
        <span>$</span>
        <span className="text-[var(--text)]">ls -la</span>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] 
                         hover:border-[var(--accent)]/40 hover:shadow-lg hover:shadow-[var(--accent)]/5
                         transition-all duration-300"
            >
              {/* Featured Image */}
              {project.image && (
                <div className="relative w-full aspect-square mb-3 rounded-md overflow-hidden bg-black/20">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
              )}

              {/* Title */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <GitBranch size={14} className="text-[var(--accent)]" />
                  <h3 className="font-mono text-sm font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {project.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  {project.featured && (
                    <Star
                      size={12}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  )}
                  <ExternalLink
                    size={12}
                    className="text-[var(--text-dim)] group-hover:text-[var(--accent)] transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[var(--text-dim)] mb-3 line-clamp-2 leading-relaxed">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-[var(--accent)]/8 text-[var(--accent)] border border-[var(--accent)]/15 font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

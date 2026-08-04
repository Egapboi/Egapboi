"use client";

import { useWmStore } from "@/store/useWmStore";
import { playlist } from "@/data/playlist";
import { Play, Pause, SkipForward, SkipBack, Music } from "lucide-react";

export function MusicWidget() {
  const isPlaying = useWmStore((s) => s.isPlaying);
  const currentTrackId = useWmStore((s) => s.currentTrackId);
  const togglePlayback = useWmStore((s) => s.togglePlayback);
  const playTrack = useWmStore((s) => s.playTrack);
  const openWindow = useWmStore((s) => s.openWindow);

  if (!currentTrackId) return null;

  const currentTrack = playlist.find((t) => t.videoId === currentTrackId);
  if (!currentTrack) return null;

  const playPrev = () => {
    const idx = playlist.findIndex((t) => t.videoId === currentTrackId);
    if (idx > 0) {
      playTrack(playlist[idx - 1].videoId);
    }
  };

  const playNext = () => {
    const idx = playlist.findIndex((t) => t.videoId === currentTrackId);
    if (idx !== -1 && idx + 1 < playlist.length) {
      playTrack(playlist[idx + 1].videoId);
    }
  };

  return (
    <div className="flex items-center gap-2 max-w-[150px] sm:max-w-[280px]">
      <button onClick={playPrev} className="hover:text-[#a6e3a1] transition-colors text-[var(--text-dim)]">
        <SkipBack size={14} />
      </button>
      <button onClick={togglePlayback} className="hover:text-[#a6e3a1] transition-colors">
        {isPlaying ? <Pause size={14} className="text-[#a6e3a1]" /> : <Play size={14} className="text-[#89b4fa]" />}
      </button>
      <button onClick={playNext} className="hover:text-[#a6e3a1] transition-colors text-[var(--text-dim)]">
        <SkipForward size={14} />
      </button>
      <div 
        className="truncate text-[11px] cursor-pointer hover:underline text-[#a6e3a1]"
        onClick={() => openWindow("music")}
        title={currentTrack.title}
      >
        <Music size={12} className="inline mr-1 opacity-50" />
        {currentTrack.title}
      </div>
    </div>
  );
}

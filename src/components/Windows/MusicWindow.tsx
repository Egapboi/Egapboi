"use client";

import { useState, useMemo } from "react";
import { useWmStore } from "@/store/useWmStore";
import { Search, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";

export function MusicWindow() {
  const [search, setSearch] = useState("");
  const currentTrackId = useWmStore((s) => s.currentTrackId);
  const playlist = useWmStore((s) => s.playlist);
  const isPlaying = useWmStore((s) => s.isPlaying);
  const volume = useWmStore((s) => s.volume);
  const playTrack = useWmStore((s) => s.playTrack);
  const togglePlayback = useWmStore((s) => s.togglePlayback);
  const setVolume = useWmStore((s) => s.setVolume);

  const filteredPlaylist = useMemo(() => {
    const q = search.toLowerCase();
    return playlist.filter(
      (t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
    );
  }, [search]);

  const currentTrack = playlist.find((t) => t.videoId === currentTrackId);

  const playNext = () => {
    if (!currentTrackId) return;
    const idx = playlist.findIndex((t) => t.videoId === currentTrackId);
    if (idx !== -1 && idx + 1 < playlist.length) {
      playTrack(playlist[idx + 1].videoId);
    }
  };

  const playPrev = () => {
    if (!currentTrackId) return;
    const idx = playlist.findIndex((t) => t.videoId === currentTrackId);
    if (idx > 0) {
      playTrack(playlist[idx - 1].videoId);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e2e] text-[#cdd6f4] font-mono text-sm overflow-hidden">
      {/* Header / Controls */}
      <div className="flex items-center justify-between p-3 border-b border-[#313244] shrink-0 bg-[#181825]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={playPrev} className="p-1.5 hover:text-[#89b4fa] transition-colors rounded hover:bg-white/5">
              <SkipBack size={16} />
            </button>
            <button onClick={togglePlayback} className="p-2 bg-[#89b4fa] text-[#11111b] rounded-full hover:bg-[#b4befe] transition-colors">
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
            <button onClick={playNext} className="p-1.5 hover:text-[#89b4fa] transition-colors rounded hover:bg-white/5">
              <SkipForward size={16} />
            </button>
          </div>
          
          <div className="flex flex-col max-w-[200px] truncate">
            {currentTrack ? (
              <>
                <span className="font-bold text-[#a6e3a1] truncate">{currentTrack.title}</span>
                <span className="text-xs text-[#a6adc8] truncate">{currentTrack.artist}</span>
              </>
            ) : (
              <span className="text-[#a6adc8]">No track selected</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Volume */}
          <div className="flex items-center gap-2 w-32 group hidden sm:flex">
            <button onClick={() => setVolume(volume === 0 ? 50 : 0)} className="text-[#a6adc8] group-hover:text-[#89b4fa] transition-colors">
              {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-full h-1 bg-[#313244] rounded-lg appearance-none cursor-pointer accent-[#89b4fa]"
            />
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6c7086]" />
            <input
              type="text"
              placeholder="Search / Filter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#313244] rounded text-xs border border-transparent focus:border-[#89b4fa] focus:outline-none transition-colors w-32 sm:w-48"
            />
          </div>
        </div>
      </div>

      {/* Tracklist headers */}
      <div className="flex items-center px-4 py-2 border-b border-[#313244] text-[#a6adc8] text-xs font-bold uppercase tracking-wider bg-[#1e1e2e] shrink-0 sticky top-0 z-10">
        <div className="w-8 text-center">#</div>
        <div className="flex-1">Title</div>
        <div className="w-48 hidden sm:block">Artist</div>
        <div className="w-16 text-right">Time</div>
      </div>

      {/* Tracklist */}
      <div className="flex-1 overflow-y-auto scrollbar-thin pb-4">
        {filteredPlaylist.map((track, idx) => {
          const isActive = currentTrackId === track.videoId;
          return (
            <div
              key={track.videoId}
              onClick={() => playTrack(track.videoId)}
              className={`flex items-center px-4 py-2 cursor-pointer transition-colors border-b border-[#313244]/30
                ${isActive ? "bg-[#313244]/50" : "hover:bg-[#313244]/20"}
              `}
            >
              <div className="w-8 text-center text-[#6c7086]">
                {isActive ? (
                  <span className="text-[#a6e3a1]">▶</span>
                ) : (
                  (idx + 1).toString().padStart(2, "0")
                )}
              </div>
              <div className={`flex-1 truncate pr-4 ${isActive ? "text-[#a6e3a1] font-bold" : ""}`}>
                {track.title}
              </div>
              <div className={`w-48 truncate hidden sm:block ${isActive ? "text-[#cdd6f4]" : "text-[#a6adc8]"}`}>
                {track.artist}
              </div>
              <div className="w-16 text-right text-[#6c7086]">
                {formatDuration(track.duration)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

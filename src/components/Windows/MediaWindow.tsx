"use client";

import { useWmStore } from "@/store/useWmStore";
import Image from "next/image";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";

export function MediaWindow() {
  const currentTrackId = useWmStore((s) => s.currentTrackId);
  const playlist = useWmStore((s) => s.playlist);
  const isPlaying = useWmStore((s) => s.isPlaying);
  const playbackTime = useWmStore((s) => s.playbackTime);
  const youtubePlayer = useWmStore((s) => s.youtubePlayer);
  const togglePlayback = useWmStore((s) => s.togglePlayback);
  const playTrack = useWmStore((s) => s.playTrack);

  const currentTrack = playlist.find((t) => t.videoId === currentTrackId);

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
    <div className="flex flex-col h-full bg-[#1e1e2e] text-[#cdd6f4] font-sans items-center justify-center p-4 relative overflow-hidden">
      {/* Background blur */}
      {currentTrackId && (
        <div 
          className="absolute inset-0 opacity-20 blur-3xl scale-110 pointer-events-none transition-all duration-1000"
          style={{
            backgroundImage: `url('https://img.youtube.com/vi/${currentTrackId}/maxresdefault.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {currentTrack ? (
        <div className="flex flex-col items-center w-full z-10 relative mt-4">
          {/* Scalable Album Art */}
          <div className="relative w-[70%] max-w-[400px] aspect-square mb-6 shadow-2xl rounded-lg overflow-hidden border border-[#313244] bg-[#11111b] group">
            <Image
              src={`https://img.youtube.com/vi/${currentTrackId}/maxresdefault.jpg`}
              alt="Thumbnail"
              fill
              className={`object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
              unoptimized
            />
            {/* Fake visualizer overlay */}
            {isPlaying && (
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#11111b] to-transparent flex items-end justify-center gap-1 pb-2 opacity-80">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-[#a6e3a1] rounded-t-sm animate-pulse"
                    style={{
                      height: `${Math.random() * 80 + 20}%`,
                      animationDuration: `${Math.random() * 0.5 + 0.3}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-[#a6e3a1] text-center mb-1 line-clamp-2 px-4">
            {currentTrack.title}
          </h2>
          <p className="text-[#a6adc8] text-sm text-center mb-8">
            {currentTrack.artist}
          </p>

          {/* Controls */}
          <div className="flex items-center gap-6 mb-6">
            <button onClick={playPrev} className="p-2 text-[#a6adc8] hover:text-[#a6e3a1] transition-colors rounded-full hover:bg-white/5">
              <SkipBack size={24} />
            </button>
            <button onClick={togglePlayback} className="p-4 bg-[#89b4fa] text-[#11111b] rounded-full hover:bg-[#b4befe] transition-colors shadow-lg shadow-[#89b4fa]/20">
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
            <button onClick={playNext} className="p-2 text-[#a6adc8] hover:text-[#a6e3a1] transition-colors rounded-full hover:bg-white/5">
              <SkipForward size={24} />
            </button>
          </div>

          {/* Seek Bar */}
          <div className="w-[80%] max-w-[400px] flex items-center gap-3 text-xs text-[#6c7086]">
            <span>{Math.floor(playbackTime / 60)}:{Math.floor(playbackTime % 60).toString().padStart(2, '0')}</span>
            <input
              type="range"
              min={0}
              max={currentTrack.duration || 100}
              value={playbackTime}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (youtubePlayer && typeof youtubePlayer.seekTo === 'function') {
                  youtubePlayer.seekTo(val, true);
                }
              }}
              className="w-full h-1 bg-[#313244] rounded-lg appearance-none cursor-pointer accent-[#89b4fa]"
            />
            <span>{Math.floor(currentTrack.duration / 60)}:{(currentTrack.duration % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-[#6c7086] gap-4">
          <div className="w-64 h-64 border-2 border-dashed border-[#313244] rounded-lg flex items-center justify-center">
            No Media Playing
          </div>
        </div>
      )}
    </div>
  );
}

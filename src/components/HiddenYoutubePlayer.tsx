"use client";

import { useWmStore } from "@/store/useWmStore";
import { useEffect, useRef } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";

export function HiddenYoutubePlayer() {
  const currentTrackId = useWmStore((s) => s.currentTrackId);
  const isPlaying = useWmStore((s) => s.isPlaying);
  const audioEnabled = useWmStore((s) => s.audioEnabled);
  const volume = useWmStore((s) => s.volume);
  const setIsPlaying = useWmStore((s) => s.setIsPlaying);
  const setPlaybackTime = useWmStore((s) => s.setPlaybackTime);
  const setYoutubePlayer = useWmStore((s) => s.setYoutubePlayer);
  const youtubePlayer = useWmStore((s) => s.youtubePlayer);
  const playerRef = useRef<YouTubePlayer | null>(null);

  // Sync YouTube player with store
  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) playerRef.current.playVideo();
      else playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (youtubePlayer) {
      youtubePlayer.setVolume(volume);
    }
  }, [volume, youtubePlayer]);

  useEffect(() => {
    if (youtubePlayer) {
      if (audioEnabled) {
        youtubePlayer.unMute();
      } else {
        youtubePlayer.mute();
      }
    }
  }, [audioEnabled, youtubePlayer]);

  // Track time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && youtubePlayer) {
      interval = setInterval(async () => {
        try {
          const time = await youtubePlayer.getCurrentTime();
          if (time !== undefined) setPlaybackTime(time);
        } catch(e) {
          console.error("Seeker error", e);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, youtubePlayer, setPlaybackTime]);

  return (
    <div className="hidden">
      {currentTrackId && (
        <YouTube
          videoId={currentTrackId}
          opts={{
            playerVars: {
              autoplay: 1,
              controls: 0,
            },
          }}
          onReady={(e: YouTubeEvent) => {
            playerRef.current = e.target;
            setYoutubePlayer(e.target);
            e.target.setVolume(volume);
            if (audioEnabled) e.target.unMute();
            else e.target.mute();
            if (isPlaying) e.target.playVideo();
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnd={() => {
            // Automatically play next track? We'll leave it to the user or handle it by store.
            setIsPlaying(false);
          }}
        />
      )}
    </div>
  );
}

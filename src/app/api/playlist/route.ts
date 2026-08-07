import { NextResponse } from 'next/server';
import { playlistInfo } from 'youtube-ext';

export async function GET() {
  try {
    const info = await playlistInfo('PL0q9IxIDgHDzG8XOy_MWO8TrynZB_dZNl');
    
    const tracks = info.videos.map((v, i) => ({
      id: i + 1,
      title: v.title,
      artist: v.channel?.name || "Unknown Artist",
      duration: v.duration?.lengthSec || 0,
      videoId: v.id
    }));
    
    return NextResponse.json({ playlist: tracks });
  } catch (error) {
    console.error("Failed to fetch playlist:", error);
    return NextResponse.json({ error: "Failed to fetch playlist" }, { status: 500 });
  }
}

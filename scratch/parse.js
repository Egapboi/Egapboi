const fs = require('fs');

function processFile() {
  const fileContent = fs.readFileSync('scratch/playlist.jsonl', 'utf16le');
  const lines = fileContent.split('\n');

  const tracks = [];
  let id = 1;

  for (let line of lines) {
    if (!line.trim()) continue;
    try {
      const data = JSON.parse(line.trim());
      tracks.push({
        id: id++,
        title: data.title,
        artist: data.uploader || 'Unknown Artist',
        duration: data.duration || 0,
        videoId: data.id
      });
    } catch (e) {
      // ignore parse errors
    }
  }

  const tsContent = `export interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number; // in seconds
  videoId: string;
}

export const playlist: Track[] = ${JSON.stringify(tracks, null, 2)};
`;

  fs.writeFileSync('src/data/playlist.ts', tsContent);
  console.log(`Saved ${tracks.length} tracks to src/data/playlist.ts`);
}

processFile();

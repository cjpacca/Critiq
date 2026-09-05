const fs = require('fs');
let code = fs.readFileSync('src/app/actions/music.ts', 'utf8');

code += `

export async function searchAlbums(query: string) {
  if (!query) return [];
  
  const res = await fetch(\`https://itunes.apple.com/search?term=\${encodeURIComponent(query)}&entity=album&limit=12\`);
  if (!res.ok) throw new Error("Failed to search Albums");
  const data = await res.json();
  
  return data.results.map((item: any) => ({
    id: item.collectionId.toString(),
    name: item.collectionName,
    artists: [{ name: item.artistName }],
    album: {
      name: item.collectionName,
      images: [{ url: item.artworkUrl100?.replace("100x100bb", "600x600bb") }],
      release_date: item.releaseDate
    }
  }));
}

export async function getAlbumTracks(collectionId: string) {
  const res = await fetch(\`https://itunes.apple.com/lookup?id=\${collectionId}&entity=song\`);
  if (!res.ok) throw new Error("Failed to fetch Album Tracks");
  const data = await res.json();
  
  const albumInfo = data.results.find((r: any) => r.wrapperType === "collection");
  const tracks = data.results.filter((r: any) => r.wrapperType === "track");
  
  if (!albumInfo) throw new Error("Album not found");

  return {
    id: albumInfo.collectionId.toString(),
    name: albumInfo.collectionName,
    artists: [{ name: albumInfo.artistName }],
    posterUrl: albumInfo.artworkUrl100?.replace("100x100bb", "600x600bb") || "",
    release_date: albumInfo.releaseDate,
    raw_metadata: albumInfo,
    tracks: tracks.map((t: any) => ({
      id: t.trackId.toString(),
      name: t.trackName,
      trackNumber: t.trackNumber,
      duration_ms: t.trackTimeMillis,
    })).sort((a: any, b: any) => a.trackNumber - b.trackNumber)
  };
}
`;
fs.writeFileSync('src/app/actions/music.ts', code);

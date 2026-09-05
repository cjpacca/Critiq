const fs = require('fs');
let code = fs.readFileSync('src/app/rate/[type]/[id]/page.tsx', 'utf8');

const trackBlock = `  } else if (type === 'track') {
    media = await getMusicTrackDetails(id);
    posterUrl = media.album?.images?.[0]?.url;
    title = media.name;
    year = media.album?.release_date?.substring(0, 4) || "";
    description = \`Canción de \${media.artists?.map((a:any) => a.name).join(', ')}. Pertenece al álbum "\${media.album?.name}".\`;
    if (media.album?.name) tags.push(media.album.name);
    if (media.duration_ms) tags.push(\`\${Math.floor(media.duration_ms / 60000)}:\${((media.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}\`);`;

const newAlbumBlock = `  } else if (type === 'album') {
    media = await getMusicTrackDetails(id); // For album, we can use the same lookup endpoint but let's see. Wait, getMusicTrackDetails looks up the ID. If it's a collectionId, iTunes returns it!
    // We actually need an album details fetcher. Wait! Let's just import getAlbumTracks.
    const { getAlbumTracks } = require("@/app/actions/music");
    media = await getAlbumTracks(id);
    posterUrl = media.posterUrl;
    title = media.name;
    year = media.release_date ? media.release_date.substring(0, 4) : "";
    description = \`Álbum de \${media.artists?.map((a:any) => a.name).join(', ')} con \${media.tracks.length} canciones.\`;
    tags.push(\`\${media.tracks.length} Pistas\`);`;

code = code.replace(trackBlock, newAlbumBlock + '\\n' + trackBlock);

const buttonTvBlock = `            {type === 'tv' && (
              <Link 
                href={\`/seasonchart/\${id}\`} 
                className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/50 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                Ver Episodios
              </Link>
            )}`;

const buttonAlbumBlock = `            {type === 'album' && (
              <Link 
                href={\`/trackgraph/\${id}\`} 
                className="w-full bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-500 border border-yellow-500/50 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold mt-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                Trackgraph (Canciones)
              </Link>
            )}`;

code = code.replace(buttonTvBlock, buttonTvBlock + '\\n' + buttonAlbumBlock);

// Fix type signature for page
code = code.replace(
  `{ type: 'movie'|'tv'|'track'|'book'|'game', id: string }`,
  `{ type: 'movie'|'tv'|'track'|'album'|'book'|'game', id: string }`
);

fs.writeFileSync('src/app/rate/[type]/[id]/page.tsx', code);

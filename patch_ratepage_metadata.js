const fs = require('fs');
let code = fs.readFileSync('src/app/rate/[type]/[id]/page.tsx', 'utf8');

const metadataBlock = `  let tags: string[] = [];

  if (type === 'track') {
    media = await getMusicTrackDetails(id);
    posterUrl = media.album?.images?.[0]?.url;
    title = media.name;
    year = media.album?.release_date?.substring(0, 4) || "";
    description = \`Canción de \${media.artists?.map((a:any) => a.name).join(', ')}. Pertenece al álbum "\${media.album?.name}".\`;
    if (media.album?.name) tags.push(media.album.name);
    if (media.duration_ms) tags.push(\`\${Math.floor(media.duration_ms / 60000)}:\${((media.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}\`);
  } else if (type === 'book') {
    media = await getBookDetails(id);
    posterUrl = media.posterUrl || "";
    title = media.title;
    year = ""; 
    description = media.description ? media.description.replace(/(<([^>]+)>)/gi, "").substring(0, 500) + "..." : \`Libro escrito por \${media.author}.\`;
    if (media.author && media.author !== "Autor desconocido") tags.push(media.author);
    if (media.raw_metadata?.subjects?.length > 0) tags.push(media.raw_metadata.subjects[0]);
  } else if (type === 'game') {
    media = await getGameDetails(id);
    posterUrl = media.posterUrl || "";
    title = media.title;
    year = media.year;
    description = media.description;
    if (media.raw_metadata?.developers?.length > 0) tags.push(\`Dev ID: \${media.raw_metadata.developers[0]}\`); // Basic info
  } else {
    media = await getMediaDetails(id, type);
    posterUrl = \`https://image.tmdb.org/t/p/w780\${media.poster_path}\`;
    title = media.title || media.name;
    year = new Date(media.release_date || media.first_air_date).getFullYear().toString();
    description = media.overview;
    if (media.genres) tags.push(...media.genres.slice(0, 2).map((g: any) => g.name));
    if (media.runtime) tags.push(\`\${media.runtime} min\`);
    if (media.number_of_seasons) tags.push(\`\${media.number_of_seasons} Temporadas\`);
  }`;

// Replace the original block with the new block
const originalBlock = `  if (type === 'track') {
    media = await getMusicTrackDetails(id);
    posterUrl = media.album?.images?.[0]?.url;
    title = media.name;
    year = media.album?.release_date?.substring(0, 4) || "";
    description = \`Canción de \${media.artists?.map((a:any) => a.name).join(', ')}. Pertenece al álbum "\${media.album?.name}".\`;
  } else if (type === 'book') {
    media = await getBookDetails(id);
    posterUrl = media.posterUrl || "";
    title = media.title;
    year = ""; 
    description = media.description ? media.description.replace(/(<([^>]+)>)/gi, "").substring(0, 500) + "..." : \`Libro escrito por \${media.author}.\`;
  } else if (type === 'game') {
    media = await getGameDetails(id);
    posterUrl = media.posterUrl || "";
    title = media.title;
    year = media.year;
    description = media.description;
  } else {
    media = await getMediaDetails(id, type);
    posterUrl = \`https://image.tmdb.org/t/p/w780\${media.poster_path}\`;
    title = media.title || media.name;
    year = new Date(media.release_date || media.first_air_date).getFullYear().toString();
    description = media.overview;
  }`;

code = code.replace(originalBlock, metadataBlock);

const newUIBlock = `            <p className="text-neutral-400 text-sm mb-4">
              {year} • {type === 'movie' ? 'Película' : type === 'tv' ? 'Serie' : type === 'book' ? 'Libro' : type === 'game' ? 'Videojuego' : 'Canción'}
            </p>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-neutral-300 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-neutral-300 text-sm leading-relaxed opacity-80">
              {description}
            </p>`;

code = code.replace(`            <p className="text-neutral-400 text-sm mb-4">
              {year} • {type === 'movie' ? 'Película' : type === 'tv' ? 'Serie' : type === 'book' ? 'Libro' : type === 'game' ? 'Videojuego' : 'Canción'}
            </p>
            <p className="text-neutral-300 text-sm leading-relaxed opacity-80">
              {description}
            </p>`, newUIBlock);

fs.writeFileSync('src/app/rate/[type]/[id]/page.tsx', code);

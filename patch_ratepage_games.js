const fs = require('fs');
let code = fs.readFileSync('src/app/rate/[type]/[id]/page.tsx', 'utf8');

code = code.replace(
  `import { getBookDetails } from "@/app/actions/books";`,
  `import { getBookDetails } from "@/app/actions/books";\nimport { getGameDetails } from "@/app/actions/games";`
);

code = code.replace(
  `{ type: 'movie'|'tv'|'track'|'book', id: string }`,
  `{ type: 'movie'|'tv'|'track'|'book'|'game', id: string }`
);

const gameLogic = `  } else if (type === 'game') {
    media = await getGameDetails(id);
    posterUrl = media.posterUrl || "";
    title = media.title;
    year = media.year;
    description = media.description;
  } else {`;

code = code.replace(`  } else {
    media = await getMediaDetails(id, type);`, gameLogic + `\n    media = await getMediaDetails(id, type);`);

code = code.replace(
  `{type === 'track' ? 'aspect-square' : type === 'book' ? 'aspect-[2/3]' : ''}`,
  `{type === 'track' ? 'aspect-square' : type === 'book' ? 'aspect-[2/3]' : type === 'game' ? 'aspect-[3/4]' : ''}`
);

code = code.replace(
  `{year} • {type === 'movie' ? 'Película' : type === 'tv' ? 'Serie' : type === 'book' ? 'Libro' : 'Canción'}`,
  `{year} • {type === 'movie' ? 'Película' : type === 'tv' ? 'Serie' : type === 'book' ? 'Libro' : type === 'game' ? 'Videojuego' : 'Canción'}`
);

fs.writeFileSync('src/app/rate/[type]/[id]/page.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('src/components/SearchUI.tsx', 'utf8');

code = code.replace(
  `import { searchBooks } from "@/app/actions/books";`,
  `import { searchBooks } from "@/app/actions/books";\nimport { searchGames } from "@/app/actions/games";`
);

code = code.replace(
  `const [filter, setFilter] = useState<'multi'|'movie'|'tv'|'track'|'book'>('multi');`,
  `const [filter, setFilter] = useState<'multi'|'movie'|'tv'|'track'|'book'|'game'>('multi');`
);

const gameLogic = `      } else if (filter === 'game') {
        const rawGames = await searchGames(query);
        formattedData = rawGames.map((item: any) => ({
          id: item.id,
          title: item.title,
          poster: item.poster,
          type: 'game'
        })).filter((x: any) => x.poster);
      } else {`;

code = code.replace(`      } else {
        const rawTMDB = await searchMedia(query, filter);`, gameLogic + `\n        const rawTMDB = await searchMedia(query, filter);`);

code = code.replace(
  `<option value="book" className="bg-neutral-900 text-orange-400">📚 Libros</option>`,
  `<option value="book" className="bg-neutral-900 text-orange-400">📚 Libros</option>\n          <option value="game" className="bg-neutral-900 text-green-500">🎮 Videojuegos</option>`
);

code = code.replace(
  `{item.type === 'movie' ? 'Película' : item.type === 'tv' ? 'Serie' : item.type === 'book' ? 'Libro' : 'Canción'}`,
  `{item.type === 'movie' ? 'Película' : item.type === 'tv' ? 'Serie' : item.type === 'book' ? 'Libro' : item.type === 'game' ? 'Videojuego' : 'Canción'}`
);

fs.writeFileSync('src/components/SearchUI.tsx', code);

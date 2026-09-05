const fs = require('fs');
let code = fs.readFileSync('src/components/SearchUI.tsx', 'utf8');

// Agregar searchAlbums a los imports
code = code.replace(
  `import { searchMusic } from "@/app/actions/music";`,
  `import { searchMusic, searchAlbums } from "@/app/actions/music";`
);

// Modificar el estado del filtro
code = code.replace(
  `const [filter, setFilter] = useState<'multi'|'movie'|'tv'|'track'|'book'|'game'>('multi');`,
  `const [filter, setFilter] = useState<'multi'|'movie'|'tv'|'track'|'book'|'game'|'album'>('multi');`
);

// Modificar la lógica de búsqueda
const trackLogic = `      } else if (filter === 'track') {
        const rawSpotify = await searchMusic(query);
        formattedData = rawSpotify.map((item: any) => ({
          id: item.id,
          title: item.name,
          poster: item.album?.images?.[0]?.url,
          type: 'track'
        }));`;

const albumLogic = `      } else if (filter === 'album') {
        const rawAlbums = await searchAlbums(query);
        formattedData = rawAlbums.map((item: any) => ({
          id: item.id,
          title: item.name,
          poster: item.album?.images?.[0]?.url,
          type: 'album'
        }));`;

code = code.replace(trackLogic, trackLogic + '\\n' + albumLogic);

// Agregar option a los filtros
const trackOption = `<option value="track" className="bg-neutral-900 text-yellow-500">🎵 Canciones</option>`;
const albumOption = `<option value="album" className="bg-neutral-900 text-yellow-400">💿 Álbumes</option>`;

code = code.replace(trackOption, trackOption + '\\n          ' + albumOption);

// Modificar label del tipo
code = code.replace(
  `{item.type === 'movie' ? 'Película' : item.type === 'tv' ? 'Serie' : item.type === 'book' ? 'Libro' : item.type === 'game' ? 'Videojuego' : 'Canción'}`,
  `{item.type === 'movie' ? 'Película' : item.type === 'tv' ? 'Serie' : item.type === 'book' ? 'Libro' : item.type === 'game' ? 'Videojuego' : item.type === 'album' ? 'Álbum' : 'Canción'}`
);

fs.writeFileSync('src/components/SearchUI.tsx', code);

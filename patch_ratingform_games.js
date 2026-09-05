const fs = require('fs');
let code = fs.readFileSync('src/components/RatingForm.tsx', 'utf8');

const gameCategories = `
const GAME_CATEGORIES = [
  { id: "jugabilidad", label: "Jugabilidad", max: 100 },
  { id: "adiccion", label: "Adicción", max: 100 },
  { id: "disenoNiveles", label: "Diseño Niveles", max: 75 },
  { id: "arte", label: "Arte visual", max: 75 },
  { id: "historia", label: "Historia", max: 75 },
  { id: "inmersion", label: "Inmersión", max: 75 },
  { id: "sonido", label: "Sonido/OST", max: 75 },
  { id: "impacto", label: "Impacto", max: 75 },
  { id: "dificultad", label: "Dificultad", max: 50 },
  { id: "rejugabilidad", label: "Rejugabilidad", max: 50 },
  { id: "rendimiento", label: "Rendimiento", max: 50 },
  { id: "personajes", label: "Personajes", max: 50 },
  { id: "detalle", label: "Detalle", max: 50 },
  { id: "mecanicas", label: "Mecánicas", max: 50 },
  { id: "ia", label: "IA", max: 50 },
];
`;

code = code.replace(`export function RatingForm`, gameCategories + `\nexport function RatingForm`);

code = code.replace(
  `{ type: 'movie'|'tv'|'track'|'book', mediaId: string, mediaData: any }`,
  `{ type: 'movie'|'tv'|'track'|'book'|'game', mediaId: string, mediaData: any }`
);

code = code.replace(
  `const categories = type === 'movie' ? MOVIE_CATEGORIES : type === 'tv' ? TV_CATEGORIES : type === 'track' ? MUSIC_CATEGORIES : BOOK_CATEGORIES;`,
  `const categories = type === 'movie' ? MOVIE_CATEGORIES : type === 'tv' ? TV_CATEGORIES : type === 'track' ? MUSIC_CATEGORIES : type === 'game' ? GAME_CATEGORIES : BOOK_CATEGORIES;`
);

code = code.replace(
  `const accentColor = type === 'movie' ? 'accent-purple-500' : type === 'tv' ? 'accent-blue-500' : type === 'track' ? 'accent-yellow-500' : 'accent-orange-500';`,
  `const accentColor = type === 'movie' ? 'accent-purple-500' : type === 'tv' ? 'accent-blue-500' : type === 'track' ? 'accent-yellow-500' : type === 'game' ? 'accent-green-500' : 'accent-orange-500';`
);

code = code.replace(
  `const buttonColor = type === 'movie' ? 'from-purple-600 to-pink-600' : type === 'tv' ? 'from-blue-600 to-cyan-600' : type === 'track' ? 'from-yellow-600 to-orange-600' : 'from-orange-600 to-amber-600';`,
  `const buttonColor = type === 'movie' ? 'from-purple-600 to-pink-600' : type === 'tv' ? 'from-blue-600 to-cyan-600' : type === 'track' ? 'from-yellow-600 to-orange-600' : type === 'game' ? 'from-green-600 to-emerald-600' : 'from-orange-600 to-amber-600';`
);

fs.writeFileSync('src/components/RatingForm.tsx', code);

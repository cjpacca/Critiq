const fs = require('fs');
let code = fs.readFileSync('src/app/actions/ratings.ts', 'utf8');

// 1. Signature
code = code.replace(
  `export async function saveRating(type: 'movie' | 'tv' | 'track' | 'book' | 'game', mediaData: any, scores: Record<string, number>) {`,
  `export async function saveRating(type: 'movie' | 'tv' | 'track' | 'book' | 'game', mediaData: any, scores: Record<string, number>, extendedStats: any = {}) {`
);

// 2. Global stats generator
const getGlobals = () => `
        status: extendedStats.status || "Completado",
        startDate: extendedStats.startDate ? new Date(extendedStats.startDate) : null,
        endDate: extendedStats.endDate ? new Date(extendedStats.endDate) : null,
        replayCount: extendedStats.replayCount ? parseInt(extendedStats.replayCount) : 0,`;

// 3. Replace for Movie (has ...scores, totalScore as any)
code = code.replace(
  `update: { ...scores, totalScore } as any,`,
  `update: { ...scores, totalScore, ${getGlobals()}
        bingeDays: extendedStats.bingeDays ? parseInt(extendedStats.bingeDays) : null,
        viewingMedium: extendedStats.viewingMedium || null,
        companions: extendedStats.companions || null
      } as any,`
);
code = code.replace(
  `create: { userId: user.id, movieId: movie.id, ...scores, totalScore } as any`,
  `create: { userId: user.id, movieId: movie.id, ...scores, totalScore, ${getGlobals()}
        bingeDays: extendedStats.bingeDays ? parseInt(extendedStats.bingeDays) : null,
        viewingMedium: extendedStats.viewingMedium || null,
        companions: extendedStats.companions || null
      } as any`
);

// 4. Replace for TV (has ...scores, totalScore as any)
code = code.replace(
  `update: { ...scores, totalScore } as any,`,
  `update: { ...scores, totalScore, ${getGlobals()}
        bingeDays: extendedStats.bingeDays ? parseInt(extendedStats.bingeDays) : null,
        viewingMedium: extendedStats.viewingMedium || null,
        dropPoint: extendedStats.dropPoint || null,
        companions: extendedStats.companions || null
      } as any,`
);
code = code.replace(
  `create: { userId: user.id, seriesId: series.id, ...scores, totalScore } as any`,
  `create: { userId: user.id, seriesId: series.id, ...scores, totalScore, ${getGlobals()}
        bingeDays: extendedStats.bingeDays ? parseInt(extendedStats.bingeDays) : null,
        viewingMedium: extendedStats.viewingMedium || null,
        dropPoint: extendedStats.dropPoint || null,
        companions: extendedStats.companions || null
      } as any`
);

// 5. Music (enumerated)
const injectEnumerated = (typeCode, extras) => {
  const replacement = `totalScore: totalScore || 0,\n${getGlobals()}\n        ${extras}\n      }`;
  return typeCode.replace(/totalScore: totalScore \|\| 0\n      \}/g, replacement);
};

// We will just do a general regex replacement, but only once per type, or we split the code into blocks.
// Let's just write the full file back, it's safer.

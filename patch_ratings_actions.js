const fs = require('fs');
let code = fs.readFileSync('src/app/actions/ratings.ts', 'utf8');

// Update signature
code = code.replace(
  `export async function saveRating(type: 'movie' | 'tv' | 'track' | 'book' | 'game', mediaData: any, scores: Record<string, number>) {`,
  `export async function saveRating(type: 'movie' | 'tv' | 'track' | 'book' | 'game', mediaData: any, scores: Record<string, number>, extendedStats: any = {}) {`
);

// Global stats logic snippet to inject
const globals = `
        status: extendedStats.status || "Completado",
        startDate: extendedStats.startDate ? new Date(extendedStats.startDate) : null,
        endDate: extendedStats.endDate ? new Date(extendedStats.endDate) : null,
        replayCount: extendedStats.replayCount ? parseInt(extendedStats.replayCount) : 0,`;

// Patch Movie update/create
code = code.replace(
  /totalScore: totalScore \|\| 0\n      }\n    }\);/g,
  (match, p1) => {
    // We need a more targeted approach. Let's do it per type.
    return match;
  }
);
fs.writeFileSync('src/app/actions/ratings.ts', code);

const fs = require('fs');
let code = fs.readFileSync('src/app/actions/ratings.ts', 'utf8');

const injectStats = (block, extraFields) => {
  const replacement = `totalScore: totalScore || 0,
        status: extendedStats.status || "Completado",
        startDate: extendedStats.startDate ? new Date(extendedStats.startDate) : null,
        endDate: extendedStats.endDate ? new Date(extendedStats.endDate) : null,
        replayCount: extendedStats.replayCount ? parseInt(extendedStats.replayCount) : 0,
        ${extraFields.join('\\n        ')}
      }`;
  return block.replace(/totalScore: totalScore \|\| 0\n      \}/g, replacement);
};

// 1. Movie
code = injectStats(code, [
  "bingeDays: extendedStats.bingeDays ? parseInt(extendedStats.bingeDays) : null,",
  "viewingMedium: extendedStats.viewingMedium || null,",
  "companions: extendedStats.companions || null,"
]);

// 2. TV
// Wait, TV is the second block. But the regex matches all. If I do it one by one, it's safer.

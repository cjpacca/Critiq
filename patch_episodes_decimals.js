const fs = require('fs');
let code = fs.readFileSync('src/app/actions/episodes.ts', 'utf8');

// The score parameter is a float, we multiply by 100 before saving
code = code.replace(
  `update: { score },`,
  `update: { score: Math.round(score * 100) },`
);

code = code.replace(
  `score
      }`,
  `score: Math.round(score * 100)
      }`
);

// When reading from DB, we divide by 100
code = code.replace(
  `return ratings;`,
  `return ratings.map(r => ({ ...r, score: r.score / 100 }));`
);

fs.writeFileSync('src/app/actions/episodes.ts', code);

const fs = require('fs');
let code = fs.readFileSync('src/app/actions/ratings.ts', 'utf8');
code = code.replace(
  `export async function saveRating(type: 'movie' | 'tv' | 'track', mediaData: any, scores: Record<string, number>) {`,
  `export async function saveRating(type: 'movie' | 'tv' | 'track', mediaData: any, scores: Record<string, number>) {
  try {`
);
code = code.replace(
  `  return { success: true };\n}`,
  `  return { success: true };\n  } catch (e) { console.error("SAVE ERROR:", e); throw new Error(e.message || String(e)); }\n}`
);
fs.writeFileSync('src/app/actions/ratings.ts', code);

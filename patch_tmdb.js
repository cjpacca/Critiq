const fs = require('fs');
let code = fs.readFileSync('src/app/actions/tmdb.ts', 'utf8');
code += `
export async function getTvSeasonDetails(id: string, seasonNumber: number) {
  const res = await fetch(
    \\\`\${BASE_URL}/tv/\${id}/season/\${seasonNumber}?api_key=\${TMDB_API_KEY}&language=es-ES\\\`
  );
  if (!res.ok) throw new Error("Failed to fetch season details");
  return await res.json();
}
`;
fs.writeFileSync('src/app/actions/tmdb.ts', code);

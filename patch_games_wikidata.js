const fs = require('fs');
let code = fs.readFileSync('src/app/actions/games.ts', 'utf8');

const wikidataFunction = `
async function enrichWithWikidata(title: string) {
  try {
    const searchRes = await fetch(\`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=\${encodeURIComponent(title)}&language=es&format=json\`);
    const searchData = await searchRes.json();
    if (!searchData.search || searchData.search.length === 0) return null;
    
    const entity = searchData.search.find((s: any) => s.description && (s.description.toLowerCase().includes("videojuego") || s.description.toLowerCase().includes("juego"))) || searchData.search[0];
    const entityId = entity.id;
    
    const entityRes = await fetch(\`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=\${entityId}&format=json&props=claims\`);
    const entityData = await entityRes.json();
    const claims = entityData.entities[entityId].claims;
    
    const devId = claims.P178?.[0]?.mainsnak?.datavalue?.value?.id;
    const genreId = claims.P136?.[0]?.mainsnak?.datavalue?.value?.id;
    
    let developer = null;
    let genre = null;
    
    const idsToFetch = [devId, genreId].filter(Boolean).join("|");
    if (idsToFetch) {
      const labelsRes = await fetch(\`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=\${idsToFetch}&format=json&props=labels\`);
      const labelsData = await labelsRes.json();
      
      if (devId && labelsData.entities[devId]) {
        developer = labelsData.entities[devId].labels.es?.value || labelsData.entities[devId].labels.en?.value;
      }
      if (genreId && labelsData.entities[genreId]) {
        genre = labelsData.entities[genreId].labels.es?.value || labelsData.entities[genreId].labels.en?.value;
      }
    }
    
    return { developer, genre };
  } catch(e) {
    return null;
  }
}
`;

code = code.replace(`export async function getGameDetails`, wikidataFunction + `\nexport async function getGameDetails`);

// Update getGameDetails
const getGameDetailsOriginal = `  return {
    id,
    title: item.names?.international || "Unknown",
    posterUrl: item.assets?.["cover-large"]?.uri || "",
    year: item.released ? item.released.toString() : "Unknown",
    description: \`Videojuego oficial lanzado en \${item.released}.\`,
    raw_metadata: item
  };`;

const getGameDetailsNew = `  const title = item.names?.international || "Unknown";
  const extra = await enrichWithWikidata(title);
  
  return {
    id,
    title,
    posterUrl: item.assets?.["cover-large"]?.uri || "",
    year: item.released ? item.released.toString() : "Unknown",
    description: \`Videojuego oficial lanzado en \${item.released}.\`,
    raw_metadata: {
      ...item,
      enriched_developer: extra?.developer || null,
      enriched_genre: extra?.genre || null
    }
  };`;

code = code.replace(getGameDetailsOriginal, getGameDetailsNew);

fs.writeFileSync('src/app/actions/games.ts', code);

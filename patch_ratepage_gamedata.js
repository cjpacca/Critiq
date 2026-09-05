const fs = require('fs');
let code = fs.readFileSync('src/app/rate/[type]/[id]/page.tsx', 'utf8');

const oldBlock = `  } else if (type === 'game') {
    media = await getGameDetails(id);
    posterUrl = media.posterUrl || "";
    title = media.title;
    year = media.year;
    description = media.description;
    if (media.raw_metadata?.developers?.length > 0) tags.push(\`Dev ID: \${media.raw_metadata.developers[0]}\`); // Basic info
  }`;

const newBlock = `  } else if (type === 'game') {
    media = await getGameDetails(id);
    posterUrl = media.posterUrl || "";
    title = media.title;
    year = media.year;
    description = media.description;
    if (media.raw_metadata?.enriched_developer) tags.push(\`Desarrollador: \${media.raw_metadata.enriched_developer}\`);
    if (media.raw_metadata?.enriched_genre) tags.push(\`Género: \${media.raw_metadata.enriched_genre}\`);
  }`;

code = code.replace(oldBlock, newBlock);
fs.writeFileSync('src/app/rate/[type]/[id]/page.tsx', code);

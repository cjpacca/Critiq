const fs = require('fs');
let code = fs.readFileSync('src/app/rate/[type]/[id]/page.tsx', 'utf8');

code = code.replace(
  `import { getMusicTrackDetails } from "@/app/actions/music";`,
  `import { getMusicTrackDetails, getAlbumTracks } from "@/app/actions/music";`
);

code = code.replace(
  `    const { getAlbumTracks } = require("@/app/actions/music");\n`,
  ``
);

fs.writeFileSync('src/app/rate/[type]/[id]/page.tsx', code);

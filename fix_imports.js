const fs = require('fs');
let code = fs.readFileSync('src/components/SearchUI.tsx', 'utf8');
if (!code.includes('import Link')) {
  code = code.replace('import { searchMedia', 'import Link from "next/link";\nimport { searchMedia');
}
fs.writeFileSync('src/components/SearchUI.tsx', code);

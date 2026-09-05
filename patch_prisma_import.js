const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');
code = code.replace(
  'import { prisma } from "@/lib/prisma";',
  'import { PrismaClient } from "@prisma/client";\nconst prisma = new PrismaClient();'
);
fs.writeFileSync('src/app/page.tsx', code);

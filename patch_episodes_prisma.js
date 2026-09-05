const fs = require('fs');
let code = fs.readFileSync('src/app/actions/episodes.ts', 'utf8');

const oldImport = \`import { prisma } from "@/lib/prisma";\`;
const newImport = \`import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;\`;

code = code.replace(oldImport, newImport);
fs.writeFileSync('src/app/actions/episodes.ts', code);

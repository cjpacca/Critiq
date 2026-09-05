const fs = require('fs');
let code = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Global Fields string
const globals = `  status       String?  @default("Completado")
  startDate    DateTime?
  endDate      DateTime?
  replayCount  Int?     @default(0)
`;

// Patch SeriesRating
code = code.replace(
  `  totalScore   Int`,
  `  totalScore   Int\n\n  // Fase 8: Metadatos Extendidos\n${globals}  bingeDays     Int?\n  viewingMedium String?\n  dropPoint     String?\n  companions    String?`
);

// Patch MovieRating
code = code.replace(
  `  satisfaccion Int      // Max 100\n  totalScore   Int`,
  `  satisfaccion Int      // Max 100\n  totalScore   Int\n\n  // Fase 8: Metadatos Extendidos\n${globals}  bingeDays     Int?\n  viewingMedium String?\n  companions    String?`
);

// Patch BookRating
code = code.replace(
  `  prosa        Int      // Max 100\n  totalScore   Int`,
  `  prosa        Int      // Max 100\n  totalScore   Int\n\n  // Fase 8: Metadatos Extendidos\n${globals}  totalPages    Int?\n  pagesPerDay   Float?\n  bookFormat    String?\n  language      String?`
);

// Patch MusicRating
code = code.replace(
  `  cohesion      Int      // Max 50\n  totalScore    Int`,
  `  cohesion      Int      // Max 50\n  totalScore    Int\n\n  // Fase 8: Metadatos Extendidos\n${globals}  playCount      Int?\n  bpm            Int?\n  valence        String?\n  discoveryMonth DateTime?`
);

// Patch GameRating
code = code.replace(
  `  bandaSonora        Int      // Max 75\n  totalScore         Int`,
  `  bandaSonora        Int      // Max 75\n  totalScore         Int\n\n  // Fase 8: Metadatos Extendidos\n${globals}  playtimeHours   Float?\n  completionTier  String?\n  platform        String?\n  difficulty      String?\n  achievementsPct Int?`
);

fs.writeFileSync('prisma/schema.prisma', code);

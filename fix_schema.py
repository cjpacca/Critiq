import re

with open("prisma/schema.prisma", "r") as f:
    schema = f.read()

# First, remove any lines added by the failed patch
schema = re.sub(r'  // Fase 8: Metadatos Extendidos\n.*?(?=  review\s+String)', '', schema, flags=re.DOTALL)

def inject(model_name, extras):
    global schema
    pattern = r'(model ' + model_name + r' \{.*?\n)(\s+totalScore\s+Int\s*\n)'
    
    globals_str = """
  // Fase 8: Metadatos Extendidos
  status       String?  @default("Completado")
  startDate    DateTime?
  endDate      DateTime?
  replayCount  Int?     @default(0)
"""
    
    replacement = r'\g<1>\g<2>' + globals_str + extras + '\n'
    schema = re.sub(pattern, replacement, schema, flags=re.DOTALL)

inject('SeriesRating', """  bingeDays     Int?
  viewingMedium String?
  dropPoint     String?
  companions    String?""")

inject('MovieRating', """  bingeDays     Int?
  viewingMedium String?
  companions    String?""")

inject('BookRating', """  totalPages    Int?
  pagesPerDay   Float?
  bookFormat    String?
  language      String?""")

inject('MusicRating', """  playCount      Int?
  bpm            Int?
  valence        String?
  discoveryMonth DateTime?""")

inject('GameRating', """  playtimeHours   Float?
  completionTier  String?
  platform        String?
  difficulty_meta String?
  achievementsPct Int?""")

with open("prisma/schema.prisma", "w") as f:
    f.write(schema)

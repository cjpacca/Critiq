const fs = require('fs');
let code = fs.readFileSync('prisma/schema.prisma', 'utf8');

const musicModelEnd = \`  ratings      MusicRating[]
}\`;
const musicModelNew = \`  ratings      MusicRating[]
  trackRatings AlbumTrackRating[]
}\`;
code = code.replace(musicModelEnd, musicModelNew);

const newModel = \`

model AlbumTrackRating {
  id           String   @id @default(uuid())
  userId       String
  albumId      String
  trackNum     Int
  score        Int      
  review       String?  @db.Text
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  album        Music    @relation(fields: [albumId], references: [id], onDelete: Cascade)

  @@unique([userId, albumId, trackNum])
}
\`;

code = code + newModel;
fs.writeFileSync('prisma/schema.prisma', code);

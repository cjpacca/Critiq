import re

with open("prisma/schema.prisma", "r") as f:
    schema = f.read()

# Update User model to support NextAuth and Friends
old_user = """model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String   @unique
  createdAt DateTime @default(now())
  
  movieRatings  MovieRating[]
  seriesRatings SeriesRating[]
  gameRatings   GameRating[]
  bookRatings   BookRating[]
  musicRatings  MusicRating[]
}"""

new_user = """// NextAuth Models
model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Friendship {
  id        String   @id @default(uuid())
  userId    String
  friendId  String
  createdAt DateTime @default(now())

  user      User     @relation("UserFriendships", fields: [userId], references: [id], onDelete: Cascade)
  friend    User     @relation("FriendUser", fields: [friendId], references: [id], onDelete: Cascade)

  @@unique([userId, friendId])
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  username      String?   @unique
  createdAt     DateTime  @default(now())
  
  accounts      Account[]
  sessions      Session[]
  
  movieRatings  MovieRating[]
  seriesRatings SeriesRating[]
  gameRatings   GameRating[]
  bookRatings   BookRating[]
  musicRatings  MusicRating[]

  // Amistades (Direccionales, se crearán 2 registros para mutuo)
  friendships   Friendship[] @relation("UserFriendships")
  friendOf      Friendship[] @relation("FriendUser")
}"""

schema = schema.replace(old_user, new_user)

with open("prisma/schema.prisma", "w") as f:
    f.write(schema)

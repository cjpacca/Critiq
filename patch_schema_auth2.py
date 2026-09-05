import re

with open("prisma/schema.prisma", "r") as f:
    schema = f.read()

# Add NextAuth models if they don't exist
if "model Account" not in schema:
    models = """
// NextAuth Models
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
"""
    schema += models

# Update User model using Regex to inject NextAuth fields and friendship
if "accounts      Account[]" not in schema:
    # We want to replace the top part of User model to include the new fields
    # First, let's remove email, username to avoid duplicates, then replace the whole block carefully.
    
    # Let's just find "model User {" and add the fields right inside.
    # Actually, we need to change id to cuid() maybe? No, uuid() is fine for NextAuth if adapter supports it.
    
    # Just inject the fields before the relations
    schema = schema.replace(
        "model User {\n  id        String   @id @default(uuid())\n  email     String   @unique",
        "model User {\n  id        String   @id @default(uuid())\n  name          String?\n  emailVerified DateTime?\n  image         String?\n  email     String?   @unique"
    )
    
    # Inject relations at the end of User model
    schema = schema.replace(
        "albumRatings   AlbumTrackRating[]\n}",
        "albumRatings   AlbumTrackRating[]\n  accounts      Account[]\n  sessions      Session[]\n  friendships   Friendship[] @relation(\"UserFriendships\")\n  friendOf      Friendship[] @relation(\"FriendUser\")\n}"
    )

with open("prisma/schema.prisma", "w") as f:
    f.write(schema)

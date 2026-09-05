import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function test() {
  try {
    let user = await prisma.user.findFirst();
    if (!user) user = await prisma.user.create({ data: { email: "usuario@critiq.com", username: "CritiqAdmin" } });

    const music = await prisma.music.upsert({
      where: { spotifyId: "12345" },
      update: {},
      create: {
        spotifyId: "12345",
        title: "I Wonder",
        type: 'track',
        artist: "Kanye West",
        posterUrl: "https://example.com/img.jpg",
        releaseDate: new Date("2007-09-11"),
        raw_metadata: {}
      }
    });

    await prisma.musicRating.upsert({
      where: { userId_musicId: { userId: user.id, musicId: music.id } },
      update: { impactoEmocional: 200, replay: 200, melodia: 200, letra: 150, vocesInstrumental: 100, originalidad: 100, totalScore: 950 },
      create: { userId: user.id, musicId: music.id, impactoEmocional: 200, replay: 200, melodia: 200, letra: 150, vocesInstrumental: 100, originalidad: 100, totalScore: 950 }
    });
    console.log("Success!");
  } catch (e) {
    console.error("Prisma Error:", e);
  }
}
test();

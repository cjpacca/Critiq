const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get main user
  const mainUser = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
  if (!mainUser) {
    console.log("No main user found. Rate something first.");
    return;
  }

  // Create second user
  let secondUser = await prisma.user.findUnique({ where: { username: "Cinefilo99" } });
  if (!secondUser) {
    secondUser = await prisma.user.create({
      data: { email: "cinefilo@critiq.com", username: "Cinefilo99" }
    });
    console.log("Created second user.");
  }

  // Find some movies rated by main user to create overlaps
  const movies = await prisma.movieRating.findMany({ where: { userId: mainUser.id } });
  for (const m of movies) {
    // Generate a similar but slightly different score (± 150 points)
    let variance = Math.floor(Math.random() * 300) - 150;
    let newScore = Math.min(1000, Math.max(0, m.totalScore + variance));
    
    await prisma.movieRating.upsert({
      where: { userId_movieId: { userId: secondUser.id, movieId: m.movieId } },
      update: {},
      create: {
        userId: secondUser.id,
        movieId: m.movieId,
        cinematografia: 80,
        actuacion: 80,
        guion: 80,
        direccion: 80,
        bandaSonora: 80,
        efectosVisuales: 80,
        ritmo: 80,
        impactoEmocional: 80,
        originalidad: 80,
        disenoProduccion: 80,
        totalScore: newScore,
        status: "Completado"
      }
    });
  }

  // Same for games
  const games = await prisma.gameRating.findMany({ where: { userId: mainUser.id } });
  for (const g of games) {
    let variance = Math.floor(Math.random() * 300) - 150;
    let newScore = Math.min(1000, Math.max(0, g.totalScore + variance));
    
    await prisma.gameRating.upsert({
      where: { userId_gameId: { userId: secondUser.id, gameId: g.gameId } },
      update: {},
      create: {
        userId: secondUser.id,
        gameId: g.gameId,
        jugabilidad: 40, adiccion: 40, disenoNiveles: 40, arteEstetica: 40,
        historia: 40, inmersion: 40, sonido: 40, impacto: 40, dificultad: 40,
        rejugabilidad: 40, rendimiento: 40, conexionPersonajes: 40, detalle: 40,
        mecanicas: 40, ia: 40,
        totalScore: newScore,
        status: "Completado",
        playtimeHours: 20
      }
    });
  }

  console.log("Seeding complete. Cinefilo99 has overlap ratings.");
}

main().catch(console.error).finally(() => prisma.$disconnect());

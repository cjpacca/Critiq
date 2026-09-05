const fs = require('fs');
let code = fs.readFileSync('src/app/actions/ratings.ts', 'utf8');

code = code.replace(
  `type: 'movie' | 'tv' | 'track' | 'book', mediaData: any`,
  `type: 'movie' | 'tv' | 'track' | 'book' | 'game', mediaData: any`
);

const gameLogic = `  } else if (type === 'game') {
    const game = await prisma.game.upsert({
      where: { rawgId: String(mediaData.id) },
      update: {},
      create: {
        rawgId: String(mediaData.id),
        title: mediaData.title || "Unknown Game",
        posterUrl: mediaData.posterUrl || "",
        releaseDate: null,
        raw_metadata: mediaData.raw_metadata || {}
      }
    });

    await prisma.gameRating.upsert({
      where: { userId_gameId: { userId: user.id, gameId: game.id } },
      update: {
        jugabilidad: scores.jugabilidad || 0,
        adiccion: scores.adiccion || 0,
        diseno: scores.disenoNiveles || 0, // mapeando disenoNiveles a diseno en db si es que existe... espera, revisemos el schema.
        arte: scores.arte || 0,
        historia: scores.historia || 0,
        inmersion: scores.inmersion || 0,
        sonido: scores.sonido || 0,
        impacto: scores.impacto || 0,
        dificultad: scores.dificultad || 0,
        rejugabilidad: scores.rejugabilidad || 0,
        rendimiento: scores.rendimiento || 0,
        personajes: scores.personajes || 0,
        detalle: scores.detalle || 0,
        mecanicas: scores.mecanicas || 0,
        ia: scores.ia || 0,
        totalScore: totalScore || 0
      },
      create: {
        userId: user.id,
        gameId: game.id,
        jugabilidad: scores.jugabilidad || 0,
        adiccion: scores.adiccion || 0,
        diseno: scores.disenoNiveles || 0,
        arte: scores.arte || 0,
        historia: scores.historia || 0,
        inmersion: scores.inmersion || 0,
        sonido: scores.sonido || 0,
        impacto: scores.impacto || 0,
        dificultad: scores.dificultad || 0,
        rejugabilidad: scores.rejugabilidad || 0,
        rendimiento: scores.rendimiento || 0,
        personajes: scores.personajes || 0,
        detalle: scores.detalle || 0,
        mecanicas: scores.mecanicas || 0,
        ia: scores.ia || 0,
        totalScore: totalScore || 0
      }
    });
`;

code = code.replace(`  return { success: true };`, gameLogic + `\n  return { success: true };`);

fs.writeFileSync('src/app/actions/ratings.ts', code);

const fs = require('fs');

let code = `
"use server";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function saveRating(type: 'movie' | 'tv' | 'track' | 'book' | 'game', mediaData: any, scores: Record<string, number>, extendedStats: any = {}) {
  try {
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: "usuario@critiq.com", username: "CritiqAdmin" }
      });
    }

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    const globals = {
      status: extendedStats.status || "Completado",
      startDate: extendedStats.startDate ? new Date(extendedStats.startDate) : null,
      endDate: extendedStats.endDate ? new Date(extendedStats.endDate) : null,
      replayCount: extendedStats.replayCount ? parseInt(extendedStats.replayCount) : 0,
    };

    if (type === 'movie') {
      const movie = await prisma.movie.upsert({
        where: { tmdbId: mediaData.id },
        update: {},
        create: {
          tmdbId: mediaData.id,
          title: mediaData.title,
          posterUrl: mediaData.poster_path,
          releaseDate: mediaData.release_date ? new Date(mediaData.release_date) : null,
          raw_metadata: mediaData
        }
      });

      await prisma.movieRating.upsert({
        where: { userId_movieId: { userId: user.id, movieId: movie.id } },
        update: { 
          ...scores, 
          totalScore, 
          ...globals,
          bingeDays: extendedStats.bingeDays ? parseInt(extendedStats.bingeDays) : null,
          viewingMedium: extendedStats.viewingMedium || null,
          companions: extendedStats.companions || null
        } as any,
        create: { 
          userId: user.id, 
          movieId: movie.id, 
          ...scores, 
          totalScore, 
          ...globals,
          bingeDays: extendedStats.bingeDays ? parseInt(extendedStats.bingeDays) : null,
          viewingMedium: extendedStats.viewingMedium || null,
          companions: extendedStats.companions || null
        } as any
      });

    } else if (type === 'tv') {
      const series = await prisma.series.upsert({
        where: { tmdbId: mediaData.id },
        update: {},
        create: {
          tmdbId: mediaData.id,
          title: mediaData.name,
          posterUrl: mediaData.poster_path,
          releaseDate: mediaData.first_air_date ? new Date(mediaData.first_air_date) : null,
          raw_metadata: mediaData
        }
      });

      await prisma.seriesRating.upsert({
        where: { userId_seriesId: { userId: user.id, seriesId: series.id } },
        update: { 
          ...scores, 
          totalScore, 
          ...globals,
          bingeDays: extendedStats.bingeDays ? parseInt(extendedStats.bingeDays) : null,
          viewingMedium: extendedStats.viewingMedium || null,
          dropPoint: extendedStats.dropPoint || null,
          companions: extendedStats.companions || null
        } as any,
        create: { 
          userId: user.id, 
          seriesId: series.id, 
          ...scores, 
          totalScore, 
          ...globals,
          bingeDays: extendedStats.bingeDays ? parseInt(extendedStats.bingeDays) : null,
          viewingMedium: extendedStats.viewingMedium || null,
          dropPoint: extendedStats.dropPoint || null,
          companions: extendedStats.companions || null
        } as any
      });

    } else if (type === 'track') {
      let releaseDateParsed: Date | null = null;
      try {
        if (mediaData.album?.release_date) {
          releaseDateParsed = new Date(mediaData.album.release_date.substring(0, 10));
        }
      } catch (e) {}

      const music = await prisma.music.upsert({
        where: { spotifyId: String(mediaData.id) },
        update: {},
        create: {
          spotifyId: String(mediaData.id),
          title: mediaData.name || "Unknown Track",
          type: 'track',
          artist: mediaData.artists?.[0]?.name || "Unknown Artist",
          posterUrl: mediaData.album?.images?.[0]?.url || "",
          releaseDate: releaseDateParsed,
          raw_metadata: mediaData
        }
      });

      const trackPayload = {
        impactoEmocional: scores.impactoEmocional || 0,
        replay: scores.replay || 0,
        melodia: scores.melodia || 0,
        letra: scores.letra || 0,
        vocesInstrumental: scores.vocesInstrumental || 0,
        originalidad: scores.originalidad || 0,
        totalScore: totalScore || 0,
        ...globals,
        playCount: extendedStats.playCount ? parseInt(extendedStats.playCount) : null,
        bpm: extendedStats.bpm ? parseInt(extendedStats.bpm) : null,
        valence: extendedStats.valence || null,
        discoveryMonth: extendedStats.discoveryMonth ? new Date(extendedStats.discoveryMonth) : null,
      };

      await prisma.musicRating.upsert({
        where: { userId_musicId: { userId: user.id, musicId: music.id } },
        update: trackPayload,
        create: { userId: user.id, musicId: music.id, ...trackPayload }
      });

    } else if (type === 'book') {
      const book = await prisma.book.upsert({
        where: { googleId: String(mediaData.id) },
        update: {},
        create: {
          googleId: String(mediaData.id),
          title: mediaData.title || "Unknown Book",
          author: mediaData.author || "Unknown Author",
          posterUrl: mediaData.posterUrl || "",
          releaseDate: null,
          raw_metadata: mediaData.raw_metadata || {}
        }
      });

      const bookPayload = {
        adiccion: scores.adiccion || 0,
        conexionPersonajes: scores.conexionPersonajes || 0,
        fluidezLectura: scores.fluidezLectura || 0,
        historia: scores.historia || 0,
        mundo: scores.mundo || 0,
        ritmo: scores.ritmo || 0,
        impacto: scores.impacto || 0,
        final: scores.final || 0,
        totalScore: totalScore || 0,
        ...globals,
        totalPages: extendedStats.totalPages ? parseInt(extendedStats.totalPages) : null,
        pagesPerDay: extendedStats.pagesPerDay ? parseFloat(extendedStats.pagesPerDay) : null,
        bookFormat: extendedStats.bookFormat || null,
        language: extendedStats.language || null
      };

      await prisma.bookRating.upsert({
        where: { userId_bookId: { userId: user.id, bookId: book.id } },
        update: bookPayload as any,
        create: { userId: user.id, bookId: book.id, ...bookPayload } as any
      });

    } else if (type === 'game') {
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

      const gamePayload = {
        jugabilidad: scores.jugabilidad || 0,
        adiccion: scores.adiccion || 0,
        disenoNiveles: scores.disenoNiveles || 0,
        arteEstetica: scores.arte || 0,
        historia: scores.historia || 0,
        inmersion: scores.inmersion || 0,
        sonido: scores.sonido || 0,
        impacto: scores.impacto || 0,
        dificultad: scores.dificultad || 0,
        rejugabilidad: scores.rejugabilidad || 0,
        rendimiento: scores.rendimiento || 0,
        conexionPersonajes: scores.personajes || 0,
        detalle: scores.detalle || 0,
        mecanicas: scores.mecanicas || 0,
        ia: scores.ia || 0,
        totalScore: totalScore || 0,
        ...globals,
        playtimeHours: extendedStats.playtimeHours ? parseFloat(extendedStats.playtimeHours) : null,
        completionTier: extendedStats.completionTier || null,
        platform: extendedStats.platform || null,
        difficulty_meta: extendedStats.difficulty || null, // renamed because 'dificultad' is already a rating score
        achievementsPct: extendedStats.achievementsPct ? parseInt(extendedStats.achievementsPct) : null
      };

      await prisma.gameRating.upsert({
        where: { userId_gameId: { userId: user.id, gameId: game.id } },
        update: gamePayload as any,
        create: { userId: user.id, gameId: game.id, ...gamePayload } as any
      });
    }

    return { success: true };
  } catch (e: any) { 
    console.error("SAVE ERROR:", e); 
    throw new Error(e.message || String(e)); 
  }
}
`;
fs.writeFileSync('src/app/actions/ratings.ts', code);

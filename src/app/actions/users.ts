"use server";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

export async function getUserByUsername(username: string) {
  try {
    return await prisma.user.findUnique({
      where: { username }
    });
  } catch (e) {
    return null;
  }
}

export async function getUserStats(userId: string) {
  try {
    const [
      gameStats, bookStats, seriesStats, movieStats, musicStats,
      gameCount, bookCount, seriesCount, movieCount, musicCount
    ] = await Promise.all([
      prisma.gameRating.aggregate({ where: { userId }, _sum: { playtimeHours: true }, _avg: { totalScore: true } }),
      prisma.bookRating.aggregate({ where: { userId }, _sum: { totalPages: true }, _avg: { totalScore: true } }),
      prisma.seriesRating.aggregate({ where: { userId }, _sum: { bingeDays: true }, _avg: { totalScore: true } }),
      prisma.movieRating.aggregate({ where: { userId }, _avg: { totalScore: true } }),
      prisma.musicRating.aggregate({ where: { userId }, _avg: { totalScore: true } }),
      
      prisma.gameRating.count({ where: { userId } }),
      prisma.bookRating.count({ where: { userId } }),
      prisma.seriesRating.count({ where: { userId } }),
      prisma.movieRating.count({ where: { userId } }),
      prisma.musicRating.count({ where: { userId } })
    ]);

    const totalRatings = gameCount + bookCount + seriesCount + movieCount + musicCount;

    return {
      totalRatings,
      gameStats, bookStats, seriesStats, movieStats, musicStats,
      gameCount, bookCount, seriesCount, movieCount, musicCount
    };
  } catch(e) {
    console.error(e);
    return null;
  }
}

export async function getUserFavorites(userId: string) {
  try {
    // Get top 2 of each category to form a mixed favorites list
    const [movies, series, games, books] = await Promise.all([
      prisma.movieRating.findMany({ where: { userId, totalScore: { gte: 850 } }, orderBy: { totalScore: 'desc' }, take: 2, include: { movie: true } }),
      prisma.seriesRating.findMany({ where: { userId, totalScore: { gte: 850 } }, orderBy: { totalScore: 'desc' }, take: 2, include: { series: true } }),
      prisma.gameRating.findMany({ where: { userId, totalScore: { gte: 850 } }, orderBy: { totalScore: 'desc' }, take: 2, include: { game: true } }),
      prisma.bookRating.findMany({ where: { userId, totalScore: { gte: 850 } }, orderBy: { totalScore: 'desc' }, take: 2, include: { book: true } })
    ]);

    const favorites = [
      ...movies.map(m => ({ id: m.movie.tmdbId, title: m.movie.title, poster: m.movie.posterUrl ? `https://image.tmdb.org/t/p/w500${m.movie.posterUrl}` : null, score: m.totalScore, type: 'movie' })),
      ...series.map(s => ({ id: s.series.tmdbId, title: s.series.title, poster: s.series.posterUrl ? `https://image.tmdb.org/t/p/w500${s.series.posterUrl}` : null, score: s.totalScore, type: 'tv' })),
      ...games.map(g => ({ id: g.game.rawgId, title: g.game.title, poster: g.game.posterUrl, score: g.totalScore, type: 'game' })),
      ...books.map(b => ({ id: b.book.googleId, title: b.book.title, poster: b.book.posterUrl, score: b.totalScore, type: 'book' }))
    ];

    return favorites.sort((a, b) => b.score - a.score).slice(0, 5); // Top 5 overall favorites
  } catch(e) {
    return [];
  }
}

"use server";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
import { getMediaDetails } from "./tmdb";

export async function saveEpisodeRating(tmdbId: string, seasonNum: number, episodeNum: number, score: number) {
  try {
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({ data: { email: "user@critiq.local", username: "usuario" } });
    }

    // Asegurar que la serie exista
    let series = await prisma.series.findUnique({
      where: { tmdbId: Number(tmdbId) }
    });

    if (!series) {
      const mediaData = await getMediaDetails(tmdbId, 'tv');
      series = await prisma.series.create({
        data: {
          tmdbId: Number(tmdbId),
          title: mediaData.name || "Unknown TV Show",
          posterUrl: mediaData.poster_path ? `https://image.tmdb.org/t/p/w780${mediaData.poster_path}` : "",
          releaseDate: mediaData.first_air_date ? new Date(mediaData.first_air_date) : null,
          raw_metadata: mediaData ? JSON.stringify(mediaData) : null
        }
      });
    }

    // Upsert la valoración del episodio
    await prisma.episodeRating.upsert({
      where: {
        userId_seriesId_seasonNum_episodeNum: {
          userId: user.id,
          seriesId: series.id,
          seasonNum,
          episodeNum
        }
      },
      update: { score: Math.round(score * 100) },
      create: {
        userId: user.id,
        seriesId: series.id,
        seasonNum,
        episodeNum,
        score: Math.round(score * 100)
      }
    });

    return { success: true };
  } catch (e: any) {
    console.error("Episode save error:", e);
    throw new Error(e.message || String(e));
  }
}

export async function getEpisodeRatings(tmdbId: string) {
  let user = await prisma.user.findFirst();
  if (!user) return [];

  const series = await prisma.series.findUnique({
    where: { tmdbId: Number(tmdbId) }
  });

  if (!series) return [];

  const ratings = await prisma.episodeRating.findMany({
    where: { userId: user.id, seriesId: series.id },
    orderBy: [
      { seasonNum: 'asc' },
      { episodeNum: 'asc' }
    ]
  });

  return ratings.map(r => ({ ...r, score: r.score / 100 }));
}

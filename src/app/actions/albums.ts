"use server";

import { PrismaClient } from "@prisma/client";
import { getAlbumTracks } from "./music";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function saveAlbumTrackRating(albumId: string, trackNum: number, score: number) {
  try {
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({ data: { email: "user@critiq.local", username: "usuario" } });
    }

    let album = await prisma.music.findUnique({
      where: { spotifyId: albumId }
    });

    if (!album) {
      const albumData = await getAlbumTracks(albumId);
      album = await prisma.music.create({
        data: {
          spotifyId: albumId,
          type: "album",
          title: albumData.name || "Unknown Album",
          artist: albumData.artists[0]?.name || "Unknown Artist",
          posterUrl: albumData.posterUrl,
          releaseDate: albumData.release_date ? new Date(albumData.release_date) : null,
          raw_metadata: albumData.raw_metadata ? JSON.stringify(albumData.raw_metadata) : null
        }
      });
    }

    await prisma.albumTrackRating.upsert({
      where: {
        userId_albumId_trackNum: {
          userId: user.id,
          albumId: album.id,
          trackNum
        }
      },
      update: { score: Math.round(score * 100) },
      create: {
        userId: user.id,
        albumId: album.id,
        trackNum,
        score: Math.round(score * 100)
      }
    });

    return { success: true };
  } catch (e: any) {
    console.error("Album Track save error:", e);
    throw new Error(e.message || String(e));
  }
}

export async function getAlbumTrackRatings(albumId: string) {
  let user = await prisma.user.findFirst();
  if (!user) return [];

  const album = await prisma.music.findUnique({
    where: { spotifyId: albumId }
  });

  if (!album) return [];

  const ratings = await prisma.albumTrackRating.findMany({
    where: { userId: user.id, albumId: album.id },
    orderBy: { trackNum: 'asc' }
  });

  return ratings.map(r => ({ ...r, score: r.score / 100 }));
}

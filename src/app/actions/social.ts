"use server";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

// Add a friend
export async function addFriend(friendUsername: string) {
  try {
    const sessionUser = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!sessionUser) return { success: false, error: "No autorizado" };
    const myId = sessionUser.id;

    const friend = await prisma.user.findUnique({ where: { username: friendUsername } });
    if (!friend) return { success: false, error: "Usuario no encontrado" };
    if (friend.id === myId) return { success: false, error: "No puedes añadirte a ti mismo" };

    // Check if already friends
    const existing = await prisma.friendship.findUnique({
      where: { userId_friendId: { userId: myId, friendId: friend.id } }
    });

    if (existing) return { success: false, error: "Ya son amigos" };

    // Create bidirectional friendships for simplicity
    await prisma.$transaction([
      prisma.friendship.create({ data: { userId: myId, friendId: friend.id } }),
      prisma.friendship.create({ data: { userId: friend.id, friendId: myId } }) // Mutual automatically for now
    ]);

    return { success: true };
  } catch(e) {
    console.error(e);
    return { success: false, error: "Error de servidor" };
  }
}

// Remove a friend
export async function removeFriend(friendUsername: string) {
  try {
    const sessionUser = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!sessionUser) return { success: false, error: "No autorizado" };
    const myId = sessionUser.id;

    const friend = await prisma.user.findUnique({ where: { username: friendUsername } });
    if (!friend) return { success: false, error: "Usuario no encontrado" };

    await prisma.$transaction([
      prisma.friendship.deleteMany({ where: { userId: myId, friendId: friend.id } }),
      prisma.friendship.deleteMany({ where: { userId: friend.id, friendId: myId } })
    ]);

    return { success: true };
  } catch(e) {
    console.error(e);
    return { success: false, error: "Error de servidor" };
  }
}

// Check if friends
export async function checkFriendship(myId: string, friendUsername: string) {
  try {
    const friend = await prisma.user.findUnique({ where: { username: friendUsername } });
    if (!friend) return false;
    const existing = await prisma.friendship.findFirst({
      where: { userId: myId, friendId: friend.id }
    });
    return !!existing;
  } catch {
    return false;
  }
}

with open("src/app/actions/ratings.ts", "r") as f:
    code = f.read()

get_user_rating = """
export async function getUserRating(type: 'movie' | 'tv' | 'track' | 'book' | 'game', mediaId: string) {
  const user = await prisma.user.findFirst();
  if (!user) return null;

  if (type === 'movie') {
    const media = await prisma.movie.findUnique({ where: { tmdbId: parseInt(mediaId) } });
    if (!media) return null;
    return prisma.movieRating.findFirst({ where: { userId: user.id, movieId: media.id } });
  }
  if (type === 'tv') {
    const media = await prisma.series.findUnique({ where: { tmdbId: parseInt(mediaId) } });
    if (!media) return null;
    return prisma.seriesRating.findFirst({ where: { userId: user.id, seriesId: media.id } });
  }
  if (type === 'game') {
    const media = await prisma.game.findUnique({ where: { rawgId: mediaId } });
    if (!media) return null;
    return prisma.gameRating.findFirst({ where: { userId: user.id, gameId: media.id } });
  }
  if (type === 'book') {
    const media = await prisma.book.findUnique({ where: { googleId: mediaId } });
    if (!media) return null;
    return prisma.bookRating.findFirst({ where: { userId: user.id, bookId: media.id } });
  }
  if (type === 'track') {
    const media = await prisma.music.findUnique({ where: { spotifyId: mediaId } });
    if (!media) return null;
    return prisma.musicRating.findFirst({ where: { userId: user.id, musicId: media.id } });
  }
  return null;
}
"""

if "export async function getUserRating" not in code:
    code = code + "\n" + get_user_rating

with open("src/app/actions/ratings.ts", "w") as f:
    f.write(code)

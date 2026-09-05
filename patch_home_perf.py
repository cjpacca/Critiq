import re

with open("src/app/page.tsx", "r") as f:
    code = f.read()

# Replace sequential awaits with Promise.all
old_queries = """  const seriesCount = await prisma.seriesRating.count();
  const moviesCount = await prisma.movieRating.count();
  const musicCount = await prisma.musicRating.count();
  const bookCount = await prisma.bookRating.count();
  const gameCount = await prisma.gameRating.count();
  
  const topMovies = await prisma.movieRating.findMany({ orderBy: { totalScore: 'desc' }, take: 3, include: { movie: true } });
  const topSeries = await prisma.seriesRating.findMany({ orderBy: { totalScore: 'desc' }, take: 3, include: { series: true } });
  const topMusic = await prisma.musicRating.findMany({ orderBy: { totalScore: 'desc' }, take: 3, include: { music: true } });
  const topBooks = await prisma.bookRating.findMany({ orderBy: { totalScore: 'desc' }, take: 3, include: { book: true } });
  const topGames = await prisma.gameRating.findMany({ orderBy: { totalScore: 'desc' }, take: 3, include: { game: true } });

  // Aggregated Stats
  const gameStats = await prisma.gameRating.aggregate({ _sum: { playtimeHours: true }, _avg: { totalScore: true } });
  const bookStats = await prisma.bookRating.aggregate({ _sum: { totalPages: true }, _avg: { totalScore: true } });
  const seriesStats = await prisma.seriesRating.aggregate({ _sum: { bingeDays: true }, _avg: { totalScore: true } });
  const movieStats = await prisma.movieRating.aggregate({ _avg: { totalScore: true } });
  const musicStats = await prisma.musicRating.aggregate({ _avg: { totalScore: true } });"""

new_queries = """  const [
    seriesCount, moviesCount, musicCount, bookCount, gameCount,
    topMovies, topSeries, topMusic, topBooks, topGames,
    gameStats, bookStats, seriesStats, movieStats, musicStats
  ] = await Promise.all([
    prisma.seriesRating.count(),
    prisma.movieRating.count(),
    prisma.musicRating.count(),
    prisma.bookRating.count(),
    prisma.gameRating.count(),
    
    prisma.movieRating.findMany({ orderBy: { totalScore: 'desc' }, take: 3, include: { movie: true } }),
    prisma.seriesRating.findMany({ orderBy: { totalScore: 'desc' }, take: 3, include: { series: true } }),
    prisma.musicRating.findMany({ orderBy: { totalScore: 'desc' }, take: 3, include: { music: true } }),
    prisma.bookRating.findMany({ orderBy: { totalScore: 'desc' }, take: 3, include: { book: true } }),
    prisma.gameRating.findMany({ orderBy: { totalScore: 'desc' }, take: 3, include: { game: true } }),

    prisma.gameRating.aggregate({ _sum: { playtimeHours: true }, _avg: { totalScore: true } }),
    prisma.bookRating.aggregate({ _sum: { totalPages: true }, _avg: { totalScore: true } }),
    prisma.seriesRating.aggregate({ _sum: { bingeDays: true }, _avg: { totalScore: true } }),
    prisma.movieRating.aggregate({ _avg: { totalScore: true } }),
    prisma.musicRating.aggregate({ _avg: { totalScore: true } })
  ]);"""

if old_queries in code:
    code = code.replace(old_queries, new_queries)
else:
    print("Warning: old queries block not found perfectly.")
    # Fallback to regex
    code = re.sub(r'  const seriesCount = await prisma.seriesRating.count\(\);.*?const musicStats = await prisma.musicRating.aggregate\(\{ _avg: \{ totalScore: true \} \}\);', new_queries, code, flags=re.DOTALL)

with open("src/app/page.tsx", "w") as f:
    f.write(code)

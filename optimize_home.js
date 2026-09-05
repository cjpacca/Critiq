const fs = require('fs');

let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// Replace sequential queries with Promise.all
const sequentialRegex = /const seriesCount = await prisma.seriesRating.count\(\);[\s\S]*const musicStats = await prisma.musicRating.aggregate\(\{ _avg: \{ totalScore: true \} \}\);/;

const parallelCode = `  const [
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
  ]);`;

code = code.replace(sequentialRegex, parallelCode);
fs.writeFileSync('src/app/page.tsx', code);

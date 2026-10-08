import re

with open("src/app/page.tsx", "r") as f:
    code = f.read()

# 1. Add GalaxiaChart import
code = code.replace(
    'import { VitrinaDorada } from "@/components/VitrinaDorada";',
    'import { VitrinaDorada } from "@/components/VitrinaDorada";\nimport { GalaxiaChart } from "@/components/GalaxiaChart";'
)

# 2. Inject the data fetching logic right before activityData mapping
fetch_galaxy = """
  const [allMovieRatings, allSeriesRatings, allGameRatings, allBookRatings, allMusicRatings] = await Promise.all([
    prisma.movieRating.findMany({ select: { movieId: true, totalScore: true, createdAt: true, movie: { select: { title: true, posterUrl: true } } } }),
    prisma.seriesRating.findMany({ select: { seriesId: true, totalScore: true, createdAt: true, series: { select: { title: true, posterUrl: true } } } }),
    prisma.gameRating.findMany({ select: { gameId: true, totalScore: true, createdAt: true, game: { select: { title: true, posterUrl: true } } } }),
    prisma.bookRating.findMany({ select: { bookId: true, totalScore: true, createdAt: true, book: { select: { title: true, posterUrl: true } } } }),
    prisma.musicRating.findMany({ select: { musicId: true, totalScore: true, createdAt: true, music: { select: { title: true, posterUrl: true } } } }),
  ]);

  const galaxyData = [
    ...allMovieRatings.map(r => ({ id: r.movieId, type: 'movies', title: r.movie.title, score: r.totalScore, date: r.createdAt.getTime(), poster: r.movie.posterUrl ? `https://image.tmdb.org/t/p/w300${r.movie.posterUrl}` : '' })),
    ...allSeriesRatings.map(r => ({ id: r.seriesId, type: 'series', title: r.series.title, score: r.totalScore, date: r.createdAt.getTime(), poster: r.series.posterUrl ? `https://image.tmdb.org/t/p/w300${r.series.posterUrl}` : '' })),
    ...allGameRatings.map(r => ({ id: r.gameId, type: 'games', title: r.game.title, score: r.totalScore, date: r.createdAt.getTime(), poster: r.game.posterUrl || "" })),
    ...allBookRatings.map(r => ({ id: r.bookId, type: 'books', title: r.book.title, score: r.totalScore, date: r.createdAt.getTime(), poster: r.book.posterUrl || "" })),
    ...allMusicRatings.map(r => ({ id: r.musicId, type: 'music', title: r.music.title, score: r.totalScore, date: r.createdAt.getTime(), poster: r.music.posterUrl || "" })),
  ];
"""

code = code.replace("  const allDates = [...mDates, ...sDates", fetch_galaxy + "\n  const allDates = [...mDates, ...sDates")


# 3. Inject the GalaxiaChart UI
ui_galaxy = """      {/* Galaxia Bubble Chart */}
      <section className="mb-8 w-full">
        <GalaxiaChart data={galaxyData} />
      </section>

      {/* Heatmap Global */}"""

code = code.replace("      {/* Heatmap Global */}", ui_galaxy)

with open("src/app/page.tsx", "w") as f:
    f.write(code)

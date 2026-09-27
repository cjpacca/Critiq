import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Film, Tv, Gamepad2, Music, BookOpen, Star } from "lucide-react";
import { RankingColumn } from "@/components/RankingColumn";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";

export const revalidate = 0; // Datos frescos siempre

export default async function Home() {
    const [
    seriesCount, moviesCount, musicCount, bookCount, gameCount,
    topMovies, topSeries, topMusic, topBooks, topGames,
    gameStats, bookStats, seriesStats, movieStats, musicStats,
    mDates, sDates, gDates, bDates, muDates, epDates, trDates
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
    prisma.musicRating.aggregate({ _avg: { totalScore: true } }),
    prisma.movieRating.findMany({ select: { createdAt: true } }),
    prisma.seriesRating.findMany({ select: { createdAt: true } }),
    prisma.gameRating.findMany({ select: { createdAt: true } }),
    prisma.bookRating.findMany({ select: { createdAt: true } }),
    prisma.musicRating.findMany({ select: { createdAt: true } }),
    prisma.episodeRating.findMany({ select: { createdAt: true } }),
    prisma.albumTrackRating.findMany({ select: { createdAt: true } })
  ]);

  const allDates = [...mDates, ...sDates, ...gDates, ...bDates, ...muDates, ...epDates, ...trDates];
  const activityData = allDates.map(d => ({ date: d.createdAt.toISOString(), count: 1 }));


  // Colores distintivos por módulo
  const mediaColors = {
    series: { text: "text-blue-400", border: "border-blue-500", bg: "bg-blue-500/20" },
    movies: { text: "text-purple-400", border: "border-purple-500", bg: "bg-purple-500/20" },
    games: { text: "text-green-500", border: "border-green-600", bg: "bg-green-600/20" },
    music: { text: "text-yellow-400", border: "border-yellow-500", bg: "bg-yellow-500/20" },
    books: { text: "text-orange-400", border: "border-orange-500", bg: "bg-orange-500/20" },
  };

  const stats = [
    { label: "Series", value: seriesCount, icon: Tv, colors: mediaColors.series },
    { label: "Películas", value: moviesCount, icon: Film, colors: mediaColors.movies },
    { label: "Música", value: musicCount, icon: Music, colors: mediaColors.music },
    { label: "Videojuegos", value: gameCount, icon: Gamepad2, colors: mediaColors.games },
    { label: "Libros", value: bookCount, icon: BookOpen, colors: mediaColors.books },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* Hero Header */}
      <section className="relative glass-card p-10 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-4 tracking-tight">
            Tu Universo Digital
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl leading-relaxed">
            Explora, valora y cataloga todas las experiencias de entretenimiento que consumes. El ranking definitivo creado 100% por ti.
          </p>
        </div>
      </section>

      
      {/* Panel de Estadísticas Globales (Fase 8) */}
      <section className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl -z-10" />
        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
          <Star className="text-yellow-400" /> Mi Vida en Estadísticas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
            <p className="text-neutral-400 text-sm font-bold uppercase mb-1 tracking-wider">Horas de Juego</p>
            <p className="text-3xl font-black text-green-400">{gameStats._sum.playtimeHours?.toFixed(1) || 0} <span className="text-lg text-neutral-500">h</span></p>
            <p className="text-xs text-neutral-500 mt-2">Promedio: {gameStats._avg.totalScore?.toFixed(0) || 0}/1000 pts</p>
          </div>
          <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
            <p className="text-neutral-400 text-sm font-bold uppercase mb-1 tracking-wider">Páginas Leídas</p>
            <p className="text-3xl font-black text-orange-400">{bookStats._sum.totalPages || 0}</p>
            <p className="text-xs text-neutral-500 mt-2">Promedio: {bookStats._avg.totalScore?.toFixed(0) || 0}/1000 pts</p>
          </div>
          <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
            <p className="text-neutral-400 text-sm font-bold uppercase mb-1 tracking-wider">Días de Binge (Series)</p>
            <p className="text-3xl font-black text-blue-400">{seriesStats._sum.bingeDays || 0}</p>
            <p className="text-xs text-neutral-500 mt-2">Promedio: {seriesStats._avg.totalScore?.toFixed(0) || 0}/1000 pts</p>
          </div>
          <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
            <p className="text-neutral-400 text-sm font-bold uppercase mb-1 tracking-wider">Promedio Películas</p>
            <p className="text-3xl font-black text-purple-400">{movieStats._avg.totalScore?.toFixed(0) || 0}</p>
            <p className="text-xs text-neutral-500 mt-2">Score Global (0-1000)</p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass p-6 rounded-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 border border-white/5 shadow-xl group">
              <div className={`w-12 h-12 rounded-xl ${stat.colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={stat.colors.text} size={24} />
              </div>
              <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-neutral-500 font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          )
        })}
      </section>

      {/* Heatmap Global */}
      <section className="mb-8 w-full">
        <ActivityHeatmap activityData={activityData} />
      </section>

      {/* Leaderboards Espectaculares */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-8">
        <RankingColumn 
          title="Top Películas" 
          icon={Film} 
          color={mediaColors.movies} 
          items={topMovies.map(m => ({
            id: m.id,
            title: m.movie.title,
            poster: `https://image.tmdb.org/t/p/w300${m.movie.posterUrl}`,
            backdrop: (m.movie.raw_metadata as any)?.backdrop_path ? `https://image.tmdb.org/t/p/w780${(m.movie.raw_metadata as any).backdrop_path}` : null,
            score: m.totalScore
          }))}
        />
        <RankingColumn 
          title="Top Series" 
          icon={Tv} 
          color={mediaColors.series} 
          items={topSeries.map(s => ({
            id: s.id,
            title: s.series.title,
            poster: `https://image.tmdb.org/t/p/w300${s.series.posterUrl}`,
            backdrop: (s.series.raw_metadata as any)?.backdrop_path ? `https://image.tmdb.org/t/p/w780${(s.series.raw_metadata as any).backdrop_path}` : null,
            score: s.totalScore
          }))}
        />
        <RankingColumn 
          title="Top Canciones" 
          icon={Music} 
          color={mediaColors.music} 
          imageClass="w-16 h-16 rounded-full aspect-square"
          items={topMusic.map(m => ({
            id: m.id,
            title: m.music.title,
            subtitle: m.music.artist,
            poster: m.music.posterUrl || "",
            score: m.totalScore
          }))}
        />
        <RankingColumn 
          title="Top Libros" 
          icon={BookOpen} 
          color={mediaColors.books} 
          imageClass="w-16 h-24 rounded-md aspect-[2/3]"
          items={topBooks.map(b => ({
            id: b.id,
            title: b.book.title,
            subtitle: b.book.author,
            poster: b.book.posterUrl || "",
            score: b.totalScore
          }))}
        />
      
        <RankingColumn 
          title="Top Juegos" 
          icon={Gamepad2} 
          color={mediaColors.games} 
          imageClass="w-16 h-24 rounded-md aspect-[3/4]"
          items={topGames.map(g => ({
            id: g.id,
            title: g.game.title,
            poster: g.game.posterUrl || "",
            score: g.totalScore
          }))}
        />
      </section>

    </div>
  );
}

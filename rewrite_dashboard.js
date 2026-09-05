const fs = require('fs');

const content = `import { prisma } from "@/lib/prisma";
import { Film, Tv, Gamepad2, Music, BookOpen, Star } from "lucide-react";
import { RankingColumn } from "@/components/RankingColumn";

export const revalidate = 0; // Datos frescos siempre

export default async function Home() {
  const seriesCount = await prisma.seriesRating.count();
  const moviesCount = await prisma.movieRating.count();
  const musicCount = await prisma.musicRating.count();
  const bookCount = await prisma.bookRating.count();
  
  const topMovies = await prisma.movieRating.findMany({ orderBy: { totalScore: 'desc' }, take: 3, include: { movie: true } });
  const topSeries = await prisma.seriesRating.findMany({ orderBy: { totalScore: 'desc' }, take: 3, include: { series: true } });
  const topMusic = await prisma.musicRating.findMany({ orderBy: { totalScore: 'desc' }, take: 3, include: { music: true } });
  const topBooks = await prisma.bookRating.findMany({ orderBy: { totalScore: 'desc' }, take: 3, include: { book: true } });

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
    { label: "Videojuegos", value: "0", icon: Gamepad2, colors: mediaColors.games },
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

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass p-6 rounded-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 border border-white/5 shadow-xl group">
              <div className={\`w-12 h-12 rounded-xl \${stat.colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform\`}>
                <Icon className={stat.colors.text} size={24} />
              </div>
              <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-neutral-500 font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          )
        })}
      </section>

      {/* Leaderboards Espectaculares */}
      <section className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-8">
        <RankingColumn 
          title="Top Películas" 
          icon={Film} 
          color={mediaColors.movies} 
          items={topMovies.map(m => ({
            id: m.id,
            title: m.movie.title,
            poster: \`https://image.tmdb.org/t/p/w300\${m.movie.posterUrl}\`,
            backdrop: (m.movie.raw_metadata as any)?.backdrop_path ? \`https://image.tmdb.org/t/p/w780\${(m.movie.raw_metadata as any).backdrop_path}\` : null,
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
            poster: \`https://image.tmdb.org/t/p/w300\${s.series.posterUrl}\`,
            backdrop: (s.series.raw_metadata as any)?.backdrop_path ? \`https://image.tmdb.org/t/p/w780\${(s.series.raw_metadata as any).backdrop_path}\` : null,
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
      </section>

    </div>
  );
}
`;

fs.writeFileSync('src/app/page.tsx', content);

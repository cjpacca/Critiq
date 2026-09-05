import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Film, Tv, Gamepad2, Music, BookOpen, Disc } from "lucide-react";

const prisma = new PrismaClient();
export const revalidate = 0;

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  
  const validModules = ['movies', 'series', 'games', 'music', 'books', 'albums'];
  if (!validModules.includes(module)) {
    notFound();
  }

  let items: any[] = [];
  let title = "";
  let Icon = Film;
  let color = "text-white";

  if (module === 'movies') {
    title = "Mis Películas";
    Icon = Film;
    color = "text-purple-400";
    const ratings = await prisma.movieRating.findMany({ include: { movie: true }, orderBy: { totalScore: 'desc' } });
    items = ratings.map(r => ({ id: r.movie.tmdbId, title: r.movie.title, poster: r.movie.posterUrl ? `https://image.tmdb.org/t/p/w500${r.movie.posterUrl}` : null, score: r.totalScore, type: 'movie' }));
  } else if (module === 'series') {
    title = "Mis Series";
    Icon = Tv;
    color = "text-blue-400";
    const ratings = await prisma.seriesRating.findMany({ include: { series: true }, orderBy: { totalScore: 'desc' } });
    items = ratings.map(r => ({ id: r.series.tmdbId, title: r.series.title, poster: r.series.posterUrl ? `https://image.tmdb.org/t/p/w500${r.series.posterUrl}` : null, score: r.totalScore, type: 'tv' }));
  } else if (module === 'games') {
    title = "Mis Videojuegos";
    Icon = Gamepad2;
    color = "text-green-500";
    const ratings = await prisma.gameRating.findMany({ include: { game: true }, orderBy: { totalScore: 'desc' } });
    items = ratings.map(r => ({ id: r.game.rawgId, title: r.game.title, poster: r.game.posterUrl, score: r.totalScore, type: 'game' }));
  } else if (module === 'music') {
    title = "Mis Canciones";
    Icon = Music;
    color = "text-yellow-400";
    const ratings = await prisma.musicRating.findMany({ include: { music: true }, orderBy: { totalScore: 'desc' } });
    items = ratings.map(r => ({ id: r.music.spotifyId, title: r.music.title, poster: r.music.posterUrl, score: r.totalScore, type: 'track' }));
  } else if (module === 'books') {
    title = "Mis Libros";
    Icon = BookOpen;
    color = "text-orange-400";
    const ratings = await prisma.bookRating.findMany({ include: { book: true }, orderBy: { totalScore: 'desc' } });
    items = ratings.map(r => ({ id: r.book.googleId, title: r.book.title, poster: r.book.posterUrl, score: r.totalScore, type: 'book' }));
  } else if (module === 'albums') {
    title = "Mis Álbumes";
    Icon = Disc;
    color = "text-yellow-500";
    // We fetch distinct albums using prisma's Music model with album track ratings...
    // But honestly we didn't save the albums explicitly as an Album object. Let's just say it's coming soon.
  }

  return (
    <div className="animate-fade-in">
      <header className="mb-10 flex items-center gap-4">
        <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 ${color}`}>
          <Icon size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white">{title}</h1>
          {module !== 'albums' ? (
            <p className="text-neutral-400 mt-2">Tienes {items.length} obras valoradas en esta categoría.</p>
          ) : (
            <p className="text-neutral-400 mt-2">Función de catálogo de álbumes en construcción.</p>
          )}
        </div>
      </header>

      {items.length === 0 && module !== 'albums' ? (
        <div className="glass-card p-12 text-center">
          <p className="text-neutral-500 text-lg">Aún no has valorado nada en esta categoría.</p>
          <Link href="/search" className="inline-block mt-4 text-blue-400 hover:text-blue-300 font-bold">Ir a buscar →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {items.map((item) => (
            <Link key={item.id} href={`/rate/${item.type}/${item.id}`} className="group flex flex-col gap-3">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-lg bg-white/5">
                {item.poster ? (
                  <img src={item.poster} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600">Sin Imagen</div>
                )}
                <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-white font-black text-sm">
                  {item.score}
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm line-clamp-1 group-hover:text-blue-400 transition-colors">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

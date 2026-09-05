import { notFound } from "next/navigation";
import { getUserByUsername } from "@/app/actions/users";
import { PrismaClient } from "@prisma/client";
import { Star, Swords, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();
export const revalidate = 0;

export default async function ComparePage({ params }: { params: Promise<{ userA: string, userB: string }> }) {
  const { userA, userB } = await params;
  
  const user1 = await getUserByUsername(userA);
  const user2 = await getUserByUsername(userB);

  if (!user1 || !user2) notFound();

  // Find overlaps in Movies
  const moviesA = await prisma.movieRating.findMany({ where: { userId: user1.id }, include: { movie: true } });
  const moviesB = await prisma.movieRating.findMany({ where: { userId: user2.id } });
  
  // Find overlaps in Games
  const gamesA = await prisma.gameRating.findMany({ where: { userId: user1.id }, include: { game: true } });
  const gamesB = await prisma.gameRating.findMany({ where: { userId: user2.id } });

  const overlaps: any[] = [];
  
  moviesA.forEach(mA => {
    const mB = moviesB.find(b => b.movieId === mA.movieId);
    if (mB) {
      overlaps.push({
        id: mA.movie.tmdbId,
        title: mA.movie.title,
        type: 'movie',
        poster: mA.movie.posterUrl ? `https://image.tmdb.org/t/p/w300${mA.movie.posterUrl}` : null,
        scoreA: mA.totalScore,
        scoreB: mB.totalScore,
        diff: Math.abs(mA.totalScore - mB.totalScore)
      });
    }
  });

  gamesA.forEach(gA => {
    const gB = gamesB.find(b => b.gameId === gA.gameId);
    if (gB) {
      overlaps.push({
        id: gA.game.rawgId,
        title: gA.game.title,
        type: 'game',
        poster: gA.game.posterUrl,
        scoreA: gA.totalScore,
        scoreB: gB.totalScore,
        diff: Math.abs(gA.totalScore - gB.totalScore)
      });
    }
  });

  // Calculate Affinity (0-100%)
  // Max diff possible per item is 1000. 
  // Avg diff across all overlaps.
  let affinity = 0;
  if (overlaps.length > 0) {
    const avgDiff = overlaps.reduce((sum, item) => sum + item.diff, 0) / overlaps.length;
    // 100% means 0 diff. 0% means 1000 diff.
    affinity = Math.max(0, 100 - (avgDiff / 10));
  }

  // Sort overlaps by smallest diff (highest agreement)
  overlaps.sort((a, b) => a.diff - b.diff);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      
      {/* Header Comparador */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-yellow-500/20 to-orange-500/20 blur-3xl rounded-full -z-10" />
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center gap-4 mb-4">
          <Swords size={40} className="text-orange-500" />
          Taste Match
        </h1>
        <div className="flex items-center justify-center gap-6 text-xl font-medium text-neutral-300">
          <span className="bg-white/10 px-4 py-2 rounded-xl">{user1.username}</span>
          <span className="text-neutral-500">vs</span>
          <span className="bg-white/10 px-4 py-2 rounded-xl">{user2.username}</span>
        </div>
      </div>

      {/* Resultados de Afinidad */}
      <div className="bg-black/40 border border-white/10 rounded-3xl p-10 text-center mb-16">
        <h2 className="text-neutral-400 font-bold uppercase tracking-widest mb-4">Afinidad Global</h2>
        {overlaps.length === 0 ? (
          <p className="text-white text-lg">No hay suficientes obras en común para calcular la afinidad.</p>
        ) : (
          <div>
            <div className="text-8xl font-black text-white mb-2">
              {affinity.toFixed(1)}<span className="text-5xl text-neutral-500">%</span>
            </div>
            <p className="text-neutral-400">
              Basado en <strong className="text-white">{overlaps.length} obras</strong> en común.
            </p>
          </div>
        )}
      </div>

      {/* Obras en Común */}
      {overlaps.length > 0 && (
        <div>
          <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" /> Obras en Común
          </h3>
          
          <div className="space-y-4">
            {overlaps.map((item, idx) => (
              <Link key={idx} href={`/rate/${item.type}/${item.id}`} className="group flex items-center gap-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors p-4 rounded-2xl">
                {item.poster ? (
                  <img src={item.poster} className="w-16 h-24 object-cover rounded-lg" />
                ) : (
                  <div className="w-16 h-24 bg-black/50 rounded-lg flex items-center justify-center border border-white/5" />
                )}
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold text-lg truncate group-hover:text-blue-400 transition-colors">{item.title}</h4>
                  <p className="text-neutral-500 text-sm">Discrepancia: {item.diff} puntos</p>
                </div>

                <div className="flex items-center gap-8 px-4 text-center">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">{user1.username}</p>
                    <p className="text-xl font-black text-white">{item.scoreA}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">{user2.username}</p>
                    <p className="text-xl font-black text-white">{item.scoreB}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

import { notFound } from "next/navigation";
import { getUserByUsername, getUserStats, getUserFavorites } from "@/app/actions/users";
import { User as UserIcon, Star, Gamepad2, Tv, Film, BookOpen, Music } from "lucide-react";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { checkFriendship } from "@/app/actions/social";
import { FriendButton } from "./FriendButton";


const prisma = new PrismaClient();
export const revalidate = 0;

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  const user = await getUserByUsername(username);
  if (!user) notFound();

  const loggedUser = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
  const loggedUserId = loggedUser?.id;
  const isOwnProfile = loggedUserId === user.id;
  
  let isFriend = false;
  let loggedUsername = loggedUser?.username || "";
  if (loggedUserId) {
    isFriend = await checkFriendship(loggedUserId, user.username as string);
  }

  const stats = await getUserStats(user.id);
  const favorites = await getUserFavorites(user.id);

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      
      {/* Cabecera del Perfil */}
      <div className="relative mb-12">
        <div className="h-48 w-full bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 rounded-3xl border border-white/10" />
        <div className="absolute -bottom-10 left-10 flex items-end gap-6">
          <div className="w-32 h-32 rounded-2xl bg-black border-4 border-black shadow-2xl flex items-center justify-center overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-80" />
            <UserIcon size={64} className="text-white relative z-10" />
          </div>
          <div className="pb-2">
            <h1 className="text-4xl font-black text-white tracking-tight">{user.username}</h1>
            <p className="text-neutral-400 font-medium mt-1">Crítico Nivel {Math.floor((stats?.totalRatings || 0) / 5) + 1}</p>
          </div>
        </div>
        
        {!isOwnProfile && loggedUserId && (
          <div className="absolute -bottom-4 right-10 flex items-center gap-4">
            <FriendButton targetUsername={user.username!} initialIsFriend={isFriend} />
            <Link 
              href={`/compare/${loggedUsername}/${user.username}`}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black px-6 py-3 rounded-xl font-black shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 hover:-translate-y-1"
            >
              <Star size={20} fill="currentColor" />
              Taste Match
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
        
        {/* Columna Izquierda: Stats Globales */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-black/40 border border-white/10 rounded-3xl p-6">
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Star className="text-yellow-500" size={20} />
              Estadísticas Vitales
            </h3>
            
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-3 text-neutral-400">
                  <Gamepad2 size={18} className="text-green-500" />
                  <span className="text-sm font-medium">Horas de Juego</span>
                </div>
                <span className="text-white font-bold">{stats?.gameStats._sum.playtimeHours?.toFixed(1) || 0}h</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-3 text-neutral-400">
                  <Tv size={18} className="text-blue-400" />
                  <span className="text-sm font-medium">Días de Maratón</span>
                </div>
                <span className="text-white font-bold">{stats?.seriesStats._sum.bingeDays || 0} d</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-3 text-neutral-400">
                  <BookOpen size={18} className="text-orange-400" />
                  <span className="text-sm font-medium">Páginas Leídas</span>
                </div>
                <span className="text-white font-bold">{stats?.bookStats._sum.totalPages || 0} p</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-neutral-400">
                  <Film size={18} className="text-purple-400" />
                  <span className="text-sm font-medium">Promedio Cine</span>
                </div>
                <span className="text-white font-bold">{stats?.movieStats._avg.totalScore?.toFixed(0) || 0} pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Top Favoritos */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            Salón de la Fama
          </h2>
          
          {favorites.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
              <p className="text-neutral-500 text-lg">Este usuario aún no tiene obras valoradas sobresalientes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {favorites.map((item, idx) => (
                <Link key={idx} href={`/rate/${item.type}/${item.id}`} className="group block relative rounded-2xl overflow-hidden aspect-[2/3] border border-white/10 shadow-lg bg-white/5">
                  {item.poster && <img src={item.poster} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 text-[10px] font-black uppercase tracking-wider">
                        Top {idx + 1}
                      </span>
                      <span className="text-white font-black text-sm">{item.score}</span>
                    </div>
                    <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight">{item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

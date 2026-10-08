"use client";
import { useState } from "react";
import { GameScatterPlot } from "@/components/GameScatterPlot";
import { Film, Tv, Gamepad2, BookOpen, Music, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function TopsClient({ initialTab, movies, series, games, books, music }: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'movies', label: 'Películas', icon: Film, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500', data: movies, type: 'movie', imgObj: 'movie' },
    { id: 'series', label: 'Series', icon: Tv, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500', data: series, type: 'tv', imgObj: 'series' },
    { id: 'games', label: 'Videojuegos', icon: Gamepad2, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500', data: games, type: 'game', imgObj: 'game' },
    { id: 'books', label: 'Libros', icon: BookOpen, color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500', data: books, type: 'book', imgObj: 'book' },
    { id: 'music', label: 'Música', icon: Music, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500', data: music, type: 'track', imgObj: 'music' },
  ];

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];
  const items = currentTab.data;

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    router.replace(`/tops?tab=${id}`);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Cabecera */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white flex items-center gap-3 drop-shadow-lg">
          <Trophy className="text-amber-400 drop-shadow-md" size={40} />
          Salón de la Fama
        </h1>
        <p className="text-neutral-400 text-lg">Tu ranking definitivo e histórico en todas las categorías.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${isActive ? `${tab.bg} ${tab.color} border ${tab.border} shadow-lg scale-105` : 'bg-white/5 text-neutral-400 hover:bg-white/10 border border-transparent'}`}
            >
              <Icon size={18} />
              {tab.label}
              <span className="ml-2 bg-black/30 px-2 py-0.5 rounded-full text-xs">{tab.data.length}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'games' && <GameScatterPlot games={games} />}

      {/* Lista de Ranking */}
      <div className="flex flex-col gap-4">
        {items.length === 0 ? (
          <div className="glass-card p-12 text-center text-neutral-500 font-bold border-dashed border-2 border-white/10">
            Aún no has valorado ninguna obra en esta categoría.
          </div>
        ) : (
          items.map((item: any, index: number) => {
            const mediaData = item[currentTab.imgObj];
            const title = mediaData.title;
            const subtitle = mediaData.artist || mediaData.author || mediaData.director;
            const poster = mediaData.posterUrl ? (mediaData.posterUrl.startsWith('/') ? `https://image.tmdb.org/t/p/w300${mediaData.posterUrl}` : mediaData.posterUrl) : '';
            
            // Determinar estilo de la posición
            let rankStyle = "text-neutral-500 bg-black/40";
            if (index === 0) rankStyle = "text-yellow-400 bg-yellow-500/20 border border-yellow-500/50 shadow-[0_0_15px_rgba(250,204,21,0.5)]";
            if (index === 1) rankStyle = "text-slate-300 bg-slate-400/20 border border-slate-400/50 shadow-[0_0_15px_rgba(148,163,184,0.3)]";
            if (index === 2) rankStyle = "text-amber-600 bg-amber-700/20 border border-amber-700/50 shadow-[0_0_15px_rgba(180,83,9,0.3)]";

            return (
              <Link 
                href={`/rate/${currentTab.type}/${mediaData.id}`} 
                key={item.id}
                className="flex items-center gap-4 p-4 glass-card hover:bg-white/10 hover:scale-[1.01] transition-all group"
              >
                {/* Posición */}
                <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl font-black text-xl transition-all ${rankStyle}`}>
                  {index + 1}
                </div>

                {/* Poster */}
                {poster && (
                  <img src={poster} alt={title} className={`w-16 shadow-lg object-cover rounded-md border border-white/10 ${currentTab.type === 'track' ? 'aspect-square' : currentTab.type === 'game' ? 'aspect-[3/4]' : 'aspect-[2/3]'}`} />
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white truncate">{title}</h3>
                  {subtitle && <p className="text-sm text-neutral-400 truncate">{subtitle}</p>}
                </div>

                {/* Puntaje (Diseño Nuevo Elegante) */}
                <div className="flex flex-col items-end justify-center pr-4">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-black ${currentTab.color} drop-shadow-md tracking-tighter`}>{item.totalScore}</span>
                    <span className="text-xs text-neutral-500 font-bold uppercase tracking-widest">/ 1000</span>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  );
}

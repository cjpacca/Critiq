"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { searchMedia } from "@/app/actions/tmdb";
import { searchMusic, searchAlbums } from "@/app/actions/music";
import { searchBooks } from "@/app/actions/books";
import { searchGames } from "@/app/actions/games";
import { Search, Loader2, Film, Tv, Gamepad2, BookOpen, Music, Disc, Popcorn } from "lucide-react";

export function SearchUI() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);



  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'multi'|'movie'|'tv'|'track'|'book'|'game'|'album'>('multi');

    // Auto-buscar cuando cambia el filtro si ya hay una query
  useEffect(() => {
    if (query.trim().length > 0) {
      handleSearch(new Event('submit') as any);
    }
  }, [filter]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      let formattedData = [];
      
      if (filter === 'track') {
        const rawSpotify = await searchMusic(query);
        formattedData = rawSpotify.map((item: any) => ({
          id: item.id,
          title: item.name,
          poster: item.album?.images?.[0]?.url,
          type: 'track'
        })).filter((x: any) => x.poster);
      } else if (filter === 'album') {
        const rawAlbums = await searchAlbums(query);
        formattedData = rawAlbums.map((item: any) => ({
          id: item.id,
          title: item.name,
          poster: item.album?.images?.[0]?.url,
          type: 'album'
        })).filter((x: any) => x.poster);
      } else if (filter === 'book') {
        const rawBooks = await searchBooks(query);
        formattedData = rawBooks.map((item: any) => ({
          id: item.id,
          title: item.title,
          poster: item.poster,
          type: 'book'
        })).filter((x: any) => x.poster);
      } else if (filter === 'game') {
        const rawGames = await searchGames(query);
        formattedData = rawGames.map((item: any) => ({
          id: item.id,
          title: item.title,
          poster: item.poster,
          type: 'game'
        })).filter((x: any) => x.poster);
      } else {
        const rawTMDB = await searchMedia(query, filter);
        formattedData = rawTMDB.map((item: any) => ({
          id: item.id,
          title: item.title || item.name,
          poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
          type: item.media_type || (item.first_air_date ? 'tv' : 'movie')
        })).filter((x: any) => x.poster);
      }
      
      setResults(formattedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 mb-12">
        {/* Barra de Búsqueda Fluida */}
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-white transition-colors" size={24} />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="¿Qué quieres valorar hoy?..." 
              className="w-full bg-white/5 border border-white/10 pl-16 pr-6 py-5 rounded-3xl text-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all shadow-xl"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-white text-black px-10 py-5 rounded-3xl font-black text-lg hover:bg-neutral-200 hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center min-w-[140px]"
          >
            {loading ? <Loader2 className="animate-spin" size={28} /> : "Buscar"}
          </button>
        </form>

        {/* Filtros Interactivos Tipo Píldora */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-neutral-500 mr-2 uppercase tracking-wider">Filtrar por:</span>
          {[
            { id: 'multi', label: 'Cine & TV', icon: Popcorn, color: 'text-purple-400', bg: 'hover:bg-purple-500/20 hover:border-purple-500/50', active: 'bg-purple-500/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' },
            { id: 'movie', label: 'Películas', icon: Film, color: 'text-pink-400', bg: 'hover:bg-pink-500/20 hover:border-pink-500/50', active: 'bg-pink-500/20 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]' },
            { id: 'tv', label: 'Series', icon: Tv, color: 'text-blue-400', bg: 'hover:bg-blue-500/20 hover:border-blue-500/50', active: 'bg-blue-500/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]' },
            { id: 'game', label: 'Juegos', icon: Gamepad2, color: 'text-green-400', bg: 'hover:bg-green-500/20 hover:border-green-500/50', active: 'bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' },
            { id: 'book', label: 'Libros', icon: BookOpen, color: 'text-orange-400', bg: 'hover:bg-orange-500/20 hover:border-orange-500/50', active: 'bg-orange-500/20 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' },
            { id: 'track', label: 'Canciones', icon: Music, color: 'text-yellow-400', bg: 'hover:bg-yellow-500/20 hover:border-yellow-500/50', active: 'bg-yellow-500/20 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]' },
            { id: 'album', label: 'Álbumes', icon: Disc, color: 'text-amber-400', bg: 'hover:bg-amber-500/20 hover:border-amber-500/50', active: 'bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.4)]' }
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = filter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilter(cat.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 transition-all font-bold ${isActive ? cat.active + ' ' + cat.color : 'bg-white/5 text-neutral-400 ' + cat.bg}`}
              >
                <Icon size={16} className={isActive ? cat.color : ''} />
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Resultados de Búsqueda */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {results.map((item) => (
          <Link key={item.id} href={`/rate/${item.type}/${item.id}`} className="group relative block cursor-pointer">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden glass border border-white/5 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={item.poster} 
                alt={item.title}
                className={`object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 group-hover:opacity-40 ${item.type === 'track' ? 'aspect-square' : ''}`}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                <span className="bg-white text-black font-bold py-2 px-4 rounded-full shadow-lg transform scale-90 group-hover:scale-105 transition-transform">
                  Valorar
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm truncate" title={item.title}>{item.title}</h3>
              <p className="text-neutral-500 text-xs uppercase tracking-wider">
                {item.type === 'movie' ? 'Película' : item.type === 'tv' ? 'Serie' : item.type === 'book' ? 'Libro' : item.type === 'game' ? 'Videojuego' : item.type === 'album' ? 'Álbum' : 'Canción'}
              </p>
            </div>
          </Link>
        ))}
      </div>
      
      {results.length === 0 && !loading && (
         <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-12 opacity-50">
           <Search size={48} className="mb-4 text-neutral-500" />
           <p className="text-neutral-400">Busca tus medios favoritos para empezar a rankearlos.</p>
         </div>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { searchMedia } from "@/app/actions/tmdb";
import { searchMusic, searchAlbums } from "@/app/actions/music";
import { searchBooks } from "@/app/actions/books";
import { searchGames } from "@/app/actions/games";
import { Search, Loader2 } from "lucide-react";

export function SearchUI() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'multi'|'movie'|'tv'|'track'|'book'|'game'|'album'>('multi');

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
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar películas, series, canciones o libros..." 
            className="w-full glass pl-12 pr-4 py-4 rounded-2xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="glass px-6 py-4 rounded-2xl text-white focus:outline-none appearance-none cursor-pointer"
        >
          <option value="multi" className="bg-neutral-900">Películas y Series</option>
          <option value="movie" className="bg-neutral-900">Solo Películas</option>
          <option value="tv" className="bg-neutral-900">Solo Series</option>
          <option value="track" className="bg-neutral-900 text-yellow-500">🎵 Canciones</option>
          <option value="album" className="bg-neutral-900 text-yellow-400">💿 Álbumes</option>
          <option value="book" className="bg-neutral-900 text-orange-400">📚 Libros</option>
          <option value="game" className="bg-neutral-900 text-green-500">🎮 Videojuegos</option>
        </select>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center min-w-[120px]"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Buscar"}
        </button>
      </form>

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

import Link from "next/link";
import { getMediaDetails } from "@/app/actions/tmdb";
import { getMusicTrackDetails, getAlbumTracks } from "@/app/actions/music";
import { getBookDetails } from "@/app/actions/books";
import { getGameDetails } from "@/app/actions/games";
import { getCommunityStatsDetailed } from "@/app/actions/ratings";
import { RatingForm } from "@/components/RatingForm";
import { WikidataTags } from "@/components/WikidataTags";
import { CommunityStatsPanel } from "@/components/CommunityStatsPanel";
import { CastCrew } from "@/components/CastCrew";

export default async function RatePage({ params }: { params: Promise<{ type: 'movie'|'tv'|'track'|'album'|'book'|'game', id: string }> }) {
  const { type, id } = await params;
  
  let media;
  let posterUrl = "";
  let title = "";
  let year = "";
  let description = "";

  let tags: string[] = [];
  const communityStats = await getCommunityStatsDetailed(type, id);

  if (type === 'track') {
    media = await getMusicTrackDetails(id);
    posterUrl = media.album?.images?.[0]?.url;
    title = media.name;
    year = media.album?.release_date?.substring(0, 4) || "";
    description = `Canción de ${media.artists?.map((a:any) => a.name).join(', ')}. Pertenece al álbum "${media.album?.name}".`;
    if (media.album?.name) tags.push(media.album.name);
    if (media.duration_ms) tags.push(`${Math.floor(media.duration_ms / 60000)}:${((media.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}`);
  } else if (type === 'album') {
    media = await getAlbumTracks(id);
    posterUrl = media.posterUrl || "";
    title = media.name;
    year = media.release_date ? media.release_date.substring(0, 4) : "";
    description = `Álbum de ${media.artists?.map((a:any) => a.name).join(', ')} con ${media.tracks?.length || 0} canciones.`;
    tags.push(`${media.tracks?.length || 0} Pistas`);
  } else if (type === 'book') {
    media = await getBookDetails(id);
    posterUrl = media.posterUrl || "";
    title = media.title;
    year = ""; 
    description = media.description ? media.description.replace(/(<([^>]+)>)/gi, "").substring(0, 500) + "..." : `Libro escrito por ${media.author}.`;
    if (media.author && media.author !== "Autor desconocido") tags.push(media.author);
    if (media.raw_metadata?.subjects?.length > 0) tags.push(media.raw_metadata.subjects[0]);
  } else if (type === 'game') {
    media = await getGameDetails(id);
    posterUrl = media.posterUrl || "";
    title = media.title;
    year = media.year;
    description = media.description;
    if (media.raw_metadata?.enriched_developer) tags.push(`Desarrollador: ${media.raw_metadata.enriched_developer}`);
    if (media.raw_metadata?.enriched_genre) tags.push(`Género: ${media.raw_metadata.enriched_genre}`);
  } else {
    media = await getMediaDetails(id, type);
    posterUrl = `https://image.tmdb.org/t/p/w780${media.poster_path}`;
    title = media.title || media.name;
    year = new Date(media.release_date || media.first_air_date).getFullYear().toString();
    description = media.overview;
    if (media.genres) tags.push(...media.genres.slice(0, 2).map((g: any) => g.name));
    if (media.runtime) tags.push(`${media.runtime} min`);
    if (media.number_of_seasons) tags.push(`${media.number_of_seasons} Temporadas`);
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row gap-8 mt-4">
        {/* Póster e Info de la obra */}
        <div className="w-full md:w-1/3 xl:w-1/4">
          <div className="glass-card p-4 sticky top-8">
            <img 
              src={posterUrl} 
              alt={title}
              className={`w-full rounded-xl shadow-2xl mb-6 object-cover ${type === 'track' ? 'aspect-square' : type === 'book' ? 'aspect-[2/3]' : type === 'game' ? 'aspect-[3/4]' : ''}`}
            />
            <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
              {title}
            </h1>
            <p className="text-neutral-400 text-sm mb-4">
              {year} • {type === 'movie' ? 'Película' : type === 'tv' ? 'Serie' : type === 'book' ? 'Libro' : type === 'game' ? 'Videojuego' : 'Canción'}
            </p>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-neutral-300 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <WikidataTags title={title} type={type} />
            
            <p className="text-neutral-300 text-sm leading-relaxed opacity-80 mb-6 mt-4">
              {description}
            </p>
            
            {/* Panel de Estadísticas Globales de la Obra */}
            <CommunityStatsPanel stats={communityStats} type={type} />
            {(type === "movie" || type === "tv") && media.credits && <CastCrew credits={media.credits} creators={(media as any).created_by} />}
            
            
            {type === 'tv' && (
              <Link 
                href={`/seasonchart/${id}`} 
                className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/50 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold mt-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                Ver Episodios
              </Link>
            )}
            {type === 'album' && (
              <Link 
                href={`/trackgraph/${id}`} 
                className="w-full bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-500 border border-yellow-500/50 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold mt-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                Trackgraph (Canciones)
              </Link>
            )}
          </div>
        </div>

        {/* Sistema de Valoración (1000 pts) */}
        <div className="w-full md:w-2/3 xl:w-3/4">
          <header className="mb-8">
            <h2 className="text-4xl font-extrabold text-white mb-2">Valoración Personal</h2>
            <p className="text-neutral-400 text-lg">Asigna una puntuación granular para calcular la nota final sobre 1000.</p>
          </header>
          
          {type !== 'album' && (
            <RatingForm type={type as any} mediaId={id} mediaData={media} />
          )}
        </div>
      </div>
    </div>
  );
}

import { getMediaDetails } from "@/app/actions/tmdb";
import { getEpisodeRatings } from "@/app/actions/episodes";
import { SeasonChartUI } from "@/components/SeasonChartUI";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function SeasonChartPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const show = await getMediaDetails(id, 'tv');
  const pastRatings = await getEpisodeRatings(id);

  return (
    <div className="animate-in fade-in duration-700 space-y-6">
      <Link href={`/rate/tv/${id}`} className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
        <ArrowLeft size={16} />
        <span>Volver a la serie</span>
      </Link>

      <div className="flex items-center gap-6 mb-8">
        <img 
          src={`https://image.tmdb.org/t/p/w200${show.poster_path}`} 
          alt={show.name}
          className="w-24 h-36 rounded-xl shadow-lg object-cover"
        />
        <div>
          <h1 className="text-4xl font-black text-white mb-2">{show.name}</h1>
          <p className="text-blue-400 text-lg">Evolución Episódica de Calidad</p>
        </div>
      </div>

      <SeasonChartUI tmdbId={id} seasons={show.seasons} pastRatings={pastRatings} />
    </div>
  );
}

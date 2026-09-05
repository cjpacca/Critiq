import { getAlbumTracks } from "@/app/actions/music";
import { getAlbumTrackRatings } from "@/app/actions/albums";
import { AlbumGraphUI } from "@/components/AlbumGraphUI";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function TrackgraphPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const album = await getAlbumTracks(id);
  const pastRatings = await getAlbumTrackRatings(id);

  return (
    <div className="animate-in fade-in duration-700 space-y-6">
      <Link href={`/rate/album/${id}`} className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
        <ArrowLeft size={16} />
        <span>Volver al Álbum</span>
      </Link>

      <div className="flex items-center gap-6 mb-8">
        <img 
          src={album.posterUrl} 
          alt={album.name}
          className="w-36 h-36 rounded-xl shadow-lg object-cover"
        />
        <div>
          <h1 className="text-4xl font-black text-white mb-2">{album.name}</h1>
          <p className="text-yellow-500 text-lg">Trackgraph - Evolución del Álbum</p>
        </div>
      </div>

      <AlbumGraphUI albumId={id} tracks={album.tracks} pastRatings={pastRatings} />
    </div>
  );
}

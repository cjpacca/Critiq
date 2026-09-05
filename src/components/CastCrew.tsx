import Image from "next/image";

export function CastCrew({ credits, creators }: { credits?: any, creators?: any[] }) {
  if (!credits) return null;

  const cast = credits.cast?.slice(0, 10) || [];
  
  // Find key crew members (Director, Writer)
  const directors = credits.crew?.filter((c: any) => c.job === 'Director') || [];
  const writers = credits.crew?.filter((c: any) => c.department === 'Writing' || c.job === 'Writer') || [];

  // Remove duplicates based on ID
  const uniqueDirectors = Array.from(new Map(directors.map((item: any) => [item.id, item])).values());
  const uniqueWriters = Array.from(new Map(writers.map((item: any) => [item.id, item])).values());

  return (
    <div className="mt-8 space-y-6">
      
      {/* Key Crew Section */}
      {(uniqueDirectors.length > 0 || uniqueWriters.length > 0 || (creators && creators.length > 0)) && (
        <div className="flex flex-wrap gap-6 bg-black/40 border border-white/10 rounded-2xl p-6">
          {creators && creators.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Creador</h4>
              <div className="flex flex-col gap-1">
                {creators.map((c: any) => (
                  <span key={c.id} className="text-white font-medium">{c.name}</span>
                ))}
              </div>
            </div>
          )}
          {uniqueDirectors.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Dirección</h4>
              <div className="flex flex-col gap-1">
                {(uniqueDirectors as any[]).map((d) => (
                  <span key={d.id} className="text-white font-medium">{d.name}</span>
                ))}
              </div>
            </div>
          )}
          {uniqueWriters.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Guion</h4>
              <div className="flex flex-col gap-1">
                {(uniqueWriters as any[]).slice(0, 3).map((w) => (
                  <span key={w.id} className="text-white font-medium">{w.name}</span>
                ))}
                {uniqueWriters.length > 3 && <span className="text-neutral-500 text-sm">+{uniqueWriters.length - 3} más</span>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cast Carousel */}
      {cast.length > 0 && (
        <div>
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Reparto Principal
          </h3>
          <div className="flex flex-col gap-3">
            {cast.map((actor: any) => (
              <div key={actor.id} className="flex items-center gap-3 bg-white/5 rounded-xl p-2 pr-4 border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-black/50 overflow-hidden flex-shrink-0 relative">
                  {actor.profile_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w276_and_h350_face${actor.profile_path}`} 
                      alt={actor.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 bg-black/40">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-bold truncate group-hover:text-blue-400 transition-colors">{actor.name}</h4>
                  <p className="text-neutral-400 text-xs truncate">{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

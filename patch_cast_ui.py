import re

with open("src/components/CastCrew.tsx", "r") as f:
    code = f.read()

# Replace the horizontal carousel with a vertical list
old_carousel = """          <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
            {cast.map((actor: any) => (
              <div key={actor.id} className="snap-start flex-shrink-0 w-[120px] group">
                <div className="w-[120px] h-[180px] bg-white/5 rounded-xl border border-white/10 overflow-hidden relative mb-3">
                  {actor.profile_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w276_and_h350_face${actor.profile_path}`} 
                      alt={actor.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="text-white text-sm font-bold leading-tight line-clamp-1">{actor.name}</h4>
                <p className="text-neutral-500 text-xs mt-1 line-clamp-2 leading-snug">{actor.character}</p>
              </div>
            ))}
          </div>"""

new_list = """          <div className="flex flex-col gap-3">
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
          </div>"""

code = code.replace(old_carousel, new_list)

with open("src/components/CastCrew.tsx", "w") as f:
    f.write(code)

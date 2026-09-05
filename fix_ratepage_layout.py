import re

with open("src/app/rate/[type]/[id]/page.tsx", "r") as f:
    code = f.read()

buttons_and_close = """
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

        {/* Sistema de Valoración (1000 pts) */}"""

code = code.replace("{/* Sistema de Valoración (1000 pts) */}", buttons_and_close)

with open("src/app/rate/[type]/[id]/page.tsx", "w") as f:
    f.write(code)

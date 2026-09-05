import re

with open("src/app/rate/[type]/[id]/page.tsx", "r") as f:
    code = f.read()

# Import
code = code.replace(
  'import { getGameDetails } from "@/app/actions/games";',
  'import { getGameDetails } from "@/app/actions/games";\nimport { getCommunityStats } from "@/app/actions/ratings";'
)

# Fetch stats
code = re.sub(
  r'(let tags: string\[\] = \[\];)',
  r'\1\n  const communityStats = await getCommunityStats(type, id);',
  code
)

# UI snippet
stats_ui = """
            {/* Panel de Estadísticas Globales de la Obra */}
            {communityStats && (
              <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Impacto Global (Usuarios)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-neutral-500 text-xs font-bold uppercase mb-1">Nota Promedio</p>
                    <p className="text-2xl font-black text-white">{communityStats._avg?.totalScore?.toFixed(0) || 0} <span className="text-sm text-neutral-500">/1000</span></p>
                    <p className="text-xs text-neutral-400 mt-1">De {communityStats._count?.id || 0} valoraciones</p>
                  </div>
                  
                  {type === 'game' && communityStats._avg?.playtimeHours && (
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-neutral-500 text-xs font-bold uppercase mb-1">Tiempo de Juego Medio</p>
                      <p className="text-2xl font-black text-green-400">{communityStats._avg.playtimeHours.toFixed(1)} <span className="text-sm text-neutral-500">h</span></p>
                    </div>
                  )}
                  {(type === 'tv' || type === 'movie') && communityStats._avg?.bingeDays && (
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-neutral-500 text-xs font-bold uppercase mb-1">Días de Maratón Medio</p>
                      <p className="text-2xl font-black text-blue-400">{communityStats._avg.bingeDays.toFixed(1)} <span className="text-sm text-neutral-500">días</span></p>
                    </div>
                  )}
                  {type === 'book' && communityStats._avg?.totalPages && (
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-neutral-500 text-xs font-bold uppercase mb-1">Páginas Promedio</p>
                      <p className="text-2xl font-black text-orange-400">{communityStats._avg.totalPages.toFixed(0)} <span className="text-sm text-neutral-500">pgs</span></p>
                    </div>
                  )}
                </div>
              </div>
            )}
"""

code = re.sub(
  r'(\{type === \'tv\' && \()',
  stats_ui + r'\n            \1',
  code
)

with open("src/app/rate/[type]/[id]/page.tsx", "w") as f:
    f.write(code)

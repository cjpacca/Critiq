import re

with open("src/components/RatingForm.tsx", "r") as f:
    code = f.read()

# Replace the block for Movie / TV to separate them correctly.
old_block = """            {/* Campos Específicos de Películas / Series */}
            {(type === 'movie' || type === 'tv') && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Medio / Plataforma</label>
                  <input type="text" value={extendedStats.viewingMedium} onChange={e => setExtendedStats({...extendedStats, viewingMedium: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Ej: Cine, Netflix, Stremio..." />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Compañía</label>
                  <input type="text" value={extendedStats.companions} onChange={e => setExtendedStats({...extendedStats, companions: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Ej: Solo, Pareja, Amigos..." />
                </div>
                {type === 'tv' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Punto de Abandono</label>
                    <input type="text" value={extendedStats.dropPoint} onChange={e => setExtendedStats({...extendedStats, dropPoint: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Ej: T2 E4" />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Días de Binge (Maratón)</label>
                  <input type="number" min="1" value={extendedStats.bingeDays} onChange={e => setExtendedStats({...extendedStats, bingeDays: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Ej: 3" />
                </div>
              </>
            )}"""

new_block = """            {/* Campos Específicos de Películas / Series */}
            {(type === 'movie' || type === 'tv') && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Medio / Plataforma</label>
                  <input type="text" value={extendedStats.viewingMedium} onChange={e => setExtendedStats({...extendedStats, viewingMedium: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Ej: Cine, Netflix, Stremio..." />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Compañía</label>
                  <input type="text" value={extendedStats.companions} onChange={e => setExtendedStats({...extendedStats, companions: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Ej: Solo, Pareja, Amigos..." />
                </div>
                {type === 'tv' && (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Punto de Abandono</label>
                      <input type="text" value={extendedStats.dropPoint} onChange={e => setExtendedStats({...extendedStats, dropPoint: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Ej: T2 E4" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Días de Maratón (Binge)</label>
                      <input type="number" min="1" value={extendedStats.bingeDays} onChange={e => setExtendedStats({...extendedStats, bingeDays: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Ej: 3" />
                    </div>
                  </>
                )}
              </>
            )}"""

code = code.replace(old_block, new_block)
with open("src/components/RatingForm.tsx", "w") as f:
    f.write(code)

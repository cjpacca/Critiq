import re

with open("src/components/RatingForm.tsx", "r") as f:
    code = f.read()

extended_ui = """
      {/* Extended Stats Section */}
      <div className="mt-8 border border-white/10 rounded-xl overflow-hidden bg-white/5 mb-6">
        <button 
          type="button" 
          onClick={() => setShowExtended(!showExtended)}
          className="w-full p-4 flex justify-between items-center text-left hover:bg-white/5 transition-colors"
        >
          <span className="font-bold text-white text-lg">Estadísticas Avanzadas (Opcional)</span>
          <span className="text-xl text-neutral-400">{showExtended ? '−' : '+'}</span>
        </button>
        
        {showExtended && (
          <div className="p-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Campos Globales */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Estado</label>
              <select 
                value={extendedStats.status}
                onChange={e => setExtendedStats({...extendedStats, status: e.target.value})}
                className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En progreso">En progreso</option>
                <option value="Completado">Completado</option>
                <option value="Abandonado">Abandonado</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Re-plays / Re-lecturas</label>
              <input 
                type="number" min="0"
                value={extendedStats.replayCount}
                onChange={e => setExtendedStats({...extendedStats, replayCount: e.target.value})}
                className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                placeholder="Ej: 2"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Fecha de Inicio</label>
              <input 
                type="date"
                value={extendedStats.startDate}
                onChange={e => setExtendedStats({...extendedStats, startDate: e.target.value})}
                className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Fecha de Fin</label>
              <input 
                type="date"
                value={extendedStats.endDate}
                onChange={e => setExtendedStats({...extendedStats, endDate: e.target.value})}
                className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                style={{ colorScheme: 'dark' }}
              />
            </div>

            {/* Campos Específicos de Juegos */}
            {type === 'game' && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Horas Jugadas</label>
                  <input type="number" step="0.1" value={extendedStats.playtimeHours} onChange={e => setExtendedStats({...extendedStats, playtimeHours: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Ej: 45.5" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Plataforma</label>
                  <input type="text" value={extendedStats.platform} onChange={e => setExtendedStats({...extendedStats, platform: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Ej: PS5, PC, Switch..." />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Completado</label>
                  <select value={extendedStats.completionTier} onChange={e => setExtendedStats({...extendedStats, completionTier: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500">
                    <option value="">Seleccionar...</option>
                    <option value="Solo Historia">Solo Historia</option>
                    <option value="Historia + Extras">Historia + Extras</option>
                    <option value="100% / Platino">100% / Platino</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Logros (%)</label>
                  <input type="number" min="0" max="100" value={extendedStats.achievementsPct} onChange={e => setExtendedStats({...extendedStats, achievementsPct: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Ej: 85" />
                </div>
              </>
            )}

            {/* Campos Específicos de Películas / Series */}
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
            )}

            {/* Campos Específicos de Libros */}
            {type === 'book' && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Páginas Totales</label>
                  <input type="number" min="1" value={extendedStats.totalPages} onChange={e => setExtendedStats({...extendedStats, totalPages: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Ej: 350" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Formato</label>
                  <select value={extendedStats.bookFormat} onChange={e => setExtendedStats({...extendedStats, bookFormat: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500">
                    <option value="">Seleccionar...</option>
                    <option value="Físico">Físico</option>
                    <option value="Kindle/E-Reader">Kindle / E-Reader</option>
                    <option value="PDF/Digital">PDF / Digital</option>
                    <option value="Audiolibro">Audiolibro</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Idioma de Lectura</label>
                  <input type="text" value={extendedStats.language} onChange={e => setExtendedStats({...extendedStats, language: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Ej: Español, Inglés..." />
                </div>
              </>
            )}
            
            {/* Campos Específicos de Música */}
            {type === 'track' && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Reproducciones</label>
                  <input type="number" min="1" value={extendedStats.playCount} onChange={e => setExtendedStats({...extendedStats, playCount: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Ej: 45" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Vibra (Valence)</label>
                  <input type="text" value={extendedStats.valence} onChange={e => setExtendedStats({...extendedStats, valence: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Ej: Triste, Enérgico, Chill..." />
                </div>
              </>
            )}

          </div>
        )}
      </div>
"""

pattern = r'(<button\s+type="submit"\s+disabled=\{isSaving\})'
code = re.sub(pattern, extended_ui + r'\n      \1', code)

with open("src/components/RatingForm.tsx", "w") as f:
    f.write(code)

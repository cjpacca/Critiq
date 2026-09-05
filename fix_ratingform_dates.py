import re

with open("src/components/RatingForm.tsx", "r") as f:
    code = f.read()

# Hide start/end date for games
old_dates = """            <div className="flex flex-col gap-2">
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
            </div>"""

new_dates = """            {type !== 'game' && type !== 'movie' && (
              <>
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
              </>
            )}"""

code = code.replace(old_dates, new_dates)

with open("src/components/RatingForm.tsx", "w") as f:
    f.write(code)

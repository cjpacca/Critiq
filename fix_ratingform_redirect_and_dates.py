import re

with open("src/components/RatingForm.tsx", "r") as f:
    code = f.read()

# Add isSuccess state
code = code.replace("const [isSaving, setIsSaving] = useState(false);", "const [isSaving, setIsSaving] = useState(false);\n  const [isSuccess, setIsSuccess] = useState(false);")

# Remove redirect and show success
save_logic = """
      await saveRating(type, mediaData, scores, extendedStats);
      setIsSuccess(true);
      router.refresh();
      setTimeout(() => setIsSuccess(false), 4000);
"""
code = re.sub(r'await saveRating\(type, mediaData, scores, extendedStats\);\s*router\.push\(\'\/\'\);\s*router\.refresh\(\);', save_logic, code)

# Button UI logic
btn_logic = """
      {isSuccess && (
        <div className="mt-4 p-4 rounded-xl bg-green-500/20 border border-green-500 text-green-400 text-center font-bold">
          ¡Valoración guardada correctamente!
        </div>
      )}
      <button 
        type="submit" 
"""
code = code.replace("<button \n        type=\"submit\"", btn_logic)


# Fix Dates logic (Hide for movies and games)
dates_block_old = """
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
            </div>"""

dates_block_new = """
            {type !== 'movie' && type !== 'game' && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Fecha de Inicio</label>
                  <input type="date" value={extendedStats.startDate} onChange={e => setExtendedStats({...extendedStats, startDate: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" style={{ colorScheme: 'dark' }} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Fecha de Fin</label>
                  <input type="date" value={extendedStats.endDate} onChange={e => setExtendedStats({...extendedStats, endDate: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" style={{ colorScheme: 'dark' }} />
                </div>
              </>
            )}"""

code = code.replace(dates_block_old, dates_block_new)

# Add playDays for Games
game_block_old = """
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Horas Jugadas</label>"""
game_block_new = """
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Días Jugados</label>
                  <input type="number" min="1" value={extendedStats.playDays || ""} onChange={e => setExtendedStats({...extendedStats, playDays: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Ej: 14" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Horas Jugadas</label>"""

code = code.replace(game_block_old, game_block_new)

with open("src/components/RatingForm.tsx", "w") as f:
    f.write(code)

import re

with open("src/app/page.tsx", "r") as f:
    code = f.read()

# Add aggregated queries
aggregated_queries = """
  // Aggregated Stats
  const gameStats = await prisma.gameRating.aggregate({ _sum: { playtimeHours: true }, _avg: { totalScore: true } });
  const bookStats = await prisma.bookRating.aggregate({ _sum: { totalPages: true }, _avg: { totalScore: true } });
  const seriesStats = await prisma.seriesRating.aggregate({ _sum: { bingeDays: true }, _avg: { totalScore: true } });
  const movieStats = await prisma.movieRating.aggregate({ _avg: { totalScore: true } });
  const musicStats = await prisma.musicRating.aggregate({ _avg: { totalScore: true } });
"""

code = code.replace("  // Colores distintivos por módulo", aggregated_queries + "\n  // Colores distintivos por módulo")

# Create a new section for User Global Analytics
analytics_section = """
      {/* Panel de Estadísticas Globales (Fase 8) */}
      <section className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl -z-10" />
        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
          <Star className="text-yellow-400" /> Mi Vida en Estadísticas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
            <p className="text-neutral-400 text-sm font-bold uppercase mb-1 tracking-wider">Horas de Juego</p>
            <p className="text-3xl font-black text-green-400">{gameStats._sum.playtimeHours?.toFixed(1) || 0} <span className="text-lg text-neutral-500">h</span></p>
            <p className="text-xs text-neutral-500 mt-2">Promedio: {gameStats._avg.totalScore?.toFixed(0) || 0}/1000 pts</p>
          </div>
          <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
            <p className="text-neutral-400 text-sm font-bold uppercase mb-1 tracking-wider">Páginas Leídas</p>
            <p className="text-3xl font-black text-orange-400">{bookStats._sum.totalPages || 0}</p>
            <p className="text-xs text-neutral-500 mt-2">Promedio: {bookStats._avg.totalScore?.toFixed(0) || 0}/1000 pts</p>
          </div>
          <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
            <p className="text-neutral-400 text-sm font-bold uppercase mb-1 tracking-wider">Días de Binge (Series)</p>
            <p className="text-3xl font-black text-blue-400">{seriesStats._sum.bingeDays || 0}</p>
            <p className="text-xs text-neutral-500 mt-2">Promedio: {seriesStats._avg.totalScore?.toFixed(0) || 0}/1000 pts</p>
          </div>
          <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
            <p className="text-neutral-400 text-sm font-bold uppercase mb-1 tracking-wider">Promedio Películas</p>
            <p className="text-3xl font-black text-purple-400">{movieStats._avg.totalScore?.toFixed(0) || 0}</p>
            <p className="text-xs text-neutral-500 mt-2">Score Global (0-1000)</p>
          </div>
        </div>
      </section>
"""

code = code.replace("{/* Stats Grid */}", analytics_section + "\n      {/* Stats Grid */}")

with open("src/app/page.tsx", "w") as f:
    f.write(code)

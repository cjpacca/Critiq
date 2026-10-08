import re

with open("src/components/SearchUI.tsx", "r") as f:
    code = f.read()

old_form_pattern = r'<form onSubmit=\{handleSearch\}.*?<\/form>'

new_form = """<div className="flex flex-col gap-6 mb-12">
        {/* Barra de Búsqueda Fluida */}
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-white transition-colors" size={24} />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="¿Qué quieres valorar hoy?..." 
              className="w-full bg-white/5 border border-white/10 pl-16 pr-6 py-5 rounded-3xl text-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all shadow-xl"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-white text-black px-10 py-5 rounded-3xl font-black text-lg hover:bg-neutral-200 hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center min-w-[140px]"
          >
            {loading ? <Loader2 className="animate-spin" size={28} /> : "Buscar"}
          </button>
        </form>

        {/* Filtros Interactivos Tipo Píldora */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-neutral-500 mr-2 uppercase tracking-wider">Filtrar por:</span>
          {[
            { id: 'multi', label: 'Cine & TV', icon: Popcorn, color: 'text-purple-400', bg: 'hover:bg-purple-500/20 hover:border-purple-500/50', active: 'bg-purple-500/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' },
            { id: 'movie', label: 'Películas', icon: Film, color: 'text-pink-400', bg: 'hover:bg-pink-500/20 hover:border-pink-500/50', active: 'bg-pink-500/20 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]' },
            { id: 'tv', label: 'Series', icon: Tv, color: 'text-blue-400', bg: 'hover:bg-blue-500/20 hover:border-blue-500/50', active: 'bg-blue-500/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]' },
            { id: 'game', label: 'Juegos', icon: Gamepad2, color: 'text-green-400', bg: 'hover:bg-green-500/20 hover:border-green-500/50', active: 'bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' },
            { id: 'book', label: 'Libros', icon: BookOpen, color: 'text-orange-400', bg: 'hover:bg-orange-500/20 hover:border-orange-500/50', active: 'bg-orange-500/20 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' },
            { id: 'track', label: 'Canciones', icon: Music, color: 'text-yellow-400', bg: 'hover:bg-yellow-500/20 hover:border-yellow-500/50', active: 'bg-yellow-500/20 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]' },
            { id: 'album', label: 'Álbumes', icon: Disc, color: 'text-amber-400', bg: 'hover:bg-amber-500/20 hover:border-amber-500/50', active: 'bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.4)]' }
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = filter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilter(cat.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 transition-all font-bold ${isActive ? cat.active + ' ' + cat.color : 'bg-white/5 text-neutral-400 ' + cat.bg}`}
              >
                <Icon size={16} className={isActive ? cat.color : ''} />
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>"""

code = re.sub(old_form_pattern, new_form, code, flags=re.DOTALL)

with open("src/components/SearchUI.tsx", "w") as f:
    f.write(code)

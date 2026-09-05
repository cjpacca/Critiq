"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveRating } from "@/app/actions/ratings";

const MOVIE_CATEGORIES = [
  { id: "inmersion", label: "Inmersión", max: 150 },
  { id: "impacto", label: "Impacto", max: 150 },
  { id: "ritmo", label: "Ritmo", max: 100 },
  { id: "personajes", label: "Personajes", max: 150 },
  { id: "rewatch", label: "Re-Watch", max: 100 },
  { id: "satisfaccion", label: "Satisfacción", max: 100 },
  { id: "audiovisual", label: "Audiovisual", max: 100 },
  { id: "trama", label: "Trama", max: 150 },
];

const TV_CATEGORIES = [
  { id: "enganche", label: "Enganche", max: 150 },
  { id: "personajes", label: "Personajes", max: 150 },
  { id: "impacto", label: "Impacto", max: 100 },
  { id: "diversion", label: "Diversión", max: 150 },
  { id: "trama", label: "Trama", max: 100 },
  { id: "historia", label: "Historia", max: 100 },
  { id: "final", label: "Final", max: 75 },
  { id: "ritmo", label: "Ritmo", max: 75 },
  { id: "soundtrack", label: "Soundtrack", max: 50 },
  { id: "escenografia", label: "Escenografía", max: 50 },
];

const MUSIC_CATEGORIES = [
  { id: "impactoEmocional", label: "Impacto Emocional", max: 250 },
  { id: "replay", label: "Replay", max: 200 },
  { id: "melodia", label: "Melodía", max: 200 },
  { id: "letra", label: "Letra", max: 150 },
  { id: "vocesInstrumental", label: "Voces/Instrumental", max: 100 },
  { id: "originalidad", label: "Originalidad", max: 100 },
];

const BOOK_CATEGORIES = [
  { id: "adiccion", label: "Adicción", max: 200 },
  { id: "conexionPersonajes", label: "Conexión Personajes", max: 175 },
  { id: "fluidezLectura", label: "Fluidez Lectura", max: 125 },
  { id: "historia", label: "Historia", max: 125 },
  { id: "mundo", label: "Construcción de Mundo", max: 75 },
  { id: "ritmo", label: "Ritmo", max: 100 },
  { id: "impacto", label: "Impacto", max: 100 },
  { id: "final", label: "Final", max: 100 },
];


const GAME_CATEGORIES = [
  { id: "jugabilidad", label: "Jugabilidad", max: 100 },
  { id: "adiccion", label: "Adicción", max: 100 },
  { id: "disenoNiveles", label: "Diseño Niveles", max: 75 },
  { id: "arte", label: "Arte visual", max: 75 },
  { id: "historia", label: "Historia", max: 75 },
  { id: "inmersion", label: "Inmersión", max: 75 },
  { id: "sonido", label: "Sonido/OST", max: 75 },
  { id: "impacto", label: "Impacto", max: 75 },
  { id: "dificultad", label: "Dificultad", max: 50 },
  { id: "rejugabilidad", label: "Rejugabilidad", max: 50 },
  { id: "rendimiento", label: "Rendimiento", max: 50 },
  { id: "personajes", label: "Personajes", max: 50 },
  { id: "detalle", label: "Detalle", max: 50 },
  { id: "mecanicas", label: "Mecánicas", max: 50 },
  { id: "ia", label: "IA", max: 50 },
];

export function RatingForm({ type, mediaId, mediaData }: { type: 'movie'|'tv'|'track'|'book'|'game', mediaId: string, mediaData: any }) {
  const router = useRouter();
  
  const categories = type === 'movie' ? MOVIE_CATEGORIES : type === 'tv' ? TV_CATEGORIES : type === 'track' ? MUSIC_CATEGORIES : type === 'game' ? GAME_CATEGORIES : BOOK_CATEGORIES;
  const accentColor = type === 'movie' ? 'accent-purple-500' : type === 'tv' ? 'accent-blue-500' : type === 'track' ? 'accent-yellow-500' : type === 'game' ? 'accent-green-500' : 'accent-orange-500';
  const buttonColor = type === 'movie' ? 'from-purple-600 to-pink-600' : type === 'tv' ? 'from-blue-600 to-cyan-600' : type === 'track' ? 'from-yellow-600 to-orange-600' : type === 'game' ? 'from-green-600 to-emerald-600' : 'from-orange-600 to-amber-600';
  
  const [scores, setScores] = useState<Record<string, number>>(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: Math.floor(cat.max / 2) }), {})
  );
  const [review, setReview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [extendedStats, setExtendedStats] = useState<any>({
    status: "Completado",
    startDate: "",
    endDate: "",
    replayCount: 0,
    bingeDays: "",
    viewingMedium: "",
    dropPoint: "",
    companions: "",
    playtimeHours: "",
    completionTier: "",
    platform: "",
    difficulty: "",
    achievementsPct: "",
    playCount: "",
    bpm: "",
    valence: "",
    discoveryMonth: "",
    totalPages: "",
    pagesPerDay: "",
    bookFormat: "",
    language: ""
  });
  const [showExtended, setShowExtended] = useState(false);


  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleScoreChange = (id: string, val: number) => {
    setScores(prev => ({ ...prev, [id]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      
      await saveRating(type, mediaData, scores, extendedStats);
      setIsSuccess(true);
      router.refresh();
      setTimeout(() => setIsSaving(false), 500);
      setTimeout(() => setIsSuccess(false), 4000);

    } catch(err) {
      console.error(err);
      setIsSaving(false);
      alert("Hubo un error al guardar.");
    }
  };

  return (
    <form onSubmit={handleSave} className="glass-card p-8 flex flex-col gap-8">
      {/* Marcador Total */}
      <div className="flex items-center justify-between border-b border-white/10 pb-8">
        <div>
          <h3 className="text-xl font-bold text-neutral-300">Puntaje Final</h3>
          <p className="text-sm text-neutral-500">Calculado automáticamente</p>
        </div>
        <div className="text-right">
          <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
            {totalScore}
          </span>
          <span className="text-2xl text-neutral-500 font-bold">/1000</span>
        </div>
      </div>

      {/* Sliders de Categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {categories.map((cat) => (
          <div key={cat.id} className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-white font-medium">{cat.label}</label>
              <span className="bg-white/10 px-3 py-1 rounded-lg text-sm font-bold font-mono text-white">
                {scores[cat.id]} <span className="text-neutral-500 text-xs">/ {cat.max}</span>
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={cat.max} 
              value={scores[cat.id]} 
              onChange={(e) => handleScoreChange(cat.id, parseInt(e.target.value))}
              className={`w-full ${accentColor} h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer`}
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label className="text-white font-medium mb-3 block">Reseña o notas personales (Opcional)</label>
        <textarea 
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Escribe lo que te pareció..."
          className="w-full glass bg-white/5 p-4 rounded-xl text-white placeholder:text-neutral-500 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>

      
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
            )}

            {/* Campos Específicos de Juegos */}
            {type === 'game' && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Días Jugados</label>
                  <input type="number" min="1" value={extendedStats.playDays || ""} onChange={e => setExtendedStats({...extendedStats, playDays: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Ej: 14" />
                </div>
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

      
      {isSuccess && (
        <div className="mt-4 p-4 rounded-xl bg-green-500/20 border border-green-500 text-green-400 text-center font-bold">
          ¡Valoración guardada correctamente!
        </div>
      )}
      <button 
        type="submit" 
 
        disabled={isSaving}
        className={`w-full py-5 rounded-2xl bg-gradient-to-r ${buttonColor} text-white font-bold text-lg hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isSaving ? <Loader2 className="animate-spin" /> : "Guardar Valoración"}
      </button>
    </form>
  );
}

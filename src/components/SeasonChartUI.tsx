
"use client";

import { useState, useEffect, useMemo } from "react";
import { getTvSeasonDetails } from "@/app/actions/tmdb";
import { saveEpisodeRating } from "@/app/actions/episodes";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, Check } from "lucide-react";

const SCORE_COLORS = [
  [239, 68, 68],   // 0: Rojo oscuro
  [249, 115, 22],  // 1: Naranja oscuro
  [249, 168, 21],  // 2: Naranja
  [234, 179, 8],   // 3: Amarillo oscuro
  [253, 224, 71],  // 4: Amarillo
  [163, 230, 53],  // 5: Lima
  [34, 197, 94],   // 6: Verde
  [16, 185, 129],  // 7: Esmeralda
  [6, 182, 212],   // 8: Cian
  [59, 130, 246],  // 9: Azul
  [37, 99, 235]    // 10: Azul profundo
];

function getColorForScore(score: number | undefined) {
  if (score === undefined || score === null) return 'rgba(255, 255, 255, 0.03)';
  const lower = Math.floor(score);
  const upper = Math.ceil(score);
  if (lower >= 10) return `rgb(${SCORE_COLORS[10].join(',')})`;
  if (lower < 0) return `rgb(${SCORE_COLORS[0].join(',')})`;
  if (lower === upper) return `rgb(${SCORE_COLORS[lower].join(',')})`;

  const fraction = score - lower;
  const c1 = SCORE_COLORS[lower];
  const c2 = SCORE_COLORS[upper];
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * fraction);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * fraction);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * fraction);
  return `rgb(${r}, ${g}, ${b})`;
}

export function SeasonChartUI({ tmdbId, seasons, pastRatings }: { tmdbId: string, seasons: any[], pastRatings: any[] }) {
  const validSeasons = seasons.filter(s => s.season_number > 0);
  const [activeSeason, setActiveSeason] = useState(validSeasons[0]?.season_number || 1);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    pastRatings.forEach(r => {
      map[`S${r.seasonNum}E${r.episodeNum}`] = r.score;
    });
    return map;
  });

  useEffect(() => {
    async function loadSeason() {
      setLoading(true);
      try {
        const data = await getTvSeasonDetails(tmdbId, activeSeason);
        setEpisodes(data.episodes || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadSeason();
  }, [tmdbId, activeSeason]);

  const handleRatingChange = (episodeNum: number, value: number) => {
    const key = `S${activeSeason}E${episodeNum}`;
    setRatings(prev => ({ ...prev, [key]: value }));
  };

  const saveRating = async (episodeNum: number) => {
    const key = `S${activeSeason}E${episodeNum}`;
    const score = ratings[key];
    if (score === undefined) return;
    
    setSaving(key);
    try {
      await saveEpisodeRating(tmdbId, activeSeason, episodeNum, score);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setSaving(null), 1000);
    }
  };

  const chartData = useMemo(() => {
    const data: any[] = [];
    const keys = Object.keys(ratings).sort((a, b) => {
      const matchA = a.match(/S(\d+)E(\d+)/);
      const matchB = b.match(/S(\d+)E(\d+)/);
      if (!matchA || !matchB) return 0;
      const sA = parseInt(matchA[1]), eA = parseInt(matchA[2]);
      const sB = parseInt(matchB[1]), eB = parseInt(matchB[2]);
      if (sA !== sB) return sA - sB;
      return eA - eB;
    });

    keys.forEach(k => {
      data.push({ name: k, score: ratings[k] });
    });
    return data;
  }, [ratings]);

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null) return null;
    return (
      <circle cx={cx} cy={cy} r={4} fill={getColorForScore(payload.score)} stroke="#000" strokeWidth={2} />
    );
  };

  // Calcular max episodes para la tabla
  const maxEpisodes = Math.max(...validSeasons.map(s => s.episode_count || 0), 1);
  const rows = Array.from({ length: maxEpisodes }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-8">
      {/* Selector de Temporadas */}
      <div className="flex flex-wrap gap-2">
        {validSeasons.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSeason(s.season_number)}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${activeSeason === s.season_number ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 'bg-white/5 text-neutral-400 hover:bg-white/10'}`}
          >
            Temporada {s.season_number}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Columna Izquierda: Gráfica Recharts */}
        <div className="glass-card p-6 h-[500px] flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">Progresión Global (Serie)</h3>
          {chartData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-neutral-500 text-sm">
              Valora episodios para generar la gráfica
            </div>
          ) : (
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="rgb(239, 68, 68)" />
                      <stop offset="25%" stopColor="rgb(249, 168, 21)" />
                      <stop offset="50%" stopColor="rgb(163, 230, 53)" />
                      <stop offset="75%" stopColor="rgb(16, 185, 129)" />
                      <stop offset="100%" stopColor="rgb(37, 99, 235)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickMargin={10} />
                  <YAxis domain={[0, 10]} stroke="rgba(255,255,255,0.3)" fontSize={11} tickCount={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="url(#scoreGradient)" 
                    strokeWidth={4} 
                    dot={<CustomDot />}
                    activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2, fill: '#000' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Columna Derecha: Valorar Episodios (Temporada Activa) */}
        <div className="glass-card p-6 flex flex-col h-[500px]">
          <h3 className="text-xl font-bold text-white mb-4">Valorar T{activeSeason}</h3>
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {episodes.map(ep => {
                const key = `S${activeSeason}E${ep.episode_number}`;
                const score = ratings[key] !== undefined ? ratings[key] : 5.00;
                const isSaving = saving === key;

                return (
                  <div key={ep.id} className="bg-black/20 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-white font-bold leading-tight">
                          <span className="text-blue-400 mr-2">{ep.episode_number}.</span>
                          {ep.name}
                        </h4>
                        <p className="text-neutral-500 text-xs mt-1">{ep.air_date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <input 
                        type="range"
                        min="0"
                        max="10"
                        step="0.01"
                        value={score}
                        onChange={(e) => handleRatingChange(ep.episode_number, parseFloat(e.target.value))}
                        className="flex-1 accent-blue-500 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <input 
                        type="number"
                        min="0"
                        max="10"
                        step="0.01"
                        value={score}
                        onChange={(e) => handleRatingChange(ep.episode_number, parseFloat(e.target.value) || 0)}
                        className="w-20 font-black text-xl text-center text-white bg-black/50 border border-white/10 rounded-lg p-1 focus:outline-none focus:border-blue-500"
                      />
                      
                      <button
                        onClick={() => saveRating(ep.episode_number)}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors flex items-center justify-center w-10 h-10 shrink-0"
                      >
                        {isSaving ? <Check size={18} /> : '✓'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Heatmap Table */}
      <div className="glass-card p-6 overflow-x-auto custom-scrollbar">
        <h3 className="text-xl font-bold text-white mb-6">Heatmap de la Serie (Todas las Temporadas)</h3>
        
        <table className="w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-neutral-500 font-bold border-b border-white/10">EP</th>
              {validSeasons.map(s => (
                <th key={s.id} className="p-3 text-white font-black border-b border-white/10 min-w-[60px]">
                  T{s.season_number}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(ep => (
              <tr key={ep} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-3 text-neutral-500 font-bold">{ep}</td>
                {validSeasons.map(s => {
                  const sNum = s.season_number;
                  // Si este episodio existe en esta temporada
                  if (ep > (s.episode_count || 0)) {
                    return <td key={s.id} className="p-3"></td>; // Celda vacía
                  }
                  
                  const score = ratings[`S${sNum}E${ep}`];
                  const bgColor = getColorForScore(score);
                  
                  return (
                    <td key={s.id} className="p-1">
                      <div 
                        className="w-full h-10 rounded-md flex items-center justify-center font-black text-sm text-white/90 shadow-inner"
                        style={{ backgroundColor: bgColor }}
                        title={score !== undefined ? `T${sNum} E${ep}: ${score}` : 'Sin valorar'}
                      >
                        {score !== undefined ? score.toFixed(2) : '-'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

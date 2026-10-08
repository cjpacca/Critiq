"use client";

import { useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine } from "recharts";
const SCORE_COLORS = [
  [75, 85, 99],    // 0: Gris Oscuro
  [156, 163, 175], // 1: Gris
  [200, 130, 150], // 2: Rosa apagado
  [255, 255, 255], // 3: Blanco
  [249, 115, 22],  // 4: Naranja
  [239, 68, 68],   // 5: Rojo
  [168, 85, 247],  // 6: Morado
  [234, 179, 8],   // 7: Amarillo Mostaza
  [59, 130, 246],  // 8: Azul
  [0, 229, 255],   // 9: Aqua Brillante
  [34, 197, 94]    // 10: Verde
];

function getColorForScore(score: number | undefined) {
  if (score === undefined || score === null) return 'rgba(255, 255, 255, 0.03)';
  const normalized = score / 100; // Maps 0-1000 to 0-10
  const lower = Math.floor(normalized);
  const upper = Math.ceil(normalized);
  if (lower >= 10) return `rgb(${SCORE_COLORS[10].join(',')})`;
  if (lower < 0) return `rgb(${SCORE_COLORS[0].join(',')})`;
  if (lower === upper) return `rgb(${SCORE_COLORS[lower].join(',')})`;
  
  const weight = normalized - lower;
  const r = Math.round(SCORE_COLORS[lower][0] * (1 - weight) + SCORE_COLORS[upper][0] * weight);
  const g = Math.round(SCORE_COLORS[lower][1] * (1 - weight) + SCORE_COLORS[upper][1] * weight);
  const b = Math.round(SCORE_COLORS[lower][2] * (1 - weight) + SCORE_COLORS[upper][2] * weight);
  return `rgb(${r}, ${g}, ${b})`;
}

export function GameScatterPlot({ games }: { games: any[] }) {
  const chartData = useMemo(() => {
    return games.map(g => ({
      id: g.id,
      title: g.game.title,
      poster: g.game.posterUrl,
      // Dificultad is out of 50. Let's map it to 0-100 for easier reading.
      difficulty: (g.dificultad || 0) * 2, 
      score: g.totalScore || 0,
      playtime: g.playtimeHours || 0,
    })).filter(g => g.difficulty > 0 || g.score > 0);
  }, [games]);

  if (chartData.length === 0) return null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/90 border border-white/10 rounded-xl p-3 shadow-2xl flex items-center gap-4 min-w-[200px] backdrop-blur-md">
          {data.poster && (
            <img src={data.poster} alt={data.title} className="w-12 h-16 object-cover rounded-md shadow-lg" />
          )}
          <div>
            <h4 className="text-white font-bold text-sm leading-tight mb-1">{data.title}</h4>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-neutral-400">
                Puntuación: <span className="text-white font-black" style={{ color: getColorForScore(data.score) }}>{data.score}</span>
              </span>
              <span className="text-xs font-medium text-neutral-400">
                Dificultad: <span className="text-white font-black">{data.difficulty}%</span>
              </span>
              {data.playtime > 0 && (
                <span className="text-xs font-medium text-neutral-400">
                  Tiempo: <span className="text-white font-black">{data.playtime}h</span>
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 border border-green-500/20 rounded-3xl relative overflow-hidden group mb-8">
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full pointer-events-none transition-all duration-700" />
      
      <div className="mb-6 z-10 relative">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4"/><path d="M8 10v4"/><circle cx="15" cy="13" r="1"/><circle cx="18" cy="11" r="1"/></svg>
          Radar de Dificultad vs Satisfacción
        </h3>
        <p className="text-xs text-neutral-400 font-bold tracking-widest uppercase mt-1">¿Los juegos más difíciles te gustan más?</p>
      </div>

      <div className="w-full h-[350px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              type="number" 
              dataKey="difficulty" 
              name="Dificultad" 
              domain={[0, 100]} 
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }}
              tickFormatter={(val) => `${val}%`}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              type="number" 
              dataKey="score" 
              name="Puntuación" 
              domain={[0, 1000]} 
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }}
              axisLine={false}
              tickLine={false}
            />
            <ZAxis type="number" dataKey="playtime" range={[60, 400]} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(34,197,94,0.3)' }} />
            
            <ReferenceLine x={50} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
            <ReferenceLine y={500} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />

            <Scatter data={chartData} animationDuration={1500}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getColorForScore(entry.score)} 
                  stroke="rgba(0,0,0,0.8)"
                  strokeWidth={1.5}
                  className="hover:opacity-100 hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] transition-all duration-300 cursor-pointer"
                  style={{ opacity: 0.8 }}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      {/* Labels for Quadrants */}
      <div className="absolute bottom-6 left-12 text-[10px] font-black text-white/20 uppercase tracking-widest pointer-events-none">Paseo / Malos</div>
      <div className="absolute top-20 left-12 text-[10px] font-black text-white/20 uppercase tracking-widest pointer-events-none">Paseo / Joyas</div>
      <div className="absolute bottom-6 right-8 text-[10px] font-black text-white/20 uppercase tracking-widest pointer-events-none">Frustrantes</div>
      <div className="absolute top-20 right-8 text-[10px] font-black text-white/20 uppercase tracking-widest pointer-events-none">Retos Maestros</div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { saveAlbumTrackRating } from "@/app/actions/albums";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Check } from "lucide-react";

const SCORE_COLORS = [
  [239, 68, 68],   // 0
  [249, 115, 22],  // 1
  [249, 168, 21],  // 2
  [234, 179, 8],   // 3
  [253, 224, 71],  // 4
  [163, 230, 53],  // 5
  [34, 197, 94],   // 6
  [16, 185, 129],  // 7
  [6, 182, 212],   // 8
  [59, 130, 246],  // 9
  [37, 99, 235]    // 10
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

export function AlbumGraphUI({ albumId, tracks, pastRatings }: { albumId: string, tracks: any[], pastRatings: any[] }) {
  const [saving, setSaving] = useState<number | null>(null);
  
  const [ratings, setRatings] = useState<Record<number, number>>(() => {
    const map: Record<number, number> = {};
    pastRatings.forEach(r => {
      map[r.trackNum] = r.score;
    });
    return map;
  });

  const handleRatingChange = (trackNum: number, value: number) => {
    setRatings(prev => ({ ...prev, [trackNum]: value }));
  };

  const saveRating = async (trackNum: number) => {
    const score = ratings[trackNum];
    if (score === undefined) return;
    
    setSaving(trackNum);
    try {
      await saveAlbumTrackRating(albumId, trackNum, score);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setSaving(null), 1000);
    }
  };

  const chartData = useMemo(() => {
    return tracks.map(t => ({
      name: `Track ${t.trackNumber}`,
      score: ratings[t.trackNumber]
    })).filter(t => t.score !== undefined);
  }, [ratings, tracks]);

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null) return null;
    return (
      <circle cx={cx} cy={cy} r={4} fill={getColorForScore(payload.score)} stroke="#000" strokeWidth={2} />
    );
  };

  const ratedScores = Object.values(ratings);
  const albumAverage = ratedScores.length > 0 
    ? (ratedScores.reduce((a, b) => a + b, 0) / ratedScores.length)
    : undefined;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Columna Izquierda: Gráfica Recharts */}
        <div className="glass-card p-6 h-[550px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Curva del Álbum</h3>
            {albumAverage !== undefined && (
              <div className="flex items-center gap-3 bg-black/40 px-3 py-2 rounded-xl border border-white/10">
                <span className="text-neutral-400 text-sm font-medium uppercase tracking-wider">Nota Media</span>
                <div 
                  className="px-4 py-1 rounded-lg font-black text-white shadow-lg border border-white/20"
                  style={{ backgroundColor: getColorForScore(albumAverage) }}
                >
                  {albumAverage.toFixed(2)}
                </div>
              </div>
            )}
          </div>
          {chartData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-neutral-500 text-sm">
              Valora canciones para generar la gráfica
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
                    formatter={(value: any) => [<span style={{color: getColorForScore(value)}}>{value.toFixed(2)}</span>, 'Puntuación']}
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

        {/* Columna Derecha: Lista de Tracks */}
        <div className="glass-card p-6 flex flex-col h-[550px]">
          <h3 className="text-xl font-bold text-white mb-4">Tracklist</h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {tracks.map(t => {
              const score = ratings[t.trackNumber] !== undefined ? ratings[t.trackNumber] : 5.00;
              const isSaving = saving === t.trackNumber;

              return (
                <div key={t.id} className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-white font-bold leading-tight">
                        <span className="text-yellow-500 mr-2">{t.trackNumber}.</span>
                        {t.name}
                      </h4>
                      <p className="text-neutral-500 text-xs mt-1">
                        {Math.floor(t.duration_ms / 60000)}:{((t.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <input 
                      type="range"
                      min="0"
                      max="10"
                      step="0.01"
                      value={score}
                      onChange={(e) => handleRatingChange(t.trackNumber, parseFloat(e.target.value))}
                      className="flex-1 accent-yellow-500 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <input 
                      type="number"
                      min="0" max="10" step="0.01"
                      value={score}
                      onChange={(e) => handleRatingChange(t.trackNumber, parseFloat(e.target.value) || 0)}
                      className="w-20 font-black text-xl text-center text-white bg-black/50 border border-white/10 rounded-lg p-1 focus:outline-none focus:border-yellow-500"
                    />
                    
                    <button
                      onClick={() => saveRating(t.trackNumber)}
                      className="bg-yellow-600 hover:bg-yellow-500 text-black font-black p-2 rounded-lg transition-colors flex items-center justify-center w-10 h-10 shrink-0"
                    >
                      {isSaving ? <Check size={18} /> : '✓'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Heatmap 1D Strip */}
      <div className="glass-card p-6 overflow-x-auto custom-scrollbar">
        <h3 className="text-xl font-bold text-white mb-6">Mapa de Calor del Álbum</h3>
        <div className="flex gap-2">
          {tracks.map(t => {
            const score = ratings[t.trackNumber];
            const bgColor = getColorForScore(score);
            return (
              <div 
                key={t.id} 
                className="flex flex-col items-center gap-2 min-w-[60px]"
                title={score !== undefined ? `${t.name}: ${score.toFixed(2)}` : t.name}
              >
                <div className="text-neutral-500 font-bold text-xs">Pista {t.trackNumber}</div>
                <div 
                  className="w-full h-10 rounded-md flex items-center justify-center font-black text-sm text-white/90 shadow-inner"
                  style={{ backgroundColor: bgColor }}
                >
                  {score !== undefined ? score.toFixed(2) : '-'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

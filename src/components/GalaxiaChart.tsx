"use client";

import { useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface GalaxyItem {
  id: string;
  type: string;
  title: string;
  score: number;
  date: number; // timestamp
  poster: string;
}

const MEDIA_COLORS: Record<string, string> = {
  movies: "#c084fc", // purple-400
  series: "#60a5fa", // blue-400
  games: "#4ade80",  // green-400
  books: "#fb923c",  // orange-400
  music: "#facc15",  // yellow-400
};

const MEDIA_LABELS: Record<string, string> = {
  movies: "Película",
  series: "Serie",
  games: "Juego",
  books: "Libro",
  music: "Música",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/90 border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4 max-w-sm backdrop-blur-md">
        {data.poster && (
          <img src={data.poster} alt={data.title} className="w-16 h-24 object-cover rounded-lg shadow-lg border border-white/5" />
        )}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: MEDIA_COLORS[data.type] }}>
            {MEDIA_LABELS[data.type]}
          </div>
          <h4 className="text-white font-black text-lg leading-tight mb-2 line-clamp-2">{data.title}</h4>
          <div className="flex flex-col gap-1">
            <span className="text-yellow-400 font-bold text-2xl drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">{data.score} <span className="text-sm text-neutral-500">/ 1000</span></span>
            <span className="text-neutral-500 text-xs font-medium">{format(new Date(data.date), "d MMM yyyy", { locale: es })}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function GalaxiaChart({ data }: { data: GalaxyItem[] }) {
  // Add some slight random jitter to Y so items with exact same score don't perfectly overlap, 
  // enhancing the "galaxy" organic feel
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      // Jitter score slightly by +/- 2 points just for visual spread, actual score stays in tooltip
      displayScore: item.score + (Math.random() * 8 - 4),
      // Base size relative to score (higher score = bigger star)
      size: Math.max(20, item.score / 2),
    }));
  }, [data]);

  return (
    <div className="relative w-full h-[650px] bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col group">
      {/* Galaxy Background Effects */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Galaxy Title */}
      <div className="pt-8 px-8 z-10 pointer-events-none">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-400 drop-shadow-lg flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#galaxyGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><defs><linearGradient id="galaxyGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fff"/><stop offset="100%" stopColor="#c084fc"/></linearGradient></defs><path d="M12 2a10 10 0 0 0-10 10c0 5.523 4.477 10 10 10s10-4.477 10-10A10 10 0 0 0 12 2Z"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20Z"/><path d="M2 12h20"/></svg>
          La Galaxia
        </h2>
        <p className="text-indigo-300/60 font-bold tracking-widest uppercase text-xs mt-1">El Universo de tus Valoraciones</p>
      </div>

      <div className="flex-1 w-full min-h-0 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 40, bottom: 40, left: 0 }}>
          <XAxis 
            type="number" 
            dataKey="date" 
            domain={['dataMin', 'dataMax']} 
            tickFormatter={(tick) => format(new Date(tick), "MMM yyyy", { locale: es })}
            stroke="rgba(255,255,255,0.1)"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 'bold' }}
            tickMargin={15}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            type="number" 
            dataKey="displayScore" 
            domain={[0, 1000]} 
            stroke="rgba(255,255,255,0.1)"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 'bold' }}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <ZAxis type="number" dataKey="size" range={[20, 800]} />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)' }}
          />
          
          <Scatter data={processedData} shape="circle" animationDuration={1500}>
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={MEDIA_COLORS[entry.type] || '#fff'} 
                stroke="rgba(0,0,0,0.6)"
                strokeWidth={1.5}
                className="transition-all duration-300 hover:opacity-100 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] cursor-pointer"
                style={{ 
                  opacity: entry.score > 800 ? 1 : 0.75,
                  filter: `drop-shadow(0 0 ${entry.score > 900 ? '10px' : '2px'} ${MEDIA_COLORS[entry.type]})`
                }}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}

import React from 'react';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

export function ActivityHeatmap({ activityData }: { activityData: { date: string, count: number }[] }) {
  // Generar últimos 364 días (52 semanas * 7 días)
  const today = startOfDay(new Date());
  const days = Array.from({ length: 364 }, (_, i) => subDays(today, 363 - i));
  
  // Mapear datos para búsqueda rápida
  const activityMap = new Map();
  activityData.forEach(d => {
    // Asegurarse de comparar solo la parte de fecha
    const dStr = d.date.split('T')[0];
    activityMap.set(dStr, (activityMap.get(dStr) || 0) + d.count);
  });

  const getColor = (count: number) => {
    if (count === 0) return 'bg-white/5 hover:bg-white/10';
    if (count <= 2) return 'bg-blue-900/60 hover:bg-blue-800 border-blue-800/50';
    if (count <= 5) return 'bg-blue-600/80 hover:bg-blue-500 border-blue-500/50 shadow-[0_0_8px_rgba(37,99,235,0.4)]';
    if (count <= 10) return 'bg-blue-400 hover:bg-blue-300 border-blue-300 shadow-[0_0_12px_rgba(96,165,250,0.6)]';
    return 'bg-cyan-300 hover:bg-cyan-200 border-cyan-200 shadow-[0_0_15px_rgba(103,232,249,0.8)] relative z-10 scale-110';
  };

  // Organizar días en columnas (semanas)
  const weeks = [];
  let currentWeek: Date[] = [];
  
  days.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  return (
    <div className="glass-card p-6 flex flex-col gap-6 w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            Mosaico de Actividad (Último Año)
          </h3>
          <p className="text-sm text-neutral-400 mt-1">El pulso de tu consumo de contenido multimedia</p>
        </div>
        <div className="hidden md:flex gap-1 items-center text-xs text-neutral-500 font-medium">
          Menos
          <div className="w-3 h-3 rounded-sm bg-white/5 ml-1"></div>
          <div className="w-3 h-3 rounded-sm bg-blue-900/60 border border-blue-800/50"></div>
          <div className="w-3 h-3 rounded-sm bg-blue-600/80 border border-blue-500/50"></div>
          <div className="w-3 h-3 rounded-sm bg-blue-400 border border-blue-300"></div>
          <div className="w-3 h-3 rounded-sm bg-cyan-300 border border-cyan-200"></div>
          <span className="ml-1">Más</span>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-1.5 mx-auto">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1.5">
              {week.map((day, dIndex) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const count = activityMap.get(dateStr) || 0;
                
                return (
                  <div 
                    key={dIndex}
                    title={`${format(day, "d 'de' MMMM, yyyy", { locale: es })}: ${count} valoraciones`}
                    className={`w-[14px] h-[14px] rounded-sm transition-all duration-300 cursor-help ${getColor(count)}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export function CommunityStatsPanel({ stats, type }: { stats: any, type: string }) {
  const [open, setOpen] = useState(false);

  if (!stats) return null;
  const { base, advanced } = stats;

  return (
    <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-6">
      <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Impacto Global (Comunidad)
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
          <p className="text-neutral-500 text-xs font-bold uppercase mb-1">Nota Promedio</p>
          <p className="text-2xl font-black text-white">{base._avg?.totalScore?.toFixed(0) || 0} <span className="text-sm text-neutral-500">/1000</span></p>
          <p className="text-xs text-neutral-400 mt-1">De {base._count?.id || 0} valoraciones</p>
        </div>
        
        {type === 'game' && base._avg?.playtimeHours && (
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="text-neutral-500 text-xs font-bold uppercase mb-1">Tiempo de Juego Medio</p>
            <p className="text-2xl font-black text-green-400">{base._avg.playtimeHours.toFixed(1)} <span className="text-sm text-neutral-500">h</span></p>
          </div>
        )}
        {(type === 'tv' || type === 'movie') && base._avg?.bingeDays && (
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="text-neutral-500 text-xs font-bold uppercase mb-1">Días de Maratón</p>
            <p className="text-2xl font-black text-blue-400">{base._avg.bingeDays.toFixed(1)} <span className="text-sm text-neutral-500">días</span></p>
          </div>
        )}
        {type === 'book' && base._avg?.totalPages && (
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="text-neutral-500 text-xs font-bold uppercase mb-1">Páginas Promedio</p>
            <p className="text-2xl font-black text-orange-400">{base._avg.totalPages.toFixed(0)} <span className="text-sm text-neutral-500">pgs</span></p>
          </div>
        )}
      </div>

      {advanced && Object.keys(advanced).length > 0 && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <button 
            onClick={() => setOpen(!open)}
            className="w-full flex justify-between items-center text-sm font-bold text-neutral-400 hover:text-white transition-colors"
          >
            Ver Analíticas Profundas {open ? '↑' : '↓'}
          </button>
          
          {open && (
            <div className="mt-4 grid grid-cols-2 gap-4 animate-fade-in">
              {type === 'game' && (
                <>
                  <div className="bg-black/50 p-3 rounded-lg"><span className="text-xs text-neutral-500 block">Máx. Horas</span><span className="text-white font-bold">{advanced.maxPlaytime?.toFixed(1) || '-'} h</span></div>
                  <div className="bg-black/50 p-3 rounded-lg"><span className="text-xs text-neutral-500 block">Promedio Logros</span><span className="text-white font-bold">{advanced.avgAchievements?.toFixed(1) || '-'} %</span></div>
                  <div className="bg-black/50 p-3 rounded-lg"><span className="text-xs text-neutral-500 block">Plataforma Favorita</span><span className="text-white font-bold">{advanced.topPlatform || '-'}</span></div>
                  <div className="bg-black/50 p-3 rounded-lg"><span className="text-xs text-neutral-500 block">Completado Típico</span><span className="text-white font-bold">{advanced.topTier || '-'}</span></div>
                </>
              )}
              {type === 'tv' && (
                <>
                  <div className="bg-black/50 p-3 rounded-lg"><span className="text-xs text-neutral-500 block">Máx. Días de Binge</span><span className="text-white font-bold">{advanced.maxBingeDays || '-'}</span></div>
                  <div className="bg-black/50 p-3 rounded-lg"><span className="text-xs text-neutral-500 block">Medio más usado</span><span className="text-white font-bold">{advanced.topPlatform || '-'}</span></div>
                </>
              )}
              {type === 'movie' && (
                <>
                  <div className="bg-black/50 p-3 rounded-lg"><span className="text-xs text-neutral-500 block">Medio más usado</span><span className="text-white font-bold">{advanced.topPlatform || '-'}</span></div>
                </>
              )}
              {type === 'book' && (
                <>
                  <div className="bg-black/50 p-3 rounded-lg"><span className="text-xs text-neutral-500 block">Máx. Páginas/Día</span><span className="text-white font-bold">{advanced.maxPagesPerDay?.toFixed(1) || '-'}</span></div>
                  <div className="bg-black/50 p-3 rounded-lg"><span className="text-xs text-neutral-500 block">Formato Preferido</span><span className="text-white font-bold">{advanced.topFormat || '-'}</span></div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

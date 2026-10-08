import { LucideIcon, Trophy, Medal } from "lucide-react";
import Link from "next/link";

export interface VitrinaItem {
  id: string;
  title: string;
  subtitle?: string;
  poster: string;
  backdrop?: string | null;
  score: number;
}

export interface VitrinaCategory {
  id: string;
  type: string;
  title: string;
  icon: LucideIcon;
  color: { text: string; border: string; bg: string };
  items: VitrinaItem[];
  imageClass?: string;
}

export function VitrinaDorada({ categories }: { categories: VitrinaCategory[] }) {
  return (
    <section className="flex flex-col gap-8">
      <header className="flex items-center gap-4 mb-4">
        <div className="p-4 bg-yellow-500/20 rounded-2xl border border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
          <Trophy className="text-yellow-400" size={32} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 drop-shadow-lg">Vitrina Dorada</h2>
          <p className="text-neutral-400 font-medium">Tus 3 obras maestras supremas por cada categoría.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const top1 = cat.items[0];
          const top2 = cat.items[1];
          const top3 = cat.items[2];

          return (
            <div key={cat.id} className={`relative flex flex-col glass-card overflow-hidden border-t-4 ${cat.color.border} group`}>
              {/* Background Glow */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 ${cat.color.bg} blur-[60px] opacity-40 group-hover:opacity-80 transition-opacity duration-700`} />
              
              <div className="p-6 relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-8 justify-center">
                  <Icon className={cat.color.text} size={24} />
                  <h3 className={`text-xl font-black ${cat.color.text}`}>{cat.title}</h3>
                </div>

                {cat.items.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-neutral-500 italic">Vacio</div>
                ) : (
                  <div className="flex flex-col gap-6 flex-1">
                    {/* 1st Place */}
                    {top1 && (
                      <Link href={`/rate/${cat.type}/${top1.id}`} className="relative flex flex-col items-center text-center group/item hover:scale-105 transition-transform">
                        <div className="absolute -top-4 z-20">
                          <Trophy size={28} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" fill="currentColor" />
                        </div>
                        <div className={`relative rounded-xl overflow-hidden shadow-[0_0_20px_rgba(234,179,8,0.2)] border-2 border-yellow-500/50 p-1 bg-gradient-to-b from-yellow-500/20 to-transparent`}>
                          <img src={top1.poster} alt={top1.title} className={`${cat.imageClass || 'w-24 h-36 rounded-lg'} object-cover`} />
                        </div>
                        <h4 className="font-black text-white mt-3 text-lg leading-tight line-clamp-2">{top1.title}</h4>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-yellow-400 font-black text-xl">{top1.score}</span>
                          <span className="text-[10px] text-neutral-500 font-bold uppercase">/ 1000</span>
                        </div>
                      </Link>
                    )}

                    {/* 2nd & 3rd Places in a Row */}
                    <div className="flex justify-between gap-4 mt-auto pt-4 border-t border-white/5">
                      {top2 && (
                        <Link href={`/rate/${cat.type}/${top2.id}`} className="flex-1 flex flex-col items-center text-center group/item hover:scale-105 transition-transform">
                           <div className="-mb-2 z-20">
                            <Medal size={20} className="text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]" fill="currentColor" />
                          </div>
                          <img src={top2.poster} alt={top2.title} className={`${cat.imageClass || 'w-16 h-24 rounded-lg'} object-cover shadow-lg border border-slate-400/30`} />
                          <h4 className="font-bold text-neutral-300 mt-2 text-xs leading-tight line-clamp-2">{top2.title}</h4>
                          <span className="text-slate-300 font-black text-sm mt-1">{top2.score}</span>
                        </Link>
                      )}
                      {top3 && (
                        <Link href={`/rate/${cat.type}/${top3.id}`} className="flex-1 flex flex-col items-center text-center group/item hover:scale-105 transition-transform">
                          <div className="-mb-2 z-20">
                            <Medal size={20} className="text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]" fill="currentColor" />
                          </div>
                          <img src={top3.poster} alt={top3.title} className={`${cat.imageClass || 'w-16 h-24 rounded-lg'} object-cover shadow-lg border border-amber-700/30`} />
                          <h4 className="font-bold text-neutral-300 mt-2 text-xs leading-tight line-clamp-2">{top3.title}</h4>
                          <span className="text-amber-600 font-black text-sm mt-1">{top3.score}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Botón Ver Todos */}
                <Link 
                  href={`/tops?tab=${cat.id}`}
                  className={`mt-6 w-full py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors text-center text-sm font-bold text-neutral-400 hover:text-white`}
                >
                  Ver ranking completo
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

import { LucideIcon, Star } from "lucide-react";

export interface RankingItem {
  id: string;
  title: string;
  subtitle?: string;
  poster: string;
  backdrop?: string | null;
  score: number;
}

interface RankingColumnProps {
  title: string;
  icon: LucideIcon;
  color: { text: string; border: string; bg: string };
  items: RankingItem[];
  imageClass?: string;
}

export function RankingColumn({ title, icon: Icon, color, items, imageClass = "w-16 h-24 rounded-xl" }: RankingColumnProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Icon className={color.text} size={28} />
        <h2 className={`text-2xl font-black ${color.text} drop-shadow-lg`}>{title}</h2>
      </div>
      
      {items.length === 0 ? (
        <div className="glass-card p-8 text-center text-neutral-500 border-dashed border-2 border-white/10">
          Ninguno valorado aún.
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {items.map((item, i) => (
            <div key={item.id} className={`relative overflow-hidden rounded-2xl glass ${color.border} border-l-4 hover:scale-[1.02] transition-all duration-300 group`}>
              {/* Background Blur */}
              {(item.backdrop || item.poster) && (
                <div className={`absolute inset-0 ${item.backdrop ? 'opacity-20 group-hover:opacity-40' : 'opacity-10 group-hover:opacity-20'} transition-opacity duration-500`}>
                  <img src={item.backdrop || item.poster} alt="bg" className="w-full h-full object-cover blur-sm scale-110" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
              
              {/* Content */}
              <div className="relative p-4 flex items-center gap-4 z-10">
                <span className="text-4xl font-black text-white/10 italic w-8 text-center">{i + 1}</span>
                <img 
                  src={item.poster} 
                  alt={item.title} 
                  className={`${imageClass} shadow-lg object-cover border border-white/10 transition-shadow`} 
                />
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-lg font-extrabold text-white mb-1 drop-shadow-md leading-tight truncate">{item.title}</h4>
                  {item.subtitle && <p className="text-xs text-neutral-400 mb-2 truncate">{item.subtitle}</p>}
                  <div className={`flex items-center gap-2 bg-black/50 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/10 shadow-inner ${color.text}`}>
                    <Star className="fill-current" size={14} />
                    <span className="font-black font-mono text-sm">{item.score} <span className="text-xs opacity-60">/ 1000</span></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

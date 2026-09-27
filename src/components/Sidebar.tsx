import Link from 'next/link';
import { Home, Tv, Film, Gamepad2, Music, BookOpen, Disc, User, Search, ChevronLeft, ChevronRight,  } from 'lucide-react';

export function Sidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: (val: boolean) => void }) {
  const links = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Buscar', href: '/search', icon: Search },
    { name: 'Series', href: '/series', icon: Tv },
    { name: 'Películas', href: '/movies', icon: Film },
    { name: 'Videojuegos', href: '/games', icon: Gamepad2 },
    { name: 'Música', href: '/music', icon: Music },
    { name: 'Álbumes', href: '/albums', icon: Disc },
    { name: 'Libros', href: '/books', icon: BookOpen },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-screen glass flex flex-col gap-8 z-50 py-8 border-r border-white/10 transition-all duration-300 ${isCollapsed ? 'w-20 px-3' : 'w-64 px-5'}`}>
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <img src="/icon.jpeg" alt="Critiq Logo" className="min-w-[32px] w-8 h-8 rounded-xl shadow-lg shadow-white/5 object-cover" />
          {!isCollapsed && <h1 className="text-2xl font-bold tracking-tighter text-white">Critiq</h1>}
        </div>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors flex-shrink-0">
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="flex flex-col gap-2 flex-1 mt-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex items-center gap-3 py-3 rounded-xl text-neutral-400 hover:text-white glass-hover ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
              title={isCollapsed ? link.name : undefined}
            >
              <Icon size={20} className="opacity-80 shrink-0" />
              {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap">{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Link 
          href="/user/CritiqAdmin"
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white font-medium transition-all text-sm ${isCollapsed ? 'px-0' : ''}`}
          title={isCollapsed ? 'Mi Perfil' : undefined}
        >
          <User size={16} className="shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Mi Perfil</span>}
        </Link>
      </div>
    </aside>
  );
}

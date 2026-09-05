const fs = require('fs');
let code = fs.readFileSync('src/components/SearchUI.tsx', 'utf8');

const oldBlock = `          <div key={item.id} className="group relative">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden glass border border-white/5 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={item.poster} 
                alt={item.title}
                className={\`object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 group-hover:opacity-40 \${item.type === 'track' ? 'aspect-square' : ''}\`}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link 
                  href={\`/rate/\${item.type}/\${item.id}\`}
                  className="bg-white text-black font-bold py-2 px-4 rounded-full shadow-lg hover:scale-105 transition-transform"
                >
                  Valorar
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm truncate" title={item.title}>{item.title}</h3>
              <p className="text-neutral-500 text-xs uppercase tracking-wider">
                {item.type === 'movie' ? 'Película' : item.type === 'tv' ? 'Serie' : item.type === 'book' ? 'Libro' : item.type === 'game' ? 'Videojuego' : 'Canción'}
              </p>
            </div>
          </div>`;

const newBlock = `          <Link href={\`/rate/\${item.type}/\${item.id}\`} key={item.id} className="group relative block cursor-pointer">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden glass border border-white/5 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={item.poster} 
                alt={item.title}
                className={\`object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 group-hover:opacity-40 \${item.type === 'track' ? 'aspect-square' : ''}\`}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                <span className="bg-white text-black font-bold py-2 px-4 rounded-full shadow-lg transform scale-90 group-hover:scale-105 transition-transform">
                  Valorar
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm truncate" title={item.title}>{item.title}</h3>
              <p className="text-neutral-500 text-xs uppercase tracking-wider">
                {item.type === 'movie' ? 'Película' : item.type === 'tv' ? 'Serie' : item.type === 'book' ? 'Libro' : item.type === 'game' ? 'Videojuego' : 'Canción'}
              </p>
            </div>
          </Link>`;

code = code.replace(oldBlock, newBlock);
fs.writeFileSync('src/components/SearchUI.tsx', code);

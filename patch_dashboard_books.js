const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

const bookSection = `        </div>

        {/* RANKING LIBROS (Módulo Naranja) */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <BookOpen className={mediaColors.books.text} size={28} />
            <h2 className={\`text-2xl font-black \${mediaColors.books.text} drop-shadow-lg\`}>Top Libros</h2>
          </div>
          
          {topBooks.length === 0 ? (
            <div className="glass-card p-8 text-center text-neutral-500 border-dashed border-2 border-white/10">Ninguno valorado aún.</div>
          ) : (
            <div className="flex flex-col gap-5">
              {topBooks.map((br, i) => {
                return (
                  <div key={br.id} className={\`relative overflow-hidden rounded-2xl glass \${mediaColors.books.border} border-l-4 hover:scale-[1.02] transition-all duration-300 group\`}>
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                      <img src={br.book.posterUrl || ""} alt="bg" className="w-full h-full object-cover blur-sm scale-110" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
                    <div className="relative p-4 flex items-center gap-4 z-10">
                      <span className="text-4xl font-black text-white/10 italic w-8 text-center">{i + 1}</span>
                      <img src={br.book.posterUrl || ""} alt={br.book.title} className={\`w-16 h-24 rounded-md shadow-lg object-cover border border-white/10 group-hover:shadow-\${mediaColors.books.text} transition-shadow aspect-[2/3]\`} />
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-lg font-extrabold text-white mb-1 drop-shadow-md leading-tight truncate">{br.book.title}</h4>
                        <p className="text-xs text-neutral-400 mb-2 truncate">{br.book.author}</p>
                        <div className={\`flex items-center gap-2 bg-black/50 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/10 shadow-inner \${mediaColors.books.text}\`}>
                          <Star className="fill-current" size={14} />
                          <span className="font-black font-mono text-sm">{br.totalScore} <span className="text-xs opacity-60">/ 1000</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </section>
`;

code = code.replace(`        </div>\n\n      </section>`, bookSection);
fs.writeFileSync('src/app/page.tsx', code);

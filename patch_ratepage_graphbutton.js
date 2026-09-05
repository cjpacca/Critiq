const fs = require('fs');
let code = fs.readFileSync('src/app/rate/[type]/[id]/page.tsx', 'utf8');

const originalDescriptionBlock = `            <p className="text-neutral-300 text-sm leading-relaxed opacity-80">
              {description}
            </p>
          </div>
        </div>`;

const newDescriptionBlock = `            <p className="text-neutral-300 text-sm leading-relaxed opacity-80 mb-6">
              {description}
            </p>
            {type === 'tv' && (
              <Link 
                href={\`/seriesgraph/\${id}\`} 
                className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/50 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                Generar Seriesgraph
              </Link>
            )}
          </div>
        </div>`;

code = code.replace(originalDescriptionBlock, newDescriptionBlock);
if (!code.includes('import Link from "next/link"')) {
  code = `import Link from "next/link";\n` + code;
}
fs.writeFileSync('src/app/rate/[type]/[id]/page.tsx', code);

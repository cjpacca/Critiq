import re

with open("src/components/RankingColumn.tsx", "r") as f:
    code = f.read()

# Add link to next/link
if "import Link from" not in code:
    code = code.replace('import { LucideIcon, Star } from "lucide-react";', 'import { LucideIcon, Star, ArrowRight } from "lucide-react";\nimport Link from "next/link";')
else:
    code = code.replace('import { LucideIcon, Star } from "lucide-react";', 'import { LucideIcon, Star, ArrowRight } from "lucide-react";')

# Add type prop to interface
code = code.replace("imageClass?: string;", "imageClass?: string;\n  typeKey?: string;")
code = code.replace("imageClass = \"w-16 h-24 rounded-xl\" }: RankingColumnProps)", "imageClass = \"w-16 h-24 rounded-xl\", typeKey }: RankingColumnProps)")

# Replace the score pill
old_score = """<div className={`flex items-center gap-2 bg-black/50 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/10 shadow-inner ${color.text}`}>
                    <Star className="fill-current" size={14} />
                    <span className="font-black font-mono text-sm">{item.score} <span className="text-xs opacity-60">/ 1000</span></span>
                  </div>"""
new_score = """<div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-2xl font-black ${color.text} drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] leading-none tracking-tighter`}>{item.score}</span>
                    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">/ 1000</span>
                  </div>"""
code = code.replace(old_score, new_score)

# Add link at the bottom
old_bottom = """</div>
      )}
    </div>"""
new_bottom = """</div>
      )}
      
      {typeKey && items.length > 0 && (
        <Link 
          href={`/tops?tab=${typeKey}`}
          className={`mt-2 flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group`}
        >
          <span className={`font-bold text-sm text-neutral-400 group-hover:text-white transition-colors`}>Ver ranking completo</span>
          <ArrowRight size={16} className={`${color.text} transform group-hover:translate-x-1 transition-transform`} />
        </Link>
      )}
    </div>"""
code = code.replace(old_bottom, new_bottom)

with open("src/components/RankingColumn.tsx", "w") as f:
    f.write(code)

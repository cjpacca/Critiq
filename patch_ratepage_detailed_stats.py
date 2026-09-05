import re

with open("src/app/rate/[type]/[id]/page.tsx", "r") as f:
    code = f.read()

# Add import
if "import { CommunityStatsPanel }" not in code:
    code = code.replace(
        'import { WikidataTags } from "@/components/WikidataTags";',
        'import { WikidataTags } from "@/components/WikidataTags";\nimport { CommunityStatsPanel } from "@/components/CommunityStatsPanel";'
    )

# Replace getCommunityStats with getCommunityStatsDetailed
code = code.replace("getCommunityStats(type, id)", "getCommunityStatsDetailed(type, id)")
code = code.replace("import { getCommunityStats }", "import { getCommunityStatsDetailed }")

# Replace the entire existing stats UI block with the new component
pattern = r'\{/\* Panel de Estadísticas Globales de la Obra \*/\}.*?(?=\{/\* Sistema de Valoración \(1000 pts\) \*/\})'
replacement = """{/* Panel de Estadísticas Globales de la Obra */}
            <CommunityStatsPanel stats={communityStats} type={type} />
            
            """

code = re.sub(pattern, replacement, code, flags=re.DOTALL)

with open("src/app/rate/[type]/[id]/page.tsx", "w") as f:
    f.write(code)

import re

with open("src/app/rate/[type]/[id]/page.tsx", "r") as f:
    code = f.read()

# Add import
if "import { CastCrew }" not in code:
    code = code.replace(
        'import { CommunityStatsPanel } from "@/components/CommunityStatsPanel";',
        'import { CommunityStatsPanel } from "@/components/CommunityStatsPanel";\nimport { CastCrew } from "@/components/CastCrew";'
    )

# Inject CastCrew
pattern = r'(<CommunityStatsPanel stats=\{communityStats\} type=\{type\} />)'
replacement = r'\1\n            {(type === "movie" || type === "tv") && media.credits && <CastCrew credits={media.credits} creators={(media as any).created_by} />}'

code = re.sub(pattern, replacement, code)

# CSS for hide-scrollbar (if not exists)
# It's better to just use standard tailwind classes or a global css rule. Let's add it to globals.css

with open("src/app/rate/[type]/[id]/page.tsx", "w") as f:
    f.write(code)

import re

with open("src/app/tops/TopsClient.tsx", "r") as f:
    code = f.read()

# 1. Add import
code = code.replace(
    'import { useState } from "react";',
    'import { useState } from "react";\nimport { GameScatterPlot } from "@/components/GameScatterPlot";'
)

# 2. Inject component
injection = """      </div>

      {activeTab === 'games' && <GameScatterPlot games={games} />}

      {/* Lista de Ranking */}"""

code = code.replace("      </div>\n\n      {/* Lista de Ranking */}", injection)

with open("src/app/tops/TopsClient.tsx", "w") as f:
    f.write(code)


import re

with open("src/components/GameScatterPlot.tsx", "r") as f:
    code = f.read()

colors_code = """const SCORE_COLORS = [
  [75, 85, 99],    // 0: Gris Oscuro
  [156, 163, 175], // 1: Gris
  [200, 130, 150], // 2: Rosa apagado
  [255, 255, 255], // 3: Blanco
  [249, 115, 22],  // 4: Naranja
  [239, 68, 68],   // 5: Rojo
  [168, 85, 247],  // 6: Morado
  [234, 179, 8],   // 7: Amarillo Mostaza
  [59, 130, 246],  // 8: Azul
  [0, 229, 255],   // 9: Aqua Brillante
  [34, 197, 94]    // 10: Verde
];

function getColorForScore(score: number | undefined) {
  if (score === undefined || score === null) return 'rgba(255, 255, 255, 0.03)';
  const normalized = score / 100; // Maps 0-1000 to 0-10
  const lower = Math.floor(normalized);
  const upper = Math.ceil(normalized);
  if (lower >= 10) return `rgb(${SCORE_COLORS[10].join(',')})`;
  if (lower < 0) return `rgb(${SCORE_COLORS[0].join(',')})`;
  if (lower === upper) return `rgb(${SCORE_COLORS[lower].join(',')})`;
  
  const weight = normalized - lower;
  const r = Math.round(SCORE_COLORS[lower][0] * (1 - weight) + SCORE_COLORS[upper][0] * weight);
  const g = Math.round(SCORE_COLORS[lower][1] * (1 - weight) + SCORE_COLORS[upper][1] * weight);
  const b = Math.round(SCORE_COLORS[lower][2] * (1 - weight) + SCORE_COLORS[upper][2] * weight);
  return `rgb(${r}, ${g}, ${b})`;
}
"""

code = code.replace('import { getColorForScore } from "@/lib/utils";\n', colors_code)

with open("src/components/GameScatterPlot.tsx", "w") as f:
    f.write(code)


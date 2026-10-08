import re

with open("src/components/SeasonChartUI.tsx", "r") as f:
    code = f.read()

old_colors = """const SCORE_COLORS = [
  [239, 68, 68],   // 0: Rojo oscuro
  [249, 115, 22],  // 1: Naranja oscuro
  [249, 168, 21],  // 2: Naranja
  [234, 179, 8],   // 3: Amarillo oscuro
  [253, 224, 71],  // 4: Amarillo
  [163, 230, 53],  // 5: Lima
  [34, 197, 94],   // 6: Verde
  [16, 185, 129],  // 7: Esmeralda
  [6, 182, 212],   // 8: Cian
  [59, 130, 246],  // 9: Azul
  [37, 99, 235]    // 10: Azul profundo
];"""

new_colors = """const SCORE_COLORS = [
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
];"""

code = code.replace(old_colors, new_colors)

old_gradient = """                    <linearGradient id="scoreGradient" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="rgb(239, 68, 68)" />
                      <stop offset="25%" stopColor="rgb(249, 168, 21)" />
                      <stop offset="50%" stopColor="rgb(163, 230, 53)" />
                      <stop offset="75%" stopColor="rgb(16, 185, 129)" />
                      <stop offset="100%" stopColor="rgb(37, 99, 235)" />
                    </linearGradient>"""

new_gradient = """                    <linearGradient id="scoreGradient" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="rgb(75, 85, 99)" />
                      <stop offset="10%" stopColor="rgb(156, 163, 175)" />
                      <stop offset="20%" stopColor="rgb(200, 130, 150)" />
                      <stop offset="30%" stopColor="rgb(255, 255, 255)" />
                      <stop offset="40%" stopColor="rgb(249, 115, 22)" />
                      <stop offset="50%" stopColor="rgb(239, 68, 68)" />
                      <stop offset="60%" stopColor="rgb(168, 85, 247)" />
                      <stop offset="70%" stopColor="rgb(234, 179, 8)" />
                      <stop offset="80%" stopColor="rgb(59, 130, 246)" />
                      <stop offset="90%" stopColor="rgb(0, 229, 255)" />
                      <stop offset="100%" stopColor="rgb(34, 197, 94)" />
                    </linearGradient>"""

code = code.replace(old_gradient, new_gradient)

with open("src/components/SeasonChartUI.tsx", "w") as f:
    f.write(code)


with open("src/components/SeasonChartUI.tsx", "r") as f:
    code = f.read()

# 1. Extract Valle de la Muerte block
start_marker = "          {/* VALLE DE LA MUERTE (Delta Chart) */}"
end_marker = "        </div>\n\n        {/* Columna Derecha: Valorar Episodios"

start_idx = code.find(start_marker)
end_idx = code.find("        </div>\n\n        {/* Columna Derecha: Valorar Episodios")

# The block to extract is from start_idx to the line before end_idx
# Wait, let's just use regex to extract and remove.
import re

pattern = r'\s*\{\/\* VALLE DE LA MUERTE.*?<\/ResponsiveContainer>\n\s*<\/div>\n\s*<\/div>\n\s*\)\}\n'
match = re.search(pattern, code, flags=re.DOTALL)
if match:
    valley_block = match.group(0)
    # Remove from original location
    code = code[:match.start()] + code[match.end():]
    
    # Insert before the Heatmap
    heatmap_marker = "      {/* Heatmap Table */}"
    heatmap_idx = code.find(heatmap_marker)
    if heatmap_idx != -1:
        # Wrap it in a grid or flex so it looks good spanning the full width
        # The heatmap is a full-width card. We can just put Valle right above it as a full-width card.
        code = code[:heatmap_idx] + valley_block.strip() + "\n\n" + code[heatmap_idx:]
    
    with open("src/components/SeasonChartUI.tsx", "w") as f:
        f.write(code)
    print("Success")
else:
    print("Pattern not found")

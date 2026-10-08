import re

with open("src/components/AlbumGraphUI.tsx", "r") as f:
    code = f.read()

# 1. Update imports
code = code.replace(
    'import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";',
    'import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";'
)

# 2. Add CustomEQBar definition right before the return statement of AlbumGraphUI
custom_eq_code = """  const CustomEQBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    const boxHeight = 6;
    const gap = 3;
    // Calculate how many boxes fit in the current height
    const totalBoxes = Math.max(1, Math.floor(height / (boxHeight + gap)));
    const boxes = [];
    
    // Draw the boxes from bottom to top
    for(let i = 0; i < totalBoxes; i++) {
      const currentY = y + height - ((i + 1) * (boxHeight + gap));
      // Give the top boxes a slightly brighter opacity to simulate glowing peaks
      const opacity = 0.4 + (0.6 * ((i + 1) / totalBoxes));
      boxes.push(
        <rect 
          key={i} 
          x={x} 
          y={currentY} 
          width={width} 
          height={boxHeight} 
          fill={fill} 
          rx={2} 
          ry={2} 
          opacity={opacity}
        />
      );
    }
    
    // Añadir una pequeña barrita flotante (peak) en la cima
    const peakY = y - (boxHeight + gap);
    if (height > 10) {
      boxes.push(
        <rect 
          key="peak" 
          x={x} 
          y={peakY} 
          width={width} 
          height={4} 
          fill={fill} 
          rx={2} 
          ry={2} 
          opacity={1}
          style={{ filter: `drop-shadow(0 0 4px ${fill})` }}
        />
      );
    }

    return <g>{boxes}</g>;
  };

  return ("""

code = code.replace("  return (", custom_eq_code, 1)

# 3. Inject the Sonic Equalizer section after the grid and before the Heatmap
eq_section = """      </div>

      {/* SONIC EQUALIZER */}
      {chartData.length > 0 && (
        <div className="glass-card p-6 h-[300px] flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-yellow-500/20 transition-all duration-700" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700" />
          
          <div className="flex items-center justify-between mb-2 z-10">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><path d="M12 2v20"/><path d="M17 7v10"/><path d="M22 10v4"/><path d="M7 10v4"/><path d="M2 14v-4"/></svg>
                Sonic Equalizer
              </h3>
              <p className="text-xs text-neutral-400 font-bold tracking-widest uppercase mt-1">Análisis de Frecuencia del Álbum</p>
            </div>
          </div>

          <div className="flex-1 z-10 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} tickCount={6} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="score" shape={<CustomEQBar />} isAnimationActive={true} animationDuration={1500} animationEasing="ease-out">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColorForScore(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Heatmap del Álbum */}"""

# Look for the Heatmap header to inject right before it
code = code.replace('        <h3 className="text-xl font-bold text-white mb-6">Mapa de Calor del Álbum</h3>', '        {/* Heatmap del Álbum */}\n        <h3 className="text-xl font-bold text-white mb-6">Mapa de Calor del Álbum</h3>')
code = code.replace("""      </div>
      <div className="glass-card p-6 overflow-x-auto custom-scrollbar">
        {/* Heatmap del Álbum */}""", eq_section.replace("{/* Heatmap del Álbum */}", """<div className="glass-card p-6 overflow-x-auto custom-scrollbar">
        <h3 className="text-xl font-bold text-white mb-6">Mapa de Calor del Álbum</h3>"""))

with open("src/components/AlbumGraphUI.tsx", "w") as f:
    f.write(code)


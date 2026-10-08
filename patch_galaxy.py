import re

with open("src/components/GalaxiaChart.tsx", "r") as f:
    code = f.read()

# Fix container and title structure
old_container = """    <div className="relative w-full h-[600px] bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
      {/* Galaxy Background Effects */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Galaxy Title */}
      <div className="absolute top-6 left-8 z-10 pointer-events-none">"""

new_container = """    <div className="relative w-full h-[650px] bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col group">
      {/* Galaxy Background Effects */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Galaxy Title */}
      <div className="pt-8 px-8 z-10 pointer-events-none">"""

code = code.replace(old_container, new_container)

# Wrap ResponsiveContainer
old_rc = """      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 80, right: 40, bottom: 40, left: 20 }}>"""

new_rc = """      <div className="flex-1 w-full min-h-0 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 40, bottom: 40, left: 0 }}>"""

code = code.replace(old_rc, new_rc)

# Fix Cell properties and close the new flex-1 div
old_scatter = """          <ZAxis type="number" dataKey="size" range={[10, 400]} />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)' }}
          />
          
          <Scatter data={processedData} shape="circle" animationDuration={1500}>
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={MEDIA_COLORS[entry.type] || '#fff'} 
                className="transition-all duration-300 hover:opacity-100 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] cursor-pointer"
                style={{ 
                  opacity: entry.score > 800 ? 0.9 : 0.6,
                  filter: `drop-shadow(0 0 ${entry.score > 900 ? '10px' : '4px'} ${MEDIA_COLORS[entry.type]})`
                }}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>"""

new_scatter = """          <ZAxis type="number" dataKey="size" range={[20, 800]} />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)' }}
          />
          
          <Scatter data={processedData} shape="circle" animationDuration={1500}>
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={MEDIA_COLORS[entry.type] || '#fff'} 
                stroke="rgba(0,0,0,0.6)"
                strokeWidth={1.5}
                className="transition-all duration-300 hover:opacity-100 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] cursor-pointer"
                style={{ 
                  opacity: entry.score > 800 ? 1 : 0.75,
                  filter: `drop-shadow(0 0 ${entry.score > 900 ? '10px' : '2px'} ${MEDIA_COLORS[entry.type]})`
                }}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      </div>
    </div>"""

code = code.replace(old_scatter, new_scatter)

with open("src/components/GalaxiaChart.tsx", "w") as f:
    f.write(code)

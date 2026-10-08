with open("src/components/AlbumGraphUI.tsx", "r") as f:
    code = f.read()

eq_section = """      {/* SONIC EQUALIZER */}
      {chartData.length > 0 && (
        <div className="glass-card p-6 h-[350px] flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-yellow-500/20 transition-all duration-700" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700" />
          
          <div className="flex items-center justify-between mb-4 z-10">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><path d="M12 2v20"/><path d="M17 7v10"/><path d="M22 10v4"/><path d="M7 10v4"/><path d="M2 14v-4"/></svg>
                Sonic Equalizer
              </h3>
              <p className="text-xs text-neutral-400 font-bold tracking-widest uppercase mt-1">Análisis de Frecuencia de Pistas</p>
            </div>
          </div>

          <div className="flex-1 z-10 w-full min-h-0 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap="15%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
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

"""

code = code.replace("      {/* Heatmap 1D Strip */}", eq_section + "      {/* Heatmap 1D Strip */}")

with open("src/components/AlbumGraphUI.tsx", "w") as f:
    f.write(code)


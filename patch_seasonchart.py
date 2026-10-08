import re

with open("src/components/SeasonChartUI.tsx", "r") as f:
    code = f.read()

# 1. Add BarChart imports
code = code.replace(
    'import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";',
    'import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";'
)

# 2. Add seasonDeltas calculation right after chartData useMemo
deltas_code = """  const seasonDeltas = useMemo(() => {
    const seasonTotals: Record<number, { sum: number; count: number }> = {};
    Object.keys(ratings).forEach(key => {
      const match = key.match(/S(\d+)E(\d+)/);
      if (match) {
        const s = parseInt(match[1]);
        if (!seasonTotals[s]) seasonTotals[s] = { sum: 0, count: 0 };
        seasonTotals[s].sum += ratings[key];
        seasonTotals[s].count += 1;
      }
    });

    const seasonAvgs: Record<number, number> = {};
    Object.keys(seasonTotals).forEach(s => {
      seasonAvgs[parseInt(s)] = seasonTotals[parseInt(s)].sum / seasonTotals[parseInt(s)].count;
    });

    const sortedSeasons = Object.keys(seasonAvgs).map(Number).sort((a,b) => a-b);
    const deltas = [];
    for (let i = 1; i < sortedSeasons.length; i++) {
      const prev = sortedSeasons[i-1];
      const curr = sortedSeasons[i];
      const delta = seasonAvgs[curr] - seasonAvgs[prev];
      deltas.push({
        name: `T${prev} → T${curr}`,
        delta: parseFloat(delta.toFixed(2)),
        isPositive: delta >= 0
      });
    }
    return deltas;
  }, [ratings]);

"""

chart_data_regex = r'(const chartData = useMemo\(\(\) => \{.*?\n  \}, \[ratings\]\);)'
code = re.sub(chart_data_regex, r'\1\n\n' + deltas_code, code, flags=re.DOTALL)

# 3. Add Valle de la Muerte chart below the main chart
# Look for:
#              </ResponsiveContainer>
#            </div>
#          )}
#        </div>
#
#        {/* Columna Derecha: Valorar Episodios (Temporada Activa) */}

valley_code = """              </ResponsiveContainer>
            </div>
          )}
          
          {/* VALLE DE LA MUERTE (Delta Chart) */}
          {seasonDeltas.length > 0 && (
            <div className="glass-card p-6 h-[250px] flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-red-500/20 transition-all duration-700" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-green-500/20 transition-all duration-700" />
              
              <div className="flex items-center justify-between mb-4 z-10">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    El Valle de la Muerte
                  </h3>
                  <p className="text-xs text-neutral-400 font-bold tracking-widest uppercase mt-1">Fluctuación de Calidad entre Temporadas</p>
                </div>
              </div>

              <div className="flex-1 z-10 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={seasonDeltas} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                      formatter={(value: number) => [`${value > 0 ? '+' : ''}${value}`, 'Delta']}
                    />
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
                    <Bar dataKey="delta" radius={[4, 4, 4, 4]} maxBarSize={60}>
                      {seasonDeltas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </div>"""

code = code.replace("""              </ResponsiveContainer>
            </div>
          )}
        </div>""", valley_code)

with open("src/components/SeasonChartUI.tsx", "w") as f:
    f.write(code)

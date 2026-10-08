import re

with open("src/components/RatingForm.tsx", "r") as f:
    code = f.read()

# 1. Update imports
code = code.replace(
    'import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";',
    'import { Radar, RadarChart, LineChart, Line, CartesianGrid, XAxis, YAxis, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";'
)

# 2. Add heartbeatData calculation right after radarData
radar_data_code = """  const radarData = categories.map(cat => ({
    subject: cat.label,
    A: ((scores[cat.id] || 0) / cat.max) * 100,
    fullMark: 100
  }));"""

heartbeat_data_code = """  const radarData = categories.map(cat => ({
    subject: cat.label,
    A: ((scores[cat.id] || 0) / cat.max) * 100,
    fullMark: 100
  }));

  const heartbeatData = type === 'book' ? categories.flatMap((cat) => {
    const val = ((scores[cat.id] || 0) / cat.max) * 100;
    // ECG P-QRS-T complex pattern
    return [
      { name: '', value: 10, category: cat.label, actualScore: val },
      { name: '', value: 5, category: cat.label, actualScore: val },
      { name: cat.label, value: Math.max(15, val), isPeak: true, category: cat.label, actualScore: val },
      { name: '', value: -5, category: cat.label, actualScore: val },
      { name: '', value: 12, category: cat.label, actualScore: val },
      { name: '', value: 10, category: cat.label, actualScore: val },
    ];
  }).concat([{ name: '', value: 10, category: '', actualScore: 0 }]) : [];"""

code = code.replace(radar_data_code, heartbeat_data_code)

# 3. Update Chart Title
old_title = '<h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-white transition-colors">Huella Digital (Spider Chart)</h4>'
new_title = '<h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-white transition-colors">{type === "book" ? "Lectrocardiograma (Heartbeat Chart)" : "Huella Digital (Spider Chart)"}</h4>'
code = code.replace(old_title, new_title)

# 4. Conditionally render LineChart instead of RadarChart
old_chart = """          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }} 
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                itemStyle={{ color: colorHex, fontWeight: 'black', fontSize: '16px' }}
                formatter={(value: any) => [`${Math.round(value)}%`, 'Fuerza del atributo']}
                labelStyle={{ display: 'none' }}
              />
              <Radar 
                name="Fuerza" 
                dataKey="A" 
                stroke={colorHex} 
                strokeWidth={3}
                fill={colorHex} 
                fillOpacity={0.25} 
                activeDot={{ r: 6, fill: '#fff', stroke: colorHex, strokeWidth: 2 }}
              />
            </RadarChart>
          </ResponsiveContainer>"""

new_chart = """          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            {type === 'book' ? (
              <LineChart data={heartbeatData} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(249, 115, 22, 0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} tickMargin={10} axisLine={false} tickLine={false} interval={5} />
                <YAxis domain={[-10, 110]} hide={true} />
                <RechartsTooltip 
                  cursor={{ stroke: 'rgba(249, 115, 22, 0.2)', strokeWidth: 2, strokeDasharray: '5 5' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      if (!data.isPeak) return null; // Solo mostramos tooltip en los picos reales
                      return (
                        <div className="bg-black/95 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">{data.category}</p>
                          <p className="text-xl font-black" style={{ color: colorHex }}>{Math.round(data.actualScore)}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="linear" 
                  dataKey="value" 
                  stroke={colorHex} 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, fill: '#000', stroke: colorHex, strokeWidth: 3 }}
                  style={{ filter: `drop-shadow(0 0 8px ${colorHex})` }}
                  animationDuration={2000}
                />
              </LineChart>
            ) : (
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: colorHex, fontWeight: 'black', fontSize: '16px' }}
                  formatter={(value: any) => [`${Math.round(value)}%`, 'Fuerza del atributo']}
                  labelStyle={{ display: 'none' }}
                />
                <Radar 
                  name="Fuerza" 
                  dataKey="A" 
                  stroke={colorHex} 
                  strokeWidth={3}
                  fill={colorHex} 
                  fillOpacity={0.25} 
                  activeDot={{ r: 6, fill: '#fff', stroke: colorHex, strokeWidth: 2 }}
                />
              </RadarChart>
            )}
          </ResponsiveContainer>"""

code = code.replace(old_chart, new_chart)

with open("src/components/RatingForm.tsx", "w") as f:
    f.write(code)


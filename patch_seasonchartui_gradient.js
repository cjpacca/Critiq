const fs = require('fs');
let code = fs.readFileSync('src/components/SeasonChartUI.tsx', 'utf8');

// Definir el Custom Dot
const customDotBlock = \`const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null) return null;
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={5} 
        fill={getColorForScore(payload.score)} 
        stroke="#000" 
        strokeWidth={2} 
      />
    );
  };\`;

// Insert the CustomDot definition just before the component return
code = code.replace(
  'const maxEpisodes = Math.max(...validSeasons.map(s => s.episode_count || 0), 1);',
  customDotBlock + '\\n\\n  const maxEpisodes = Math.max(...validSeasons.map(s => s.episode_count || 0), 1);'
);

// Update the LineChart
const oldChart = \`<LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickMargin={10} />
                  <YAxis domain={[0, 10]} stroke="rgba(255,255,255,0.3)" fontSize={11} tickCount={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#000' }} 
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} 
                  />
                </LineChart>\`;

const newChart = \`<LineChart data={chartData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="rgb(239, 68, 68)" />
                      <stop offset="25%" stopColor="rgb(249, 168, 21)" />
                      <stop offset="50%" stopColor="rgb(163, 230, 53)" />
                      <stop offset="75%" stopColor="rgb(16, 185, 129)" />
                      <stop offset="100%" stopColor="rgb(37, 99, 235)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickMargin={10} />
                  <YAxis domain={[0, 10]} stroke="rgba(255,255,255,0.3)" fontSize={11} tickCount={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    formatter={(value: number) => [<span style={{color: getColorForScore(value)}}>{value.toFixed(2)}</span>, 'Puntuación']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="url(#scoreGradient)" 
                    strokeWidth={4} 
                    dot={<CustomDot />}
                    activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2, fill: 'black' }} 
                  />
                </LineChart>\`;

code = code.replace(oldChart, newChart);

fs.writeFileSync('src/components/SeasonChartUI.tsx', code);

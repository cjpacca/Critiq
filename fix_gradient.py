with open("src/components/SeasonChartUI.tsx", "r") as f:
    code = f.read()

dynamic_gradient_code = """  // Dynamic gradient calculation
  const dynamicGradientStops = useMemo(() => {
    if (chartData.length === 0) return <stop offset="0%" stopColor="#fff" />;
    const minScore = Math.min(...chartData.map(d => d.score));
    const maxScore = Math.max(...chartData.map(d => d.score));
    const diff = maxScore - minScore;

    const stops = [];
    if (diff === 0) {
      stops.push(<stop key="min" offset="0%" stopColor={getColorForScore(minScore)} />);
      stops.push(<stop key="max" offset="100%" stopColor={getColorForScore(minScore)} />);
    } else {
      stops.push(<stop key="min" offset="0%" stopColor={getColorForScore(minScore)} />);
      for (let s = Math.ceil(minScore); s <= Math.floor(maxScore); s++) {
        if (s > minScore && s < maxScore) {
          const pct = ((s - minScore) / diff) * 100;
          stops.push(<stop key={s} offset={`${pct}%`} stopColor={getColorForScore(s)} />);
        }
      }
      stops.push(<stop key="max" offset="100%" stopColor={getColorForScore(maxScore)} />);
    }
    return stops;
  }, [chartData]);

  return ("""

code = code.replace("  return (", dynamic_gradient_code, 1)

old_gradient = """                    <linearGradient id="scoreGradient" x1="0" y1="1" x2="0" y2="0">
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

new_gradient = """                    <linearGradient id="scoreGradient" x1="0" y1="1" x2="0" y2="0">
                      {dynamicGradientStops}
                    </linearGradient>"""

code = code.replace(old_gradient, new_gradient)

with open("src/components/SeasonChartUI.tsx", "w") as f:
    f.write(code)


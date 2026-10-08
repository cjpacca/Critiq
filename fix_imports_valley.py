with open("src/components/SeasonChartUI.tsx", "r") as f:
    code = f.read()

code = code.replace(
    'import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";',
    'import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";'
)

# Fix TS error on formatter
code = code.replace(
    "formatter={(value) => [`${value > 0 ? '+' : ''}${value}`, 'Delta']}",
    "formatter={(value: any) => [`${value > 0 ? '+' : ''}${value}`, 'Delta']}"
)

with open("src/components/SeasonChartUI.tsx", "w") as f:
    f.write(code)

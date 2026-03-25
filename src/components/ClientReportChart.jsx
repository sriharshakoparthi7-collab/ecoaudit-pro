import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#2d9e6b', '#3b9eca', '#74c99a', '#68b8de', '#a8dfc2', '#92cfe8', '#c6f0da', '#b8e2f5'];

function formatLabel(str) {
  if (str.length > 14) return str.slice(0, 12) + '…';
  return str;
}

export default function ClientReportChart({ items, groupBy }) {
  const groupKey = groupBy === 'category' ? 'category' : 'zone';

  // Build chart data: count per group
  const map = {};
  items.forEach(item => {
    const key = item[groupKey];
    if (!map[key]) map[key] = { name: key, count: 0, value: 0 };
    map[key].count += 1;
    map[key].value += item.value || 0;
  });
  const data = Object.values(map).sort((a, b) => b.count - a.count);

  if (!data.length) {
    return (
      <div className="bg-card border border-border rounded-xl h-48 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No data to display</p>
      </div>
    );
  }

  const isMany = data.length > 5;

  if (isMany) {
    // Pie chart for many categories
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="count"
                nameKey="name"
                label={({ name, percent }) => `${formatLabel(name)} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val, name) => [val, 'Items']} />
              <Legend formatter={v => formatLabel(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={formatLabel}
            />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(val) => [val, 'Items']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
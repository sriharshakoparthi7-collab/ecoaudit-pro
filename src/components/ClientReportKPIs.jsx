import { Zap, Wind, Sun, Layers } from 'lucide-react';

export default function ClientReportKPIs({ items, groupBy, zones }) {
  const totalItems = items.length;
  const totalKW = items
    .filter(i => ['HVAC Unit', 'Lighting System', 'Solar PV'].includes(i.category))
    .reduce((s, i) => s + (i.value || 0), 0);
  const hvacCount = items.filter(i => i.category === 'HVAC Unit').length;
  const lightingKW = items
    .filter(i => i.category === 'Lighting System')
    .reduce((s, i) => s + (i.value || 0), 0);
  const solarKW = items
    .filter(i => i.category === 'Solar PV')
    .reduce((s, i) => s + (i.value || 0), 0);

  const kpis = [
    {
      label: 'Total Equipment Items',
      value: totalItems,
      unit: 'items',
      icon: Layers,
      color: 'text-primary bg-primary/10',
    },
    {
      label: 'Total HVAC Capacity',
      value: items.filter(i => i.category === 'HVAC Unit').reduce((s, i) => s + i.value, 0).toFixed(1),
      unit: 'kW',
      icon: Wind,
      color: 'text-sky-600 bg-sky-50',
    },
    {
      label: 'Lighting Load',
      value: lightingKW.toFixed(2),
      unit: 'kW',
      icon: Zap,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Solar PV Capacity',
      value: solarKW.toFixed(1),
      unit: 'kW',
      icon: Sun,
      color: 'text-green-600 bg-green-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const [text, bg] = kpi.color.split(' ');
        return (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${text}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{kpi.unit}</p>
            <p className="text-xs font-medium text-muted-foreground mt-2">{kpi.label}</p>
          </div>
        );
      })}
    </div>
  );
}
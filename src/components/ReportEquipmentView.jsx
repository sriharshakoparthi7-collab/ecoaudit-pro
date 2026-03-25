import { EQUIPMENT_TYPES } from './EquipmentGrid';
import CSVExport from './CSVExport';

export default function ReportEquipmentView({ equipment, zones }) {
  const zoneMap = {};
  zones.forEach(z => { zoneMap[z.id] = z.zone_name; });

  const excludeKeys = ['id', 'created_by', 'updated_date', 'created_date', 'audit_id', 'zone_id'];

  return (
    <div className="space-y-6">
      {EQUIPMENT_TYPES.map(config => {
        const items = equipment[config.key] || [];
        if (!items.length) return null;

        const Icon = config.icon;
        const [textColor, bgColor] = config.color.split(' ');

        // Add zone name to items for display
        const enrichedItems = items.map(i => ({ zone: zoneMap[i.zone_id] || 'Unknown', ...i }));
        const keys = ['zone', ...Object.keys(items[0]).filter(k => !excludeKeys.includes(k) && items.some(i => i[k]))];

        return (
          <div key={config.key}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg ${bgColor} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${textColor}`} />
                </div>
                All {config.label}s ({items.length})
              </h3>
              <CSVExport data={enrichedItems} filename={`${config.key}_all`} />
            </div>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    {keys.map(k => (
                      <th key={k} className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">
                        {k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {enrichedItems.map((item, i) => (
                    <tr key={item.id || i} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                      {keys.map(k => (
                        <td key={k} className="px-3 py-2 text-foreground whitespace-nowrap max-w-[200px] truncate">
                          {item[k]?.toString().startsWith('http') ? (
                            <a href={item[k]} target="_blank" rel="noopener noreferrer" className="text-accent underline">View</a>
                          ) : (
                            item[k] ?? '—'
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
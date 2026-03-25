import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MapPin } from 'lucide-react';
import { EQUIPMENT_TYPES } from './EquipmentGrid';
import CSVExport from './CSVExport';

function EquipmentTable({ items, type }) {
  if (!items?.length) return null;
  const config = EQUIPMENT_TYPES.find(e => e.key === type);
  const Icon = config.icon;
  const [textColor] = config.color.split(' ');

  // Get visible keys
  const excludeKeys = ['id', 'created_by', 'updated_date', 'created_date', 'audit_id', 'zone_id'];
  const keys = Object.keys(items[0]).filter(k => !excludeKeys.includes(k) && items.some(i => i[k]));

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
          <Icon className={`w-3.5 h-3.5 ${textColor}`} />
          {config.label}s ({items.length})
        </h4>
        <CSVExport data={items} filename={`${type}_zone`} label="CSV" />
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
            {items.map((item, i) => (
              <tr key={item.id} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
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
}

export default function ReportZoneView({ zones, equipment }) {
  return (
    <Accordion type="multiple" className="space-y-2">
      {zones.map(zone => {
        const zoneEquipment = {};
        Object.entries(equipment).forEach(([type, items]) => {
          const zoneItems = items.filter(i => i.zone_id === zone.id);
          if (zoneItems.length) zoneEquipment[type] = zoneItems;
        });
        const totalItems = Object.values(zoneEquipment).reduce((s, a) => s + a.length, 0);

        return (
          <AccordionItem key={zone.id} value={zone.id} className="border border-border rounded-xl overflow-hidden bg-card">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{zone.zone_name}</p>
                  <p className="text-xs text-muted-foreground">{totalItems} items</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {totalItems === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No equipment in this zone</p>
              ) : (
                Object.entries(zoneEquipment).map(([type, items]) => (
                  <EquipmentTable key={type} items={items} type={type} />
                ))
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
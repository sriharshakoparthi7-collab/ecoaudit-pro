import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EQUIPMENT_TYPES } from './EquipmentGrid';

function getEquipmentLabel(item, type) {
  switch (type) {
    case 'main_switchboard': return item.name || 'Main Switchboard';
    case 'additional_switchboard': return item.name || 'Additional Switchboard';
    case 'hvac': return item.unit_name || 'HVAC Unit';
    case 'lighting': return item.light_type || 'Lighting System';
    case 'solar': return `Solar PV ${item.system_size_kw ? `(${item.system_size_kw} kW)` : ''}`;
    case 'forklift': return item.charger_type || 'Forklift Charger';
    case 'hotwater': return item.dhw_details_type || 'Hot Water System';
    default: return 'Equipment';
  }
}

function getEquipmentSubLabel(item, type) {
  switch (type) {
    case 'main_switchboard':
    case 'additional_switchboard': return item.location || '';
    case 'hvac': return [item.make, item.model].filter(Boolean).join(' — ') || item.location || '';
    case 'lighting': return item.area_location ? `${item.area_location}${item.quantity ? ` × ${item.quantity}` : ''}` : '';
    case 'solar': return item.inverter_brand_model || '';
    case 'forklift': return item.brand_model || '';
    case 'hotwater': return item.fuel_type ? `${item.fuel_type}${item.size_liters ? ` — ${item.size_liters}L` : ''}` : '';
    default: return '';
  }
}

export default function EquipmentList({ items, type, onDelete, onEdit }) {
  const config = EQUIPMENT_TYPES.find(e => e.key === type);
  if (!config || !items.length) return null;

  const Icon = config.icon;
  const [textColor, bgColor] = config.color.split(' ');

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Icon className={`w-3.5 h-3.5 ${textColor}`} />
        {config.label}s ({items.length})
      </h4>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${textColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{getEquipmentLabel(item, type)}</p>
              {getEquipmentSubLabel(item, type) && (
                <p className="text-xs text-muted-foreground truncate">{getEquipmentSubLabel(item, type)}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(item)}>
              <Edit className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={() => onDelete(item.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
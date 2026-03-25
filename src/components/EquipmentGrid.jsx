import {
  Zap, Wind, Lightbulb, Sun, BatteryCharging, Flame, CircuitBoard
} from 'lucide-react';

const EQUIPMENT_TYPES = [
  { key: 'main_switchboard', label: 'Main Switchboard', icon: Zap, color: 'text-amber-600 bg-amber-50' },
  { key: 'additional_switchboard', label: 'Additional Switchboard', icon: CircuitBoard, color: 'text-orange-600 bg-orange-50' },
  { key: 'hvac', label: 'HVAC Unit', icon: Wind, color: 'text-sky-600 bg-sky-50' },
  { key: 'lighting', label: 'Lighting System', icon: Lightbulb, color: 'text-yellow-600 bg-yellow-50' },
  { key: 'solar', label: 'Solar PV', icon: Sun, color: 'text-green-600 bg-green-50' },
  { key: 'forklift', label: 'Forklift Charger', icon: BatteryCharging, color: 'text-purple-600 bg-purple-50' },
  { key: 'hotwater', label: 'Hot Water System', icon: Flame, color: 'text-red-500 bg-red-50' },
];

export default function EquipmentGrid({ onAdd }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {EQUIPMENT_TYPES.map((eq) => {
        const Icon = eq.icon;
        const [textColor, bgColor] = eq.color.split(' ');
        return (
          <button
            key={eq.key}
            onClick={() => onAdd(eq.key)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/30 transition-all duration-300 active:scale-95"
          >
            <div className={`w-11 h-11 rounded-xl ${bgColor} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${textColor}`} />
            </div>
            <span className="text-xs font-medium text-foreground text-center leading-tight">
              + {eq.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { EQUIPMENT_TYPES };
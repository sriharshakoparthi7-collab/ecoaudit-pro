import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const SECTIONS = [
  { key: 'execSummary', label: 'Executive Summary', placeholder: 'Enter a custom executive summary paragraph...' },
  { key: 'obs_msb', label: 'Obs: Main Switchboard', placeholder: 'Enter observations for main switchboard (optional — only appears if content is added)' },
  { key: 'obs_asb', label: 'Obs: Additional Switchboards', placeholder: 'Enter observations for additional switchboards (optional — only appears if content is added)' },
  { key: 'obs_hvac', label: 'Obs: HVAC Units', placeholder: 'Enter observations for HVAC equipment (optional — only appears if content is added)' },
  { key: 'obs_lighting', label: 'Obs: Lighting Upgrades', placeholder: 'Enter observations for lighting equipment (optional — only appears if content is added)' },
  { key: 'obs_solar', label: 'Obs: Solar PV', placeholder: 'Enter observations for solar PV equipment (optional — only appears if content is added)' },
  { key: 'obs_forklift', label: 'Obs: Forklift Charging', placeholder: 'Enter observations for forklift charger equipment (optional — only appears if content is added)' },
  { key: 'obs_hotwater', label: 'Obs: Hot Water Systems', placeholder: 'Enter observations for hot water equipment (optional — only appears if content is added)' },
  { key: 'obs_general_water', label: 'Obs: General Water', placeholder: 'Enter observations for general water systems (optional — only appears if content is added)' },
  { key: 'obs_general_electricity', label: 'Obs: General Electricity', placeholder: 'Enter observations for general electricity (optional — only appears if content is added)' },
];

export default function ReportContentEditor({ content, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
      >
        <span>✏️ Edit Report Content</span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="border-t border-border divide-y divide-border">
          {SECTIONS.map(({ key, label, placeholder }) => (
            <div key={key} className="px-4 py-3">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                {label}
              </label>
              <textarea
                rows={3}
                className="w-full text-sm rounded-lg border border-input bg-background px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={placeholder}
                value={content[key] || ''}
                onChange={e => onChange({ ...content, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
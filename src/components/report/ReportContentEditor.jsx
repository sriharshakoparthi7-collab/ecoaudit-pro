import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const SECTIONS = [
  { key: 'execSummary', label: 'Executive Summary', placeholder: 'Enter a custom executive summary paragraph...' },
  { key: 'obs_lighting', label: '7.1 Lighting Upgrades — Notes', placeholder: 'Additional observations for lighting...' },
  { key: 'obs_solar', label: '7.2 Solar PV — Notes', placeholder: 'Additional observations for solar PV...' },
  { key: 'obs_forklift', label: '7.3 Forklift Charging — Notes', placeholder: 'Additional observations for forklift charging...' },
  { key: 'obs_hotwater', label: '7.4 Hot Water — Notes', placeholder: 'Additional observations for hot water...' },
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
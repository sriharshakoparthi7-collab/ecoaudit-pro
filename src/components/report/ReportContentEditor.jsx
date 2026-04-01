import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Save, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ENTITY_MAP = {
  audit: 'Audit',
  mains: 'MainSwitchboard',
  additionals: 'AdditionalSwitchboard',
  hvacs: 'HVACUnit',
  lights: 'LightingSystem',
  solars: 'SolarPV',
  forklifts: 'ForkliftCharger',
  hotWaters: 'HotWaterSystem',
};

const SECTION_FIELDS = {
  audit: [
    { key: 'site_name', label: 'Site Name' },
    { key: 'site_address', label: 'Site Address' },
    { key: 'inspector_name', label: 'Inspector Name' },
  ],
  mains: [
    { key: 'sub_circuits_description', label: 'Sub-Circuits Description', multi: true },
    { key: 'comments', label: 'Auditor Comments', multi: true },
    { key: 'extra_notes', label: 'Additional Notes', multi: true },
  ],
  additionals: [
    { key: 'sub_circuits_description', label: 'Sub-Circuits Description', multi: true },
    { key: 'comments', label: 'Comments', multi: true },
    { key: 'extra_notes', label: 'Additional Notes', multi: true },
  ],
  hvacs: [
    { key: 'system_coverage', label: 'System Coverage' },
    { key: 'controller_type', label: 'Controller Type' },
    { key: 'extra_notes', label: 'Additional Notes', multi: true },
  ],
  lights: [
    { key: 'controls_type', label: 'Controls Type' },
    { key: 'circuit_grouping', label: 'Circuit Grouping' },
    { key: 'access_limitations', label: 'Access / Installation Limitations', multi: true },
    { key: 'energy_improvement_observations', label: 'Observations for Energy Improvement', multi: true },
    { key: 'extra_notes', label: 'Additional Notes', multi: true },
  ],
  solars: [
    { key: 'cable_route_description', label: 'Cable Route Description', multi: true },
    { key: 'energy_improvement_observations', label: 'Observations for Energy Improvements', multi: true },
    { key: 'extra_notes', label: 'Additional Notes', multi: true },
  ],
  forklifts: [
    { key: 'connection_description', label: 'Connection Description', multi: true },
    { key: 'energy_improvement_observations', label: 'Observations for Energy Improvement', multi: true },
    { key: 'extra_notes', label: 'Additional Notes', multi: true },
  ],
  hotWaters: [
    { key: 'additional_comments', label: 'Additional Comments', multi: true },
    { key: 'energy_improvement_observations', label: 'Observations for Energy Improvements', multi: true },
    { key: 'extra_notes', label: 'Additional Notes', multi: true },
  ],
};

const SECTION_LABELS = {
  audit: 'Audit Details',
  mains: 'Main Switchboards',
  additionals: 'Additional Switchboards',
  hvacs: 'HVAC Units',
  lights: 'Lighting Systems',
  solars: 'Solar PV',
  forklifts: 'Forklift Chargers',
  hotWaters: 'Hot Water Systems',
};

function getItemName(type, item) {
  const names = { mains: item.name, additionals: item.name, hvacs: item.unit_name, lights: item.light_type, solars: `Solar PV`, forklifts: item.charger_type, hotWaters: item.dhw_details_type };
  return names[type] || 'Item';
}

function EditSection({ sectionKey, items, onSaved }) {
  const [open, setOpen] = useState(false);
  const [edits, setEdits] = useState({});
  const [saving, setSaving] = useState({});
  const fields = SECTION_FIELDS[sectionKey] || [];

  const handleChange = (id, key, val) => {
    setEdits(prev => ({ ...prev, [`${id}-${key}`]: val }));
  };

  const getValue = (item, key) => {
    const editKey = `${item.id}-${key}`;
    return editKey in edits ? edits[editKey] : (item[key] ?? '');
  };

  const handleSave = async (item) => {
    const saveKey = item.id;
    setSaving(prev => ({ ...prev, [saveKey]: true }));
    const updates = {};
    fields.forEach(f => {
      const editKey = `${item.id}-${f.key}`;
      if (editKey in edits) updates[f.key] = edits[editKey];
    });
    if (Object.keys(updates).length > 0) {
      const entityName = ENTITY_MAP[sectionKey];
      await base44.entities[entityName].update(item.id, updates);
      onSaved(sectionKey, item.id, updates);
    }
    setSaving(prev => ({ ...prev, [saveKey]: false }));
  };

  const handleAuditSave = async (item) => {
    const saveKey = item.id;
    setSaving(prev => ({ ...prev, [saveKey]: true }));
    const updates = {};
    fields.forEach(f => {
      const editKey = `${item.id}-${f.key}`;
      if (editKey in edits) updates[f.key] = edits[editKey];
    });
    if (Object.keys(updates).length > 0) {
      await base44.entities.Audit.update(item.id, updates);
      onSaved('audit', item.id, updates);
    }
    setSaving(prev => ({ ...prev, [saveKey]: false }));
  };

  const isAudit = sectionKey === 'audit';
  const isEmpty = !items || (Array.isArray(items) ? items.length === 0 : false);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/50 transition-colors text-left"
      >
        <span className="font-semibold text-sm text-foreground">{SECTION_LABELS[sectionKey]}</span>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="p-4 space-y-5 bg-background border-t border-border">
          {isEmpty ? (
            <p className="text-xs text-muted-foreground italic">No records in this section.</p>
          ) : (
            (isAudit ? [items] : items).map((item) => (
              <div key={item.id} className="space-y-3">
                {!isAudit && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{getItemName(sectionKey, item)}</p>
                )}
                {fields.map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
                    {f.multi ? (
                      <textarea
                        className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                        rows={3}
                        value={getValue(item, f.key)}
                        onChange={e => handleChange(item.id, f.key, e.target.value)}
                      />
                    ) : (
                      <input
                        className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                        value={getValue(item, f.key)}
                        onChange={e => handleChange(item.id, f.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => isAudit ? handleAuditSave(item) : handleSave(item)}
                    disabled={saving[item.id]}
                  >
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    {saving[item.id] ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function ReportContentEditor({ rawData, onSaved }) {
  if (!rawData) return null;

  const sections = [
    { key: 'audit', items: rawData.audit },
    { key: 'mains', items: rawData.mains },
    { key: 'additionals', items: rawData.additionals },
    { key: 'hvacs', items: rawData.hvacs },
    { key: 'lights', items: rawData.lights },
    { key: 'solars', items: rawData.solars },
    { key: 'forklifts', items: rawData.forklifts },
    { key: 'hotWaters', items: rawData.hotWaters },
  ];

  return (
    <div className="space-y-3">
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-2">
        <p className="text-sm text-muted-foreground">
          Edit the written content for each section. Changes are saved directly and will appear in the report.
        </p>
      </div>
      {sections.map(s => (
        <EditSection key={s.key} sectionKey={s.key} items={s.items} onSaved={onSaved} />
      ))}
    </div>
  );
}
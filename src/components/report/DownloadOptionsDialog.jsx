import { useState, useEffect } from 'react';
import { Download, X, ChevronDown, ChevronRight, CheckSquare, Square } from 'lucide-react';

const SECTIONS = [
  { key: 'electrical', label: 'Electrical Infrastructure', itemsKey: null },
  { key: 'hvac', label: 'HVAC Systems', itemsKey: 'hvacs' },
  { key: 'lighting', label: 'Lighting Systems', itemsKey: 'lights' },
  { key: 'solar', label: 'Solar PV Infrastructure', itemsKey: 'solars' },
  { key: 'forklift', label: 'Forklift Charging Operations', itemsKey: 'forklifts' },
  { key: 'hotwater', label: 'Hot Water Systems', itemsKey: 'hotWaters' },
  { key: 'observations', label: 'Consolidated Observations', itemsKey: null },
];

function getItemLabel(item, sectionKey, index) {
  switch (sectionKey) {
    case 'hvac': return item.unit_name || `HVAC Unit ${index + 1}`;
    case 'lighting': return [item.light_type, item.area_location].filter(Boolean).join(' — ') || `Fixture ${index + 1}`;
    case 'solar': return `Solar PV ${index + 1}${item.system_size_kw ? ` (${item.system_size_kw} kW)` : ''}`;
    case 'forklift': return [item.charger_type, item.brand_model].filter(Boolean).join(' — ') || `Charger ${index + 1}`;
    case 'hotwater': return item.dhw_details_type || `DHW System ${index + 1}`;
    default: return `Item ${index + 1}`;
  }
}

export default function DownloadOptionsDialog({ open, onClose, data, onExport }) {
  const [selectedSections, setSelectedSections] = useState(new Set(SECTIONS.map(s => s.key)));
  const [selectedItems, setSelectedItems] = useState({});
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!open || !data) return;
    // Init item selections: all selected
    const itemSel = {};
    SECTIONS.forEach(s => {
      if (s.itemsKey && data[s.itemsKey]?.length) {
        itemSel[s.key] = new Set(data[s.itemsKey].map(i => i.id));
      }
    });
    setSelectedItems(itemSel);
    setSelectedSections(new Set(SECTIONS.map(s => s.key)));
  }, [open, data]);

  if (!open) return null;

  const toggleSection = (key) => {
    setSelectedSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const toggleItem = (sectionKey, itemId) => {
    setSelectedItems(prev => {
      const set = new Set(prev[sectionKey] || []);
      if (set.has(itemId)) set.delete(itemId); else set.add(itemId);
      return { ...prev, [sectionKey]: set };
    });
  };

  const toggleAllItems = (sectionKey, items) => {
    setSelectedItems(prev => {
      const set = prev[sectionKey] || new Set();
      const allSelected = items.every(i => set.has(i.id));
      return { ...prev, [sectionKey]: allSelected ? new Set() : new Set(items.map(i => i.id)) };
    });
  };

  const selectAll = () => {
    setSelectedSections(new Set(SECTIONS.map(s => s.key)));
    const itemSel = {};
    SECTIONS.forEach(s => {
      if (s.itemsKey && data[s.itemsKey]?.length) {
        itemSel[s.key] = new Set(data[s.itemsKey].map(i => i.id));
      }
    });
    setSelectedItems(itemSel);
  };

  const handleExport = () => {
    const config = {
      sections: selectedSections,
      items: selectedItems,
    };
    onExport(config);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '480px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1B4040', margin: 0 }}>Download Report</h2>
            <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0' }}>Select sections and equipment items to include</p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={18} color="#666" />
          </button>
        </div>

        {/* Controls */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '8px' }}>
          <button onClick={selectAll} style={{ fontSize: '12px', color: '#1B4040', fontWeight: 600, border: '1px solid #1B4040', borderRadius: '6px', padding: '4px 12px', background: 'none', cursor: 'pointer' }}>
            Select All
          </button>
          <button onClick={() => setSelectedSections(new Set())} style={{ fontSize: '12px', color: '#666', border: '1px solid #ddd', borderRadius: '6px', padding: '4px 12px', background: 'none', cursor: 'pointer' }}>
            Clear All
          </button>
          <span style={{ fontSize: '12px', color: '#999', marginLeft: 'auto', alignSelf: 'center' }}>
            {selectedSections.size} of {SECTIONS.length} sections
          </span>
        </div>

        {/* Section List */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
          {SECTIONS.map(section => {
            const items = section.itemsKey ? (data?.[section.itemsKey] || []) : [];
            const hasItems = items.length > 0;
            const isSelected = selectedSections.has(section.key);
            const isExpanded = expanded[section.key];
            const itemSet = selectedItems[section.key] || new Set();
            const allItemsSelected = items.every(i => itemSet.has(i.id));
            const someItemsSelected = items.some(i => itemSet.has(i.id));

            return (
              <div key={section.key} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 24px', cursor: 'pointer' }}
                  onClick={() => toggleSection(section.key)}>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                    {isSelected ? <CheckSquare size={18} color="#1B4040" /> : <Square size={18} color="#bbb" />}
                  </button>
                  <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: isSelected ? '#1B4040' : '#999' }}>
                    {section.label}
                  </span>
                  {hasItems && isSelected && (
                    <span style={{ fontSize: '11px', color: '#888' }}>
                      {itemSet.size}/{items.length} items
                    </span>
                  )}
                  {hasItems && (
                    <button
                      onClick={e => { e.stopPropagation(); setExpanded(prev => ({ ...prev, [section.key]: !prev[section.key] })); }}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}
                    >
                      {isExpanded ? <ChevronDown size={14} color="#888" /> : <ChevronRight size={14} color="#888" />}
                    </button>
                  )}
                </div>

                {hasItems && isExpanded && (
                  <div style={{ background: '#fafafa', padding: '6px 24px 10px 50px', borderTop: '1px solid #f0f0f0' }}>
                    <button
                      onClick={() => toggleAllItems(section.key, items)}
                      style={{ fontSize: '11px', color: '#1B4040', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', padding: '2px 0 6px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {allItemsSelected ? <CheckSquare size={13} color="#1B4040" /> : someItemsSelected ? <CheckSquare size={13} color="#aaa" /> : <Square size={13} color="#bbb" />}
                      {allItemsSelected ? 'Deselect all' : 'Select all'}
                    </button>
                    {items.map((item, idx) => (
                      <div key={item.id}
                        onClick={() => { if (isSelected) toggleItem(section.key, item.id); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', cursor: isSelected ? 'pointer' : 'not-allowed', opacity: isSelected ? 1 : 0.4 }}>
                        {itemSet.has(item.id) ? <CheckSquare size={14} color="#1B4040" /> : <Square size={14} color="#bbb" />}
                        <span style={{ fontSize: '12px', color: '#444' }}>{getItemLabel(item, section.key, idx)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', fontSize: '13px', cursor: 'pointer', color: '#555' }}>
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={selectedSections.size === 0}
            style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: selectedSections.size === 0 ? '#ccc' : '#1B4040', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: selectedSections.size === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
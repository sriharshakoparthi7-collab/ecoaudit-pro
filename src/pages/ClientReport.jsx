import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Printer, Layers, LayoutGrid, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import ClientReportKPIs from '../components/ClientReportKPIs';
import ClientReportChart from '../components/ClientReportChart';
import ClientReportTables from '../components/ClientReportTables';

const ENTITY_MAP = {
  'HVAC Unit': 'HVACUnit',
  'Lighting System': 'LightingSystem',
  'Main Switchboard': 'MainSwitchboard',
  'Additional Switchboard': 'AdditionalSwitchboard',
  'Solar PV': 'SolarPV',
  'Forklift Charger': 'ForkliftCharger',
  'Hot Water System': 'HotWaterSystem',
};

function getItemName(item, category) {
  switch (category) {
    case 'HVAC Unit': return item.unit_name || 'HVAC Unit';
    case 'Lighting System': return item.light_type || 'Lighting System';
    case 'Main Switchboard':
    case 'Additional Switchboard': return item.name || category;
    case 'Solar PV': return `Solar PV${item.inverter_brand_model ? ` — ${item.inverter_brand_model}` : ''}`;
    case 'Forklift Charger': return item.charger_type || 'Forklift Charger';
    case 'Hot Water System': return item.dhw_details_type || 'Hot Water System';
    default: return category;
  }
}

function getValue(item, category) {
  switch (category) {
    case 'HVAC Unit': return (item.cooling_capacity_kw || 0) + (item.heating_capacity_kw || 0);
    case 'Lighting System': return (item.rated_wattage || 0) * (item.quantity || 1) / 1000;
    case 'Solar PV': return item.system_size_kw || 0;
    case 'Forklift Charger': return item.quantity || 1;
    case 'Hot Water System': return item.size_liters || 0;
    default: return 1;
  }
}

function getValueUnit(category) {
  switch (category) {
    case 'HVAC Unit': return 'kW';
    case 'Lighting System': return 'kW';
    case 'Solar PV': return 'kW';
    case 'Forklift Charger': return 'units';
    case 'Hot Water System': return 'L';
    default: return 'count';
  }
}

function getNotes(item, category) {
  return item.comments || item.cable_route_description || item.location || item.area_location || '';
}

export default function ClientReport() {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState(null);
  const [items, setItems] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState('category');
  const reportRef = useRef(null);

  useEffect(() => {
    loadData();
  }, [auditId]);

  const loadData = async () => {
    const [auditData, zonesData, ...eqResults] = await Promise.all([
      base44.entities.Audit.filter({ id: auditId }),
      base44.entities.Zone.filter({ audit_id: auditId }),
      ...Object.entries(ENTITY_MAP).map(([cat, entity]) =>
        base44.entities[entity].filter({ audit_id: auditId }).then(rows => [cat, rows])
      ),
    ]);

    if (auditData.length) setAudit(auditData[0]);
    const zoneMap = {};
    zonesData.forEach(z => { zoneMap[z.id] = z.zone_name; });
    setZones(zonesData);

    const flat = [];
    eqResults.forEach(([category, rows]) => {
      rows.forEach(item => {
        flat.push({
          id: item.id,
          item_name: getItemName(item, category),
          value: getValue(item, category),
          value_unit: getValueUnit(category),
          category,
          zone: zoneMap[item.zone_id] || 'Unassigned',
          notes: getNotes(item, category),
        });
      });
    });
    setItems(flat);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-page { padding: 0 !important; }
          body { background: white !important; }
          .report-section { break-inside: avoid; }
          table { break-inside: avoid; }
          thead { display: table-header-group; }
        }
      `}</style>

      <div ref={reportRef} className="space-y-8 print-page">
        {/* Controls Bar */}
        <div className="no-print flex items-center justify-between">
          <button
            onClick={() => navigate(`/audit/${auditId}/report`)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Report
          </button>
          <div className="flex items-center gap-2">
            {/* Grouping Toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1 gap-1">
              <button
                onClick={() => setGroupBy('category')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  groupBy === 'category' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                By Category
              </button>
              <button
                onClick={() => setGroupBy('zone')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  groupBy === 'zone' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                By Zone
              </button>
            </div>
            <Button size="sm" onClick={handlePrint} className="text-xs">
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print / PDF
            </Button>
          </div>
        </div>

        {/* Report Header */}
        <div className="report-section border-b border-border pb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-semibold text-primary">Sustainability Wise</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">{audit?.site_name}</h1>
              <p className="text-base text-muted-foreground mt-1">{audit?.site_address}</p>
            </div>
            <div className="text-right text-sm text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Energy Audit Report</p>
              <p>{moment(audit?.audit_date).format('MMMM D, YYYY')}</p>
              <p>Inspector: {audit?.inspector_name}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {audit?.status}
              </span>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="report-section">
          <ClientReportKPIs items={items} groupBy={groupBy} zones={zones} />
        </div>

        {/* Chart */}
        <div className="report-section">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {groupBy === 'category' ? 'Energy Load by Category' : 'Equipment Distribution by Zone'}
          </h2>
          <ClientReportChart items={items} groupBy={groupBy} />
        </div>

        {/* Grouped Tables */}
        <div className="report-section">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {groupBy === 'category' ? 'Detailed Findings by Category' : 'Detailed Findings by Zone'}
          </h2>
          <ClientReportTables items={items} groupBy={groupBy} />
        </div>

        {/* Footer */}
        <div className="report-section border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            This report was generated by Sustainability Wise Energy Audit Platform.
            Report date: {moment().format('MMMM D, YYYY')}. Confidential.
          </p>
        </div>
      </div>
    </>
  );
}
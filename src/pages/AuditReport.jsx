import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Layers, LayoutGrid, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReportZoneView from '../components/ReportZoneView';
import ReportEquipmentView from '../components/ReportEquipmentView';
import moment from 'moment';

const ENTITY_MAP = {
  main_switchboard: 'MainSwitchboard',
  additional_switchboard: 'AdditionalSwitchboard',
  hvac: 'HVACUnit',
  lighting: 'LightingSystem',
  solar: 'SolarPV',
  forklift: 'ForkliftCharger',
  hotwater: 'HotWaterSystem',
};

export default function AuditReport() {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState(null);
  const [zones, setZones] = useState([]);
  const [equipment, setEquipment] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [auditId]);

  const loadData = async () => {
    const [auditData, zonesData, ...eqResults] = await Promise.all([
      base44.entities.Audit.filter({ id: auditId }),
      base44.entities.Zone.filter({ audit_id: auditId }),
      ...Object.entries(ENTITY_MAP).map(([key, entity]) =>
        base44.entities[entity].filter({ audit_id: auditId }).then(items => [key, items])
      ),
    ]);
    if (auditData.length) setAudit(auditData[0]);
    setZones(zonesData);
    const eqMap = {};
    eqResults.forEach(([key, items]) => { eqMap[key] = items; });
    setEquipment(eqMap);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const totalEquipment = Object.values(equipment).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
      <button
        onClick={() => navigate(`/audit/${auditId}`)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Audit
      </button>
      <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-2xl p-5 border border-primary/10">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">{audit?.site_name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{audit?.site_address}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span>{audit?.inspector_name}</span>
              <span>{moment(audit?.audit_date).format('MMM D, YYYY')}</span>
              <span>{zones.length} zones</span>
              <span>{totalEquipment} items</span>
            </div>
          </div>
          <a href={`/audit/${auditId}/photo-preview`} className="flex-shrink-0">
            <Button size="sm" className="text-xs">
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Client Report
            </Button>
          </a>
          </div>
        </div>
      </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="zone">
        <TabsList className="w-full">
          <TabsTrigger value="zone" className="flex-1 text-xs">
            <Layers className="w-3.5 h-3.5 mr-1.5" />
            By Zone
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex-1 text-xs">
            <LayoutGrid className="w-3.5 h-3.5 mr-1.5" />
            By Equipment
          </TabsTrigger>
        </TabsList>
        <TabsContent value="zone" className="mt-4">
          <ReportZoneView zones={zones} equipment={equipment} />
        </TabsContent>
        <TabsContent value="equipment" className="mt-4">
          <ReportEquipmentView equipment={equipment} zones={zones} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
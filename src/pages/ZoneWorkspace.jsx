import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Loader2 } from 'lucide-react';
import MultiPhotoUpload from '../components/MultiPhotoUpload';
import { toast } from 'sonner';
import EquipmentGrid from '../components/EquipmentGrid';
import EquipmentList from '../components/EquipmentList';
import EquipmentFormDialog from '../components/EquipmentFormDialog';

const ENTITY_MAP = {
  main_switchboard: 'MainSwitchboard',
  additional_switchboard: 'AdditionalSwitchboard',
  hvac: 'HVACUnit',
  lighting: 'LightingSystem',
  solar: 'SolarPV',
  forklift: 'ForkliftCharger',
  hotwater: 'HotWaterSystem',
  general_water: 'GeneralWater',
  general_electricity: 'GeneralElectricity',
};

export default function ZoneWorkspace() {
  const { auditId, zoneId } = useParams();
  const navigate = useNavigate();
  const [zone, setZone] = useState(null);
  const [equipment, setEquipment] = useState({});
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [savingZone, setSavingZone] = useState(false);

  useEffect(() => {
    loadData();
  }, [zoneId]);

  const loadData = async () => {
    const [zoneData, ...eqResults] = await Promise.all([
      base44.entities.Zone.filter({ id: zoneId }),
      ...Object.entries(ENTITY_MAP).map(([key, entity]) =>
        base44.entities[entity].filter({ zone_id: zoneId }).then(items => [key, items])
      ),
    ]);
    if (zoneData.length) setZone(zoneData[0]);
    const eqMap = {};
    eqResults.forEach(([key, items]) => { eqMap[key] = items; });
    setEquipment(eqMap);
    setLoading(false);
  };

  const handleAdd = (type) => {
    setFormType(type);
    setEditItem(null);
    setFormOpen(true);
  };

  const handleEdit = (type, item) => {
    setFormType(type);
    setEditItem(item);
    setFormOpen(true);
  };

  const handleSave = async (data) => {
    const entityName = ENTITY_MAP[formType];
    if (editItem?.id) {
      const { id, created_date, updated_date, created_by, ...updateData } = data;
      // Optimistic update
      setEquipment(prev => ({
        ...prev,
        [formType]: prev[formType].map(i => i.id === editItem.id ? { ...i, ...updateData } : i),
      }));
      toast.success('Equipment updated');
      await base44.entities[entityName].update(editItem.id, updateData);
    } else {
      const tempId = `temp-${Date.now()}`;
      const optimistic = { ...data, id: tempId, zone_id: zoneId, audit_id: auditId };
      // Optimistic add
      setEquipment(prev => ({
        ...prev,
        [formType]: [...(prev[formType] || []), optimistic],
      }));
      toast.success('Equipment added');
      const created = await base44.entities[entityName].create({ ...data, zone_id: zoneId, audit_id: auditId });
      setEquipment(prev => ({
        ...prev,
        [formType]: prev[formType].map(i => i.id === tempId ? created : i),
      }));
    }
  };

  const handleDelete = async (type, itemId) => {
    const entityName = ENTITY_MAP[type];
    await base44.entities[entityName].delete(itemId);
    setEquipment(prev => ({
      ...prev,
      [type]: prev[type].filter(i => i.id !== itemId),
    }));
    toast.success('Equipment removed');
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
        <div className="bg-gradient-to-br from-accent/10 via-primary/5 to-transparent rounded-2xl p-5 border border-accent/10">
          <h1 className="text-xl font-bold text-foreground">{zone?.zone_name}</h1>
          {zone?.zone_description && (
            <p className="text-sm text-muted-foreground mt-1">{zone.zone_description}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">{totalEquipment} equipment items</p>
        </div>
      </div>

      {/* Zone Photos */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Zone Photos</h2>
        <MultiPhotoUpload
          value={zone?.photos || []}
          onChange={async (photos) => {
            setZone(prev => ({ ...prev, photos }));
            setSavingZone(true);
            await base44.entities.Zone.update(zoneId, { photos });
            setSavingZone(false);
          }}
          label={savingZone ? 'Saving...' : 'Add photos of this zone'}
        />
      </div>

      {/* Add Equipment Grid */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Add Equipment
        </h2>
        <EquipmentGrid onAdd={handleAdd} />
      </div>

      {/* Equipment Lists */}
      {totalEquipment > 0 && (
        <div className="space-y-5">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Equipment in Zone ({totalEquipment})
          </h2>
          {Object.entries(equipment).map(([type, items]) => (
            <EquipmentList
              key={type}
              items={items}
              type={type}
              onDelete={(id) => handleDelete(type, id)}
              onEdit={(item) => handleEdit(type, item)}
            />
          ))}
        </div>
      )}

      {/* Form Dialog */}
      {formOpen && (
        <EquipmentFormDialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
          type={formType}
          initialData={editItem}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
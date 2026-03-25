import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { EQUIPMENT_TYPES } from './EquipmentGrid';
import {
  MainSwitchboardFields,
  AdditionalSwitchboardFields,
  HVACFields,
  LightingFields,
  SolarPVFields,
  ForkliftChargerFields,
  HotWaterFields,
} from './EquipmentFormFields';

const FORM_MAP = {
  main_switchboard: MainSwitchboardFields,
  additional_switchboard: AdditionalSwitchboardFields,
  hvac: HVACFields,
  lighting: LightingFields,
  solar: SolarPVFields,
  forklift: ForkliftChargerFields,
  hotwater: HotWaterFields,
};

export default function EquipmentFormDialog({ open, onClose, type, initialData, onSave }) {
  const [data, setData] = useState(initialData || {});
  const [saving, setSaving] = useState(false);
  const config = EQUIPMENT_TYPES.find(e => e.key === type);
  const FormComponent = FORM_MAP[type];

  if (!config || !FormComponent) return null;

  const handleSave = async () => {
    setSaving(true);
    await onSave(data);
    setSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {initialData?.id ? 'Edit' : 'Add'} {config.label}
          </DialogTitle>
        </DialogHeader>
        <FormComponent data={data} onChange={setData} />
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {initialData?.id ? 'Update' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
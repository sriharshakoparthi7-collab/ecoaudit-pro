import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PhotoUpload from './PhotoUpload';

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

export function MainSwitchboardFields({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="space-y-4">
      <Field label="Name *"><Input value={data.name || ''} onChange={e => set('name', e.target.value)} /></Field>
      <Field label="Location"><Input value={data.location || ''} onChange={e => set('location', e.target.value)} /></Field>
      <Field label="Map Locator (GPS)"><Input value={data.map_locator || ''} onChange={e => set('map_locator', e.target.value)} /></Field>
      <Field label="Site NMI"><Input value={data.site_nmi || ''} onChange={e => set('site_nmi', e.target.value)} /></Field>
      <PhotoUpload value={data.photo || ''} onChange={v => set('photo', v)} />
      <Field label="Sub-Circuits Description"><Textarea value={data.sub_circuits_description || ''} onChange={e => set('sub_circuits_description', e.target.value)} rows={3} /></Field>
      <Field label="Comments"><Textarea value={data.comments || ''} onChange={e => set('comments', e.target.value)} rows={3} /></Field>
    </div>
  );
}

export function AdditionalSwitchboardFields({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="space-y-4">
      <Field label="Name *"><Input value={data.name || ''} onChange={e => set('name', e.target.value)} /></Field>
      <Field label="Location"><Input value={data.location || ''} onChange={e => set('location', e.target.value)} /></Field>
      <Field label="Map Locator"><Input value={data.map_locator || ''} onChange={e => set('map_locator', e.target.value)} /></Field>
      <Field label="Type">
        <Select value={data.type || ''} onValueChange={v => set('type', v)}>
          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Distribution Board">Distribution Board</SelectItem>
            <SelectItem value="Sub-Main">Sub-Main</SelectItem>
            <SelectItem value="Motor Control Centre">Motor Control Centre</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <PhotoUpload value={data.photo || ''} onChange={v => set('photo', v)} />
      <Field label="Sub-Circuits Description"><Textarea value={data.sub_circuits_description || ''} onChange={e => set('sub_circuits_description', e.target.value)} rows={3} /></Field>
    </div>
  );
}

export function HVACFields({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="space-y-4">
      <Field label="Unit Name *"><Input value={data.unit_name || ''} onChange={e => set('unit_name', e.target.value)} /></Field>
      <Field label="Make"><Input value={data.make || ''} onChange={e => set('make', e.target.value)} /></Field>
      <PhotoUpload value={data.photo || ''} onChange={v => set('photo', v)} />
      <Field label="Location"><Input value={data.location || ''} onChange={e => set('location', e.target.value)} /></Field>
      <Field label="Type">
        <Select value={data.type || ''} onValueChange={v => set('type', v)}>
          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Packaged">Packaged</SelectItem>
            <SelectItem value="Split">Split</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Model"><Input value={data.model || ''} onChange={e => set('model', e.target.value)} /></Field>
      <Field label="Serial Number"><Input value={data.serial_number || ''} onChange={e => set('serial_number', e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Heating (kW)"><Input type="number" value={data.heating_capacity_kw || ''} onChange={e => set('heating_capacity_kw', parseFloat(e.target.value) || '')} /></Field>
        <Field label="Cooling (kW)"><Input type="number" value={data.cooling_capacity_kw || ''} onChange={e => set('cooling_capacity_kw', parseFloat(e.target.value) || '')} /></Field>
      </div>
      <Field label="Power Supply Phase"><Input value={data.power_supply_phase || ''} onChange={e => set('power_supply_phase', e.target.value)} /></Field>
      <PhotoUpload value={data.nameplate_photos || ''} onChange={v => set('nameplate_photos', v)} label="Nameplate Photo" />
      <Field label="Controller Type"><Input value={data.controller_type || ''} onChange={e => set('controller_type', e.target.value)} /></Field>
    </div>
  );
}

export function LightingFields({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="space-y-4">
      <Field label="Light Type *"><Input value={data.light_type || ''} onChange={e => set('light_type', e.target.value)} /></Field>
      <Field label="Brand/Model"><Input value={data.brand_model || ''} onChange={e => set('brand_model', e.target.value)} /></Field>
      <PhotoUpload value={data.photo || ''} onChange={v => set('photo', v)} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Rated Wattage"><Input type="number" value={data.rated_wattage || ''} onChange={e => set('rated_wattage', parseFloat(e.target.value) || '')} /></Field>
        <Field label="Quantity"><Input type="number" value={data.quantity || ''} onChange={e => set('quantity', parseInt(e.target.value) || '')} /></Field>
      </div>
      <Field label="Area/Location"><Input value={data.area_location || ''} onChange={e => set('area_location', e.target.value)} /></Field>
      <Field label="Controls Type"><Input value={data.controls_type || ''} onChange={e => set('controls_type', e.target.value)} /></Field>
      <Field label="Operating Hours"><Input value={data.operating_hours || ''} onChange={e => set('operating_hours', e.target.value)} /></Field>
      <Field label="Mounting Height"><Input value={data.mounting_height || ''} onChange={e => set('mounting_height', e.target.value)} /></Field>
      <Field label="Circuit Grouping"><Input value={data.circuit_grouping || ''} onChange={e => set('circuit_grouping', e.target.value)} /></Field>
    </div>
  );
}

export function SolarPVFields({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="space-y-4">
      <Field label="System Size (kW)"><Input type="number" value={data.system_size_kw || ''} onChange={e => set('system_size_kw', parseFloat(e.target.value) || '')} /></Field>
      <PhotoUpload value={data.roof_photo || ''} onChange={v => set('roof_photo', v)} label="Roof Photo" />
      <Field label="Inverter Brand/Model"><Input value={data.inverter_brand_model || ''} onChange={e => set('inverter_brand_model', e.target.value)} /></Field>
      <Field label="Inverter Location"><Input value={data.inverter_location || ''} onChange={e => set('inverter_location', e.target.value)} /></Field>
      <Field label="Available Roof Space">
        <Select value={data.available_roof_space || ''} onValueChange={v => set('available_roof_space', v)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Suitable Switchboard">
        <Select value={data.suitable_switchboard || ''} onValueChange={v => set('suitable_switchboard', v)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Cable Route Description"><Textarea value={data.cable_route_description || ''} onChange={e => set('cable_route_description', e.target.value)} rows={3} /></Field>
    </div>
  );
}

export function ForkliftChargerFields({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="space-y-4">
      <Field label="Charger Type *"><Input value={data.charger_type || ''} onChange={e => set('charger_type', e.target.value)} /></Field>
      <Field label="Brand/Model"><Input value={data.brand_model || ''} onChange={e => set('brand_model', e.target.value)} /></Field>
      <Field label="Rating (V/A)"><Input value={data.rating || ''} onChange={e => set('rating', e.target.value)} /></Field>
      <Field label="Power Supply"><Input value={data.power_supply || ''} onChange={e => set('power_supply', e.target.value)} /></Field>
      <Field label="Location"><Input value={data.location || ''} onChange={e => set('location', e.target.value)} /></Field>
      <Field label="Quantity"><Input type="number" value={data.quantity || ''} onChange={e => set('quantity', parseInt(e.target.value) || '')} /></Field>
      <Field label="Hardwired/Socket">
        <Select value={data.hardwired_socket || ''} onValueChange={v => set('hardwired_socket', v)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Hardwired">Hardwired</SelectItem>
            <SelectItem value="Socket">Socket</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Scheduling Opportunity">
        <Select value={data.scheduling_opportunity || ''} onValueChange={v => set('scheduling_opportunity', v)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}

export function HotWaterFields({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="space-y-4">
      <Field label="DHW Details/Type *"><Input value={data.dhw_details_type || ''} onChange={e => set('dhw_details_type', e.target.value)} /></Field>
      <PhotoUpload value={data.photo || ''} onChange={v => set('photo', v)} />
      <Field label="Serial Number"><Input value={data.serial_number || ''} onChange={e => set('serial_number', e.target.value)} /></Field>
      <Field label="Size (Liters)"><Input type="number" value={data.size_liters || ''} onChange={e => set('size_liters', parseFloat(e.target.value) || '')} /></Field>
      <Field label="Fuel Type"><Input value={data.fuel_type || ''} onChange={e => set('fuel_type', e.target.value)} /></Field>
      <Field label="Location"><Input value={data.location || ''} onChange={e => set('location', e.target.value)} /></Field>
      <Field label="Pipe Insulation">
        <Select value={data.pipe_insulation || ''} onValueChange={v => set('pipe_insulation', v)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Tempering Valve">
        <Select value={data.tempering_valve || ''} onValueChange={v => set('tempering_valve', v)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
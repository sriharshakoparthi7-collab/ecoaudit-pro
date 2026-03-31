import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PhotoUpload from './PhotoUpload';
import MobileSelect from './MobileSelect';

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

const YES_NO = [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }];

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
        <MobileSelect value={data.type || ''} onValueChange={v => set('type', v)} placeholder="Select type"
          options={[
            { value: 'MSSB', label: 'MSSB' },
            { value: 'PVDB', label: 'PVDB' },
            { value: 'DSB-W', label: 'DSB-W' },
            { value: 'DSB-S', label: 'DSB-S' },
          ]} />
      </Field>
      <PhotoUpload value={data.photo || ''} onChange={v => set('photo', v)} />
      <Field label="Sub-Circuits Description"><Textarea value={data.sub_circuits_description || ''} onChange={e => set('sub_circuits_description', e.target.value)} rows={3} /></Field>
      <Field label="Comments"><Textarea value={data.comments || ''} onChange={e => set('comments', e.target.value)} rows={3} /></Field>
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
        <MobileSelect value={data.type || ''} onValueChange={v => set('type', v)} placeholder="Select type"
          options={[{ value: 'Packaged', label: 'Packaged' }, { value: 'Split', label: 'Split' }]} />
      </Field>
      <Field label="Model (Outdoor Unit)"><Input value={data.model || ''} onChange={e => set('model', e.target.value)} /></Field>
      <Field label="Serial Number (Outdoor Unit)"><Input value={data.serial_number || ''} onChange={e => set('serial_number', e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Heating (kW)"><Input type="number" value={data.heating_capacity_kw || ''} onChange={e => set('heating_capacity_kw', parseFloat(e.target.value) || '')} /></Field>
        <Field label="Cooling (kW)"><Input type="number" value={data.cooling_capacity_kw || ''} onChange={e => set('cooling_capacity_kw', parseFloat(e.target.value) || '')} /></Field>
      </div>
      <Field label="Power Supply Phase">
        <MobileSelect value={data.power_supply_phase || ''} onValueChange={v => set('power_supply_phase', v)} placeholder="Select"
          options={[{ value: 'Single Phase', label: 'Single Phase' }, { value: 'Three Phase', label: 'Three Phase' }]} />
      </Field>
      <PhotoUpload value={data.nameplate_photos || ''} onChange={v => set('nameplate_photos', v)} label="Outdoor Unit Nameplate Photo" />
      <Field label="HVAC Indoor Unit Model Number"><Input value={data.indoor_unit_model || ''} onChange={e => set('indoor_unit_model', e.target.value)} /></Field>
      <Field label="HVAC Indoor Unit Serial Number"><Input value={data.indoor_unit_serial || ''} onChange={e => set('indoor_unit_serial', e.target.value)} /></Field>
      <PhotoUpload value={data.indoor_unit_nameplate_photo || ''} onChange={v => set('indoor_unit_nameplate_photo', v)} label="Indoor Unit Nameplate Photo" />
      <Field label="HVAC Controller Type"><Input value={data.controller_type || ''} onChange={e => set('controller_type', e.target.value)} /></Field>
      <Field label="HVAC Controller Model Number"><Input value={data.controller_model || ''} onChange={e => set('controller_model', e.target.value)} /></Field>
      <PhotoUpload value={data.controller_photo || ''} onChange={v => set('controller_photo', v)} label="Photo of HVAC Controller" />
      <Field label="HVAC Temperature Sensor/Thermostat Type"><Input value={data.temperature_sensor_type || ''} onChange={e => set('temperature_sensor_type', e.target.value)} /></Field>
      <Field label="HVAC System Coverage"><Input value={data.system_coverage || ''} onChange={e => set('system_coverage', e.target.value)} /></Field>
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
      <Field label="Number of Fixtures Installed"><Input value={data.fixtures_installed || ''} onChange={e => set('fixtures_installed', e.target.value)} /></Field>
      <PhotoUpload value={data.fixtures_photo || ''} onChange={v => set('fixtures_photo', v)} label="Photo of Light Fixtures Installed" />
      <Field label="Area/Location"><Input value={data.area_location || ''} onChange={e => set('area_location', e.target.value)} /></Field>
      <Field label="Controls Type"><Input value={data.controls_type || ''} onChange={e => set('controls_type', e.target.value)} /></Field>
      <Field label="Operating Hours"><Input value={data.operating_hours || ''} onChange={e => set('operating_hours', e.target.value)} /></Field>
      <Field label="Mounting Height"><Input value={data.mounting_height || ''} onChange={e => set('mounting_height', e.target.value)} /></Field>
      <Field label="Circuit Grouping"><Input value={data.circuit_grouping || ''} onChange={e => set('circuit_grouping', e.target.value)} /></Field>
      <PhotoUpload value={data.sensors_photo || ''} onChange={v => set('sensors_photo', v)} label="Photo of Switches/Sensors/Lighting Control Devices" />
      <Field label="Access/Installation Limitations"><Input value={data.access_limitations || ''} onChange={e => set('access_limitations', e.target.value)} /></Field>
      <PhotoUpload value={data.mounting_constraints_photo || ''} onChange={v => set('mounting_constraints_photo', v)} label="Photo Showing Mounting Height/Access Constraints" />
      <Field label="Photo of Switchboard/Lighting Switches Controlling the Circuit (notes/reference)"><Input value={data.switchboard_photo_notes || ''} onChange={e => set('switchboard_photo_notes', e.target.value)} /></Field>
      <Field label="Observations for Energy Improvement"><Input value={data.energy_improvement_observations || ''} onChange={e => set('energy_improvement_observations', e.target.value)} /></Field>
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
      <PhotoUpload value={data.inverter_label_photo || ''} onChange={v => set('inverter_label_photo', v)} label="Photo of Inverters and Label/Model" />
      <Field label="Power Supply to the PV System"><Input value={data.power_supply_to_pv || ''} onChange={e => set('power_supply_to_pv', e.target.value)} /></Field>
      <PhotoUpload value={data.electricity_meter_photo || ''} onChange={v => set('electricity_meter_photo', v)} label="Photo of Electricity Meter" />
      <Field label="Available Roof Space">
        <MobileSelect value={data.available_roof_space || ''} onValueChange={v => set('available_roof_space', v)} placeholder="Select" options={YES_NO} />
      </Field>
      {data.available_roof_space === 'Yes' && (
        <>
          <Field label="How Much Roof Space is Available?"><Input value={data.roof_space_amount || ''} onChange={e => set('roof_space_amount', e.target.value)} /></Field>
          <PhotoUpload value={data.additional_solar_space_photo || ''} onChange={v => set('additional_solar_space_photo', v)} label="Photo Showing Available Space for Additional Solar Panels" />
        </>
      )}
      <Field label="Is There a Switchable Switchboard for Solar PV Connection?">
        <MobileSelect value={data.suitable_switchboard || ''} onValueChange={v => set('suitable_switchboard', v)} placeholder="Select" options={YES_NO} />
      </Field>
      <PhotoUpload value={data.switchboard_photo || ''} onChange={v => set('switchboard_photo', v)} label="Photo of the Switchboard" />
      <Field label="Location of the Switchboard"><Input value={data.switchboard_location || ''} onChange={e => set('switchboard_location', e.target.value)} /></Field>
      <Field label="Estimated Cable Distance (Solar PV Area to Switchboard)"><Input value={data.cable_distance || ''} onChange={e => set('cable_distance', e.target.value)} /></Field>
      <Field label="Cable Route Description"><Textarea value={data.cable_route_description || ''} onChange={e => set('cable_route_description', e.target.value)} rows={3} /></Field>
      <Field label="Observations for Energy Improvements"><Input value={data.energy_improvement_observations || ''} onChange={e => set('energy_improvement_observations', e.target.value)} /></Field>
    </div>
  );
}

export function ForkliftChargerFields({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="space-y-4">
      <Field label="Charger Type *"><Input value={data.charger_type || ''} onChange={e => set('charger_type', e.target.value)} /></Field>
      <PhotoUpload value={data.charger_photo || ''} onChange={v => set('charger_photo', v)} label="Photo of Forklift Charger" />
      <Field label="Brand/Model"><Input value={data.brand_model || ''} onChange={e => set('brand_model', e.target.value)} /></Field>
      <Field label="Rating (V/A)"><Input value={data.rating || ''} onChange={e => set('rating', e.target.value)} /></Field>
      <PhotoUpload value={data.charger_label_photo || ''} onChange={v => set('charger_label_photo', v)} label="Photo of Charger Label/Model" />
      <Field label="Power Supply"><Input value={data.power_supply || ''} onChange={e => set('power_supply', e.target.value)} /></Field>
      <Field label="Location"><Input value={data.location || ''} onChange={e => set('location', e.target.value)} /></Field>
      <Field label="Quantity"><Input type="number" value={data.quantity || ''} onChange={e => set('quantity', parseInt(e.target.value) || '')} /></Field>
      <PhotoUpload value={data.charger_space_photo || ''} onChange={v => set('charger_space_photo', v)} label="Photo Showing Charger Within the Space" />
      <Field label="How is the Charger Connected?"><Input value={data.connection_description || ''} onChange={e => set('connection_description', e.target.value)} /></Field>
      <PhotoUpload value={data.socket_connection_photo || ''} onChange={v => set('socket_connection_photo', v)} label="Photo of Socket/Isolator/Switchboard Connection" />
      <Field label="Is There a Local Isolator or Switch Near the Charger?">
        <MobileSelect value={data.local_isolator || ''} onValueChange={v => set('local_isolator', v)} placeholder="Select" options={YES_NO} />
      </Field>
      <Field label="Is the Circuit for the Forklift Charger Identifiable in the Switchboard?">
        <MobileSelect value={data.circuit_identifiable || ''} onValueChange={v => set('circuit_identifiable', v)} placeholder="Select" options={YES_NO} />
      </Field>
      <Field label="Approximate Distance from Charger to Switchboard"><Input value={data.distance_to_switchboard || ''} onChange={e => set('distance_to_switchboard', e.target.value)} /></Field>
      <Field label="Is There Sufficient Space for Additional Forklift Chargers?">
        <MobileSelect value={data.space_for_additional || ''} onValueChange={v => set('space_for_additional', v)} placeholder="Select" options={YES_NO} />
      </Field>
      <Field label="Hardwired/Socket">
        <MobileSelect value={data.hardwired_socket || ''} onValueChange={v => set('hardwired_socket', v)} placeholder="Select"
          options={[{ value: 'Hardwired', label: 'Hardwired' }, { value: 'Socket', label: 'Socket' }]} />
      </Field>
      <Field label="Scheduling Opportunity">
        <MobileSelect value={data.scheduling_opportunity || ''} onValueChange={v => set('scheduling_opportunity', v)} placeholder="Select" options={YES_NO} />
      </Field>
      <Field label="Observations for Energy Improvement"><Textarea value={data.energy_improvement_observations || ''} onChange={e => set('energy_improvement_observations', e.target.value)} rows={3} /></Field>
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
        <MobileSelect value={data.pipe_insulation || ''} onValueChange={v => set('pipe_insulation', v)} placeholder="Select" options={YES_NO} />
      </Field>
      <Field label="Thickness of Water Pipe Insulation"><Input value={data.pipe_insulation_thickness || ''} onChange={e => set('pipe_insulation_thickness', e.target.value)} /></Field>
      <Field label="Tempering Valve">
        <MobileSelect value={data.tempering_valve || ''} onValueChange={v => set('tempering_valve', v)} placeholder="Select" options={YES_NO} />
      </Field>
      <PhotoUpload value={data.additional_photo || ''} onChange={v => set('additional_photo', v)} label="Additional Photo (if required)" />
      <Field label="Any More DHW Systems?">
        <MobileSelect value={data.more_dhw_systems || ''} onValueChange={v => set('more_dhw_systems', v)} placeholder="Select" options={YES_NO} />
      </Field>
      <Field label="Additional Comments (condition, access issues, etc.)"><Textarea value={data.additional_comments || ''} onChange={e => set('additional_comments', e.target.value)} rows={3} /></Field>
      <Field label="Observations for Energy Improvements"><Textarea value={data.energy_improvement_observations || ''} onChange={e => set('energy_improvement_observations', e.target.value)} rows={3} /></Field>
    </div>
  );
}
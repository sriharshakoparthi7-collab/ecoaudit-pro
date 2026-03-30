import { SectionTitle, FieldRow, PhotoBox } from '../../pages/ClientReport';

export default function ReportHVAC({ hvacs, zoneMap }) {
  return (
    <section>
      <SectionTitle number="2" title="HVAC Systems" />
      <p className="text-xs text-gray-500 mb-5">
        Heating, Ventilation, and Air Conditioning account for a significant portion of site energy use. The following units were logged.
      </p>

      {hvacs.length === 0 ? (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-xs text-gray-400 italic">No HVAC units recorded for this site.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {hvacs.map((unit, i) => (
            <div key={unit.id} className="bg-white rounded-xl p-6 shadow-sm avoid-break">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 rounded-full" style={{ background: '#1B4040' }} />
                <h3 className="text-sm font-bold" style={{ color: '#1B4040' }}>
                  Unit {i + 1}: {unit.unit_name || 'HVAC Unit'}
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#1B4040' }}>Unit Profile</p>
                  <FieldRow label="Unit Name" value={unit.unit_name} />
                  <FieldRow label="Make & Type" value={[unit.make, unit.type].filter(Boolean).join(' — ')} />
                  <FieldRow label="Location" value={unit.location} />
                  <FieldRow label="Zone / Coverage Area" value={zoneMap[unit.zone_id]} />
                  <FieldRow label="Power Supply Phase" value={unit.power_supply_phase} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#1B4040' }}>Technical Specifications</p>
                  <FieldRow label="Model" value={unit.model} />
                  <FieldRow label="Serial Number" value={unit.serial_number} />
                  <FieldRow label="Heating Capacity" value={unit.heating_capacity_kw ? `${unit.heating_capacity_kw} kW` : null} />
                  <FieldRow label="Cooling Capacity" value={unit.cooling_capacity_kw ? `${unit.cooling_capacity_kw} kW` : null} />
                  <FieldRow label="Controller Type" value={unit.controller_type} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '16px' }}>
                <PhotoBox url={unit.photo} label="HVAC Unit" />
                <PhotoBox url={unit.nameplate_photos} label="Nameplate" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
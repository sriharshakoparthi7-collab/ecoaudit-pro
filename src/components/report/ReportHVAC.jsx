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
            <div key={unit.id} className="bg-white rounded-xl p-6 shadow-sm card-block" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 rounded-full" style={{ background: '#162A4E' }} />
                <h3 className="text-sm font-bold" style={{ color: '#162A4E' }}>
                  Unit {i + 1}: {unit.unit_name || 'HVAC Unit'}
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#162A4E' }}>Unit Profile</p>
                  <FieldRow label="Unit Name" value={unit.unit_name} />
                  <FieldRow label="Make & Type" value={[unit.make, unit.type].filter(Boolean).join(' — ')} />
                  <FieldRow label="Location" value={unit.location} />
                  <FieldRow label="Zone / Coverage Area" value={zoneMap[unit.zone_id]} />
                  <FieldRow label="Power Supply Phase" value={unit.power_supply_phase} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#162A4E' }}>Technical Specifications</p>
                  <FieldRow label="Model" value={unit.model} />
                  <FieldRow label="Serial Number" value={unit.serial_number} />
                  <FieldRow label="Heating Capacity" value={unit.heating_capacity_kw ? `${unit.heating_capacity_kw} kW` : null} />
                  <FieldRow label="Cooling Capacity" value={unit.cooling_capacity_kw ? `${unit.cooling_capacity_kw} kW` : null} />
                  <FieldRow label="Controller Type" value={unit.controller_type} />
                </div>
              </div>

              {unit.extra_notes && (
                <div style={{ marginTop: '12px', padding: '10px 14px', background: '#f0f7ee', borderLeft: '3px solid #79B44A', borderRadius: '6px' }}>
                  <p style={{ fontSize: '9pt', fontWeight: 700, color: '#162A4E', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Additional Notes</p>
                  <p style={{ fontSize: '9pt', color: '#333', lineHeight: 1.5 }}>{unit.extra_notes}</p>
                </div>
              )}
              {unit.energy_improvement_observations && (
                <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fff8e6', borderLeft: '3px solid #f5a623', borderRadius: '6px' }}>
                  <p style={{ fontSize: '9pt', fontWeight: 700, color: '#162A4E', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Observations for Energy Improvement</p>
                  <p style={{ fontSize: '9pt', color: '#333', lineHeight: 1.5 }}>{unit.energy_improvement_observations}</p>
                </div>
              )}
              {(unit.photo || unit.nameplate_photos || unit.controller_photo || unit.indoor_unit_nameplate_photo || unit.extra_photos?.length > 0) && (
                <div className="photo-evidence" style={{ pageBreakInside: 'avoid', breakInside: 'avoid', marginTop: '16px' }}>
                  <p className="keep-with-next" style={{ fontSize: '10pt', fontWeight: 600, color: '#162A4E', marginBottom: '8px', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>Photographic Evidence</p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <PhotoBox url={unit.photo} label="HVAC Unit" />
                    <PhotoBox url={unit.nameplate_photos} label="Nameplate" />
                    <PhotoBox url={unit.controller_photo} label="Controller" />
                    <PhotoBox url={unit.indoor_unit_nameplate_photo} label="Indoor Unit Nameplate" />
                    {(unit.extra_photos || []).map((url, i) => (
                      <PhotoBox key={i} url={url} label={`Extra Photo ${i + 1}`} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
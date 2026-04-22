import { SectionTitle, SubSectionTitle, FieldRow, PhotoBox } from '../../pages/ClientReport';

export default function ReportLighting({ lights, zoneMap }) {
  return (
    <section>
      <SectionTitle number="3" title="Lighting Systems" />
      <p className="text-xs text-gray-500 mb-5">
        An assessment of the site's lighting fixtures, zoning, and controls to identify efficiency and automation opportunities.
      </p>

      {lights.length === 0 ? (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-xs text-gray-400 italic">No lighting systems recorded for this site.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lights.map((light, i) => (
            <div key={light.id} className="bg-white rounded-xl p-6 shadow-sm card-block" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 rounded-full" style={{ background: '#162A4E' }} />
                <h3 className="text-sm font-bold" style={{ color: '#162A4E' }}>
                  Fixture {i + 1}: {light.light_type || 'Lighting System'}
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <SubSectionTitle title={`3.${i + 1} Fixture & Installation Details`} />
                  <FieldRow label="Area / Location" value={light.area_location} />
                  <FieldRow label="Zone" value={zoneMap[light.zone_id]} />
                  <FieldRow label="Fixture Type / Brand / Model" value={[light.light_type, light.brand_model].filter(Boolean).join(' — ')} />
                  <FieldRow label="Quantity Installed" value={light.quantity} />
                  <FieldRow label="Rated Wattage" value={light.rated_wattage ? `${light.rated_wattage} W per fixture` : null} />
                  <FieldRow label="Total Load" value={light.rated_wattage && light.quantity ? `${(light.rated_wattage * light.quantity / 1000).toFixed(2)} kW` : null} />
                  <FieldRow label="Mounting Height" value={light.mounting_height} />
                </div>
                <div>
                  <SubSectionTitle title="Controls & Operation" />
                  <FieldRow label="Control Method" value={light.controls_type} />
                  <FieldRow label="Circuit Grouping" value={light.circuit_grouping} />
                  <FieldRow label="Typical Operating Hours" value={light.operating_hours} />
                </div>
              </div>

              {light.extra_notes && (
                <div style={{ marginTop: '12px', padding: '10px 14px', background: '#f0f7ee', borderLeft: '3px solid #79B44A', borderRadius: '6px' }}>
                  <p style={{ fontSize: '9pt', fontWeight: 700, color: '#162A4E', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Additional Notes</p>
                  <p style={{ fontSize: '9pt', color: '#333', lineHeight: 1.5 }}>{light.extra_notes}</p>
                </div>
              )}
              {light.energy_improvement_observations && (
                <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fff8e6', borderLeft: '3px solid #f5a623', borderRadius: '6px' }}>
                  <p style={{ fontSize: '9pt', fontWeight: 700, color: '#162A4E', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Observations for Energy Improvement</p>
                  <p style={{ fontSize: '9pt', color: '#333', lineHeight: 1.5 }}>{light.energy_improvement_observations}</p>
                </div>
              )}
              {(light.photo || light.fixtures_photo || light.mounting_constraints_photo || light.sensors_photo || light.switchboard_photo_notes || light.extra_photos?.length > 0) && (
                <div className="photo-evidence" style={{ pageBreakInside: 'avoid', breakInside: 'avoid', marginTop: '16px' }}>
                  <p className="keep-with-next" style={{ fontSize: '10pt', fontWeight: 600, color: '#162A4E', marginBottom: '8px', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>Photographic Evidence</p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <PhotoBox url={light.photo} label="Fixture" />
                    <PhotoBox url={light.fixtures_photo} label="Fixtures Installed" />
                    <PhotoBox url={light.mounting_constraints_photo} label="Mounting / Access" />
                    <PhotoBox url={light.sensors_photo} label="Switches / Sensors" />
                    <PhotoBox url={light.switchboard_photo_notes} label="Switchboard" />
                    {(light.extra_photos || []).map((url, i) => (
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
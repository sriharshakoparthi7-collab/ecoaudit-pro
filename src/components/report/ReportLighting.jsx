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
                <div className="w-1 h-5 rounded-full" style={{ background: '#1B4040' }} />
                <h3 className="text-sm font-bold" style={{ color: '#1B4040' }}>
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

              {(light.photo || light.extra_photos?.length > 0) && (
                <div className="photo-evidence" style={{ pageBreakInside: 'avoid', breakInside: 'avoid', marginTop: '16px' }}>
                  <p className="keep-with-next" style={{ fontSize: '10pt', fontWeight: 600, color: '#1B4040', marginBottom: '8px', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>Photographic Evidence</p>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <PhotoBox url={light.photo} label="Fixture" />
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
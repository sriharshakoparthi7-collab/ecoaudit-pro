import { SectionTitle, SubSectionTitle, FieldRow, PhotoBox } from '../../pages/ClientReport';

export default function ReportForklift({ forklifts, zoneMap }) {
  return (
    <section>
      <SectionTitle number="5" title="Forklift Charging Operations" />
      <p className="text-xs text-gray-500 mb-5">
        Analysis of material handling equipment charging to optimize power draw and utilize solar generation.
      </p>

      {forklifts.length === 0 ? (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-xs text-gray-400 italic">No forklift charger data recorded for this site.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {forklifts.map((fc, i) => (
            <div key={fc.id} className="bg-white rounded-xl p-6 shadow-sm card-block" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <SubSectionTitle title={`5.${i + 1} Charger Specifications`} />
                  <FieldRow label="Charger Type" value={fc.charger_type} />
                  <FieldRow label="Brand / Model" value={fc.brand_model} />
                  <FieldRow label="Electrical Rating" value={fc.rating} />
                  <FieldRow label="Quantity" value={fc.quantity} />
                  <FieldRow label="Location" value={fc.location} />
                  <FieldRow label="Zone" value={zoneMap[fc.zone_id]} />
                </div>
                <div>
                  <SubSectionTitle title="Electrical Integration" />
                  <FieldRow label="Power Supply" value={fc.power_supply} />
                  <FieldRow label="Connection Type" value={fc.hardwired_socket} />
                  <FieldRow label="Scheduling Opportunity" value={fc.scheduling_opportunity} />
                </div>
              </div>

              {(fc.charger_photo || fc.extra_photos?.length > 0) && (
                <div className="photo-evidence" style={{ pageBreakInside: 'avoid', breakInside: 'avoid', marginTop: '16px' }}>
                  <p className="keep-with-next" style={{ fontSize: '10pt', fontWeight: 600, color: '#1B4040', marginBottom: '8px', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>Photographic Evidence</p>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <PhotoBox url={fc.charger_photo} label="Forklift Charger" />
                    {(fc.extra_photos || []).map((url, i) => (
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
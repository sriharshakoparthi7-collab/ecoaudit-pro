import { SectionTitle, SubSectionTitle, FieldRow, PhotoBox } from '../../pages/ClientReport';

export default function ReportForklift({ forklifts, zoneMap }) {
  return (
    <section>
      <SectionTitle number="5" title="Forklift Charging Infrastructure" />
      <p className="text-xs text-gray-500 mb-5">
        Assessment of forklift charger specifications, connection types, and scheduling opportunities.
      </p>

      {forklifts.length === 0 ? (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-xs text-gray-400 italic">No forklift charger data recorded for this site.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {forklifts.map((fc, i) => (
            <div key={fc.id} className="bg-white rounded-xl p-6 shadow-sm card-block" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 rounded-full" style={{ background: '#1B4040' }} />
                <h3 className="text-sm font-bold" style={{ color: '#1B4040' }}>
                  Charger {i + 1}: {fc.charger_type || 'Forklift Charger'}
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <SubSectionTitle title={`5.${i + 1} Charger Profile`} />
                  <FieldRow label="Charger Type" value={fc.charger_type} />
                  <FieldRow label="Brand / Model" value={fc.brand_model} />
                  <FieldRow label="Rating (V/A)" value={fc.rating} />
                  <FieldRow label="Power Supply" value={fc.power_supply} />
                  <FieldRow label="Location" value={fc.location} />
                  <FieldRow label="Zone" value={zoneMap[fc.zone_id]} />
                  <FieldRow label="Quantity" value={fc.quantity} />
                </div>
                <div>
                  <SubSectionTitle title="Connection & Installation" />
                  <FieldRow label="Hardwired / Socket" value={fc.hardwired_socket} />
                  <FieldRow label="Connection Description" value={fc.connection_description} />
                  <FieldRow label="Local Isolator" value={fc.local_isolator} />
                  <FieldRow label="Circuit Identifiable" value={fc.circuit_identifiable} />
                  <FieldRow label="Distance to Switchboard" value={fc.distance_to_switchboard} />
                  <FieldRow label="Space for Additional Chargers" value={fc.space_for_additional} />
                  <FieldRow label="Scheduling Opportunity" value={fc.scheduling_opportunity} />
                </div>
              </div>

              {(fc.charger_photo || fc.charger_label_photo || fc.electric_connection_photo || fc.charger_space_photo || fc.socket_connection_photo || fc.extra_photos?.length > 0) && (
                <div className="photo-evidence" style={{ pageBreakInside: 'avoid', breakInside: 'avoid', marginTop: '16px' }}>
                  <p className="keep-with-next" style={{ fontSize: '10pt', fontWeight: 600, color: '#1B4040', marginBottom: '8px', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>Photographic Evidence</p>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <PhotoBox url={fc.charger_photo} label="Forklift Charger" />
                    <PhotoBox url={fc.charger_label_photo} label="Charger Label" />
                    <PhotoBox url={fc.electric_connection_photo} label="Electric Connection" />
                    <PhotoBox url={fc.charger_space_photo} label="Charger Space" />
                    <PhotoBox url={fc.socket_connection_photo} label="Socket / Isolator" />
                    {(fc.extra_photos || []).map((url, j) => (
                      <PhotoBox key={j} url={url} label={`Extra Photo ${j + 1}`} />
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
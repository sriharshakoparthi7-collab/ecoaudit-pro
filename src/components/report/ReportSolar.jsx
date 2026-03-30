import { SectionTitle, SubSectionTitle, FieldRow, PhotoBox } from '../../pages/ClientReport';

export default function ReportSolar({ solars, zoneMap }) {
  return (
    <section>
      <SectionTitle number="4" title="Solar PV Infrastructure" />
      <p className="text-xs text-gray-500 mb-5">
        Assessment of existing renewable generation and potential for expansion.
      </p>

      {solars.length === 0 ? (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-xs text-gray-400 italic">No Solar PV data recorded for this site.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {solars.map((pv, i) => (
            <div key={pv.id} className="bg-white rounded-xl p-6 shadow-sm card-block" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <SubSectionTitle title={`4.${i + 1} Existing System`} />
                  <FieldRow label="System Status" value={pv.system_size_kw ? 'Existing system present' : 'No existing system'} />
                  <FieldRow label="System Size" value={pv.system_size_kw ? `${pv.system_size_kw} kW` : null} />
                  <FieldRow label="Inverter Brand / Model" value={pv.inverter_brand_model} />
                  <FieldRow label="Inverter Location" value={pv.inverter_location} />
                  <FieldRow label="Zone" value={zoneMap[pv.zone_id]} />
                </div>
                <div>
                  <SubSectionTitle title="Expansion Potential" />
                  <FieldRow label="Available Roof Space" value={pv.available_roof_space} />
                  <FieldRow label="Suitable Switchboard" value={pv.suitable_switchboard} />
                  <FieldRow label="Cable Routing Notes" value={pv.cable_route_description} />
                </div>
              </div>

              {pv.roof_photo && (
                <div className="photo-evidence" style={{ pageBreakInside: 'avoid', breakInside: 'avoid', marginTop: '16px' }}>
                  <p className="keep-with-next" style={{ fontSize: '10pt', fontWeight: 600, color: '#1B4040', marginBottom: '8px', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>Photographic Evidence</p>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <PhotoBox url={pv.roof_photo} label="Roof / Panels" />
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
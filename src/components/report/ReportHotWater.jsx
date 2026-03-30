import { SectionTitle, SubSectionTitle, FieldRow, PhotoBox } from '../../pages/ClientReport';

export default function ReportHotWater({ hotWaters, zoneMap }) {
  return (
    <section data-pdf-section>
      <SectionTitle number="6" title="Domestic Hot Water (DHW) Systems" />
      <p className="text-xs text-gray-500 mb-5">
        Review of water heating systems for efficiency and thermal loss.
      </p>

      {hotWaters.length === 0 ? (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-xs text-gray-400 italic">No hot water system data recorded for this site.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {hotWaters.map((hw, i) => (
            <div key={hw.id} className="bg-white rounded-xl p-6 shadow-sm avoid-break">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <SubSectionTitle title={`6.${i + 1} Unit Profile`} />
                  <FieldRow label="DHW Details / Type" value={hw.dhw_details_type} />
                  <FieldRow label="Fuel Type" value={hw.fuel_type} />
                  <FieldRow label="Size / Capacity" value={hw.size_liters ? `${hw.size_liters} L` : null} />
                  <FieldRow label="Serial Number" value={hw.serial_number} />
                  <FieldRow label="Location" value={hw.location} />
                  <FieldRow label="Zone" value={zoneMap[hw.zone_id]} />
                </div>
                <div>
                  <SubSectionTitle title="Thermal Management & Safety" />
                  <FieldRow label="Pipe Insulation" value={hw.pipe_insulation} />
                  <FieldRow label="Tempering Valve Installed" value={hw.tempering_valve} />
                </div>
              </div>
              {hw.photo && (
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '16px', pageBreakInside: 'avoid' }}>
                  <PhotoBox url={hw.photo} label="DHW System" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
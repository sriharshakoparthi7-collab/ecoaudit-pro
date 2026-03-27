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
            <div key={fc.id} className="bg-white rounded-xl p-6 shadow-sm avoid-break">
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
              <div className="mt-5 grid grid-cols-3 gap-3">
                <PhotoBox url={null} label="Charger unit" />
                <PhotoBox url={null} label="Charger label" />
                <PhotoBox url={null} label="Local isolator" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
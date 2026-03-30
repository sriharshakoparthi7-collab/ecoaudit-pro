import { SectionTitle, SubSectionTitle, FieldRow, PhotoBox } from '../../pages/ClientReport';

export default function ReportElectrical({ mains, additionals, zoneMap }) {
  return (
    <section>
      <SectionTitle number="1" title="Electrical Infrastructure" />

      {/* 1.1 Main Switchboard */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-4 avoid-break">
        <SubSectionTitle title="1.1 Main Switchboard (MSB)" />
        <p className="text-xs text-gray-500 mb-4">
          The main electrical distribution point for the facility was assessed to determine current capacity and sub-circuit distribution.
        </p>

        {mains.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No main switchboard data recorded.</p>
        ) : (
          mains.map((msb, i) => (
            <div key={msb.id} className={i > 0 ? 'mt-6 pt-6 border-t border-gray-100' : ''}>
              <FieldRow label="Switchboard Name" value={msb.name} />
              <FieldRow label="Location" value={msb.location} />
              <FieldRow label="GPS Locator" value={msb.map_locator} />
              <FieldRow label="Site NMI" value={msb.site_nmi} />
              <FieldRow label="Sub-Circuits & Ratings" value={msb.sub_circuits_description} />
              <FieldRow label="Zone" value={zoneMap[msb.zone_id]} />
              <FieldRow label="Auditor Comments" value={msb.comments} />
              <div className="mt-4">
                <p style={{ fontSize: '10pt', fontWeight: 600, color: '#1B4040', marginBottom: '8px' }}>Photographic Evidence</p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <PhotoBox url={msb.photo || null} label="Main Switchboard" />
                  <PhotoBox url={null} label="Additional photo" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 1.2 Additional Switchboards */}
      <div className="bg-white rounded-xl p-6 shadow-sm avoid-break">
        <SubSectionTitle title="1.2 Additional Switchboards" />
        <p className="text-xs text-gray-500 mb-4">
          Summary of localized distribution boards across the site.
        </p>

        {additionals.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No additional switchboards recorded.</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-100 mb-4">
              <table className="w-full text-xs">
                <thead style={{ background: '#e8f0ef' }}>
                  <tr>
                    {['Board Name', 'Location / GPS', 'Type', 'Sub-Circuit Details', 'Zone'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left font-semibold uppercase tracking-wide" style={{ color: '#1B4040' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {additionals.map((sb, i) => (
                    <tr key={sb.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 font-medium">{sb.name || '—'}</td>
                      <td className="px-3 py-2">{[sb.location, sb.map_locator].filter(Boolean).join(' / ') || '—'}</td>
                      <td className="px-3 py-2">{sb.type || '—'}</td>
                      <td className="px-3 py-2">{sb.sub_circuits_description || '—'}</td>
                      <td className="px-3 py-2">{zoneMap[sb.zone_id] || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {additionals.slice(0, 2).map(sb => (
                <PhotoBox key={sb.id} url={sb.photo} label={sb.name || 'Switchboard'} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
import { SectionTitle, FieldRow, PhotoBox } from '../../pages/ClientReport';

export default function ReportGeneralWater({ generalWaters, zoneMap }) {
  if (!generalWaters?.length) return null;

  return (
    <section>
      <SectionTitle number="7" title="General Water" />
      <p className="text-xs text-gray-500 mb-5">
        Site-wide water usage observations and general water infrastructure notes.
      </p>

      <div className="space-y-4">
        {generalWaters.map((item, i) => (
          <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm card-block" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 rounded-full" style={{ background: '#162A4E' }} />
              <h3 className="text-sm font-bold" style={{ color: '#162A4E' }}>
                Water Item {i + 1}{item.question ? `: ${item.question}` : ''}
              </h3>
            </div>

            <FieldRow label="Zone" value={zoneMap[item.zone_id]} />
            <FieldRow label="Question" value={item.question} />
            <FieldRow label="Answer" value={item.answer} />
            {item.extra_notes && <FieldRow label="Additional Notes" value={item.extra_notes} />}

            {((item.photos?.length > 0) || (item.extra_photos?.length > 0)) && (
              <div className="photo-evidence" style={{ pageBreakInside: 'avoid', breakInside: 'avoid', marginTop: '16px' }}>
                <p className="keep-with-next" style={{ fontSize: '10pt', fontWeight: 600, color: '#162A4E', marginBottom: '8px', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>Photographic Evidence</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {(item.photos || []).map((url, j) => (
                    <PhotoBox key={j} url={url} label={`Photo ${j + 1}`} />
                  ))}
                  {(item.extra_photos || []).map((url, j) => (
                    <PhotoBox key={`extra-${j}`} url={url} label={`Extra Photo ${j + 1}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
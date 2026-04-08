import { SectionTitle } from '../../pages/ClientReport';

export default function ReportObservations({ extraNotes = {} }) {
  // Collect all observation fields that have content
  const observations = [
    { key: 'obs_lighting', section: 'Lighting Upgrades' },
    { key: 'obs_solar', section: 'Solar PV Optimization' },
    { key: 'obs_forklift', section: 'Load Shifting — Forklift Charging' },
    { key: 'obs_hotwater', section: 'Hot Water Efficiency' },
  ].filter(obs => extraNotes[obs.key]?.trim());

  // If no observations, don't render section 7 at all
  if (observations.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="keep-with-next" style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px', paddingBottom: '8px', borderBottom: '2px solid #162A4E', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
        <span style={{ fontSize: '20pt', fontWeight: 800, color: '#162A4E' }}>7.</span>
        <h2 style={{ fontSize: '18pt', fontWeight: 700, color: '#2C3E50', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>
          Observations for Energy Improvements
        </h2>
      </div>

      <p className="text-xs text-gray-500 mb-5">
        Equipment-specific observations provided by the auditor.
      </p>

      <div className="space-y-4">
        {observations.map((obs, idx) => (
          <div
            key={obs.key}
            className="obs-block"
            style={{
              borderRadius: '8px',
              borderLeft: '4px solid #162A4E',
              padding: '12px 16px',
              background: '#fff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              pageBreakInside: 'avoid',
              breakInside: 'avoid',
            }}
          >
            <h4 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#162A4E', marginBottom: '8px' }}>
              7.{idx + 1}. {obs.section}
            </h4>
            <div style={{ fontSize: '10pt', lineHeight: 1.5, color: '#333333', wordBreak: 'break-word', overflowWrap: 'break-word', hyphens: 'auto', whiteSpace: 'normal' }}>
              {extraNotes[obs.key]}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl p-6 text-center" style={{ background: '#162A4E' }}>
        <p className="text-sm font-bold text-white uppercase tracking-widest mb-1">— End of Report —</p>
        <p className="text-xs" style={{ color: '#b8d49a' }}>
          This document is confidential and prepared exclusively for the named client by Sustainability Wise.
        </p>
      </div>
    </section>
  );
}
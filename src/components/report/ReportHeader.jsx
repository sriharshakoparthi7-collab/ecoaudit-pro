import moment from 'moment';

export default function ReportHeader({ audit }) {
  return (
    <div className="relative overflow-hidden" style={{ background: '#162A4E', minHeight: '260px' }}>
      {/* Decorative concentric arcs top-right */}
      <svg className="absolute top-0 right-0 opacity-10" width="300" height="300" viewBox="0 0 300 300">
        {[20, 50, 80, 110, 140, 170, 200].map((r, i) => (
          <circle key={i} cx="300" cy="0" r={r} fill="none" stroke="#79B44A" strokeWidth="1" />
        ))}
      </svg>
      {/* Decorative concentric arcs bottom-left */}
      <svg className="absolute bottom-0 left-0 opacity-10" width="220" height="220" viewBox="0 0 220 220">
        {[20, 50, 80, 110, 140, 170].map((r, i) => (
          <circle key={i} cx="0" cy="220" r={r} fill="none" stroke="#79B44A" strokeWidth="1" />
        ))}
      </svg>

      <div className="relative z-10 px-10 py-10">
        {/* Brand Logo */}
        <div className="mb-8">
          <img
            src="https://media.base44.com/images/public/69c364356b11e052afca1916/16cba9b3c_Gemini_Generated_Image_okf8wuokf8wuokf8.png"
            alt="Sustainability Wise"
            style={{ maxHeight: '80px', width: 'auto', objectFit: 'contain', background: 'white', borderRadius: '8px', padding: '6px 10px' }}
          />
        </div>

        {/* Main Title */}
        <h1 className="text-3xl font-black uppercase tracking-wide mb-1" style={{ color: '#ffffff' }}>
          Comprehensive Site
        </h1>
        <h1 className="text-3xl font-black uppercase tracking-wide mb-6" style={{ color: '#79B44A' }}>
          Energy Audit Report
        </h1>

        {/* Meta grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <MetaBlock label="Prepared For" value={audit.site_name} />
          <MetaBlock label="Site Address" value={audit.site_address} />
          <MetaBlock label="Date of Audit" value={moment(audit.audit_date).format('DD MMMM YYYY')} />
          <MetaBlock label="Prepared By" value="Sustainability Wise" />
        </div>
      </div>
    </div>
  );
}

function MetaBlock({ label, value }) {
  return (
    <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.07)' }}>
      <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#79B44A' }}>{label}</p>
      <p className="text-sm font-semibold" style={{ color: '#ffffff' }}>{value || '—'}</p>
    </div>
  );
}
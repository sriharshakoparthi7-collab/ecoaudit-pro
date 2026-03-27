import moment from 'moment';

export default function ReportHeader({ audit }) {
  return (
    <div className="relative overflow-hidden" style={{ background: '#1B4040', minHeight: '260px' }}>
      {/* Decorative concentric arcs top-right */}
      <svg className="absolute top-0 right-0 opacity-10" width="300" height="300" viewBox="0 0 300 300">
        {[20, 50, 80, 110, 140, 170, 200].map((r, i) => (
          <circle key={i} cx="300" cy="0" r={r} fill="none" stroke="#a0e0d0" strokeWidth="1" />
        ))}
      </svg>
      {/* Decorative concentric arcs bottom-left */}
      <svg className="absolute bottom-0 left-0 opacity-10" width="220" height="220" viewBox="0 0 220 220">
        {[20, 50, 80, 110, 140, 170].map((r, i) => (
          <circle key={i} cx="0" cy="220" r={r} fill="none" stroke="#a0e0d0" strokeWidth="1" />
        ))}
      </svg>

      <div className="relative z-10 px-10 py-10">
        {/* Logo Row */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#2d9e6b' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
          </div>
          <span className="text-sm font-bold tracking-wider" style={{ color: '#a0d4c4' }}>SUSTAINABILITY WISE</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl font-black uppercase tracking-wide mb-1" style={{ color: '#ffffff' }}>
          Comprehensive Site
        </h1>
        <h1 className="text-3xl font-black uppercase tracking-wide mb-6" style={{ color: '#5fcfaf' }}>
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
      <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#7abcac' }}>{label}</p>
      <p className="text-sm font-semibold" style={{ color: '#ffffff' }}>{value || '—'}</p>
    </div>
  );
}
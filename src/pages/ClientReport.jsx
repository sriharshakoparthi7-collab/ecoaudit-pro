import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import moment from 'moment';
import ReportHeader from '../components/report/ReportHeader';
import ReportElectrical from '../components/report/ReportElectrical';
import ReportHVAC from '../components/report/ReportHVAC';
import ReportLighting from '../components/report/ReportLighting';
import ReportSolar from '../components/report/ReportSolar';
import ReportForklift from '../components/report/ReportForklift';
import ReportHotWater from '../components/report/ReportHotWater';
import ReportObservations from '../components/report/ReportObservations';

export default function ClientReport() {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const reportRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, [auditId]);

  const exportPDF = async () => {
    setExporting(true);
    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');
    const el = reportRef.current;
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#f4f6f5',
      logging: false,
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const imgH = (canvas.height * pdfW) / canvas.width;
    let y = 0;
    while (y < imgH) {
      pdf.addImage(imgData, 'JPEG', 0, -y, pdfW, imgH);
      y += pdfH;
      if (y < imgH) pdf.addPage();
    }
    const siteName = data?.audit?.site_name || 'Energy-Audit';
    pdf.save(`${siteName.replace(/\s+/g, '-')}-Energy-Audit-Report.pdf`);
    setExporting(false);
  };

  const loadAll = async () => {
    const [audits, zones, mains, additionals, hvacs, lights, solars, forklifts, hotWaters] = await Promise.all([
      base44.entities.Audit.filter({ id: auditId }),
      base44.entities.Zone.filter({ audit_id: auditId }),
      base44.entities.MainSwitchboard.filter({ audit_id: auditId }),
      base44.entities.AdditionalSwitchboard.filter({ audit_id: auditId }),
      base44.entities.HVACUnit.filter({ audit_id: auditId }),
      base44.entities.LightingSystem.filter({ audit_id: auditId }),
      base44.entities.SolarPV.filter({ audit_id: auditId }),
      base44.entities.ForkliftCharger.filter({ audit_id: auditId }),
      base44.entities.HotWaterSystem.filter({ audit_id: auditId }),
    ]);
    const zoneMap = {};
    zones.forEach(z => { zoneMap[z.id] = z.zone_name; });
    setData({ audit: audits[0] || {}, zoneMap, mains, additionals, hvacs, lights, solars, forklifts, hotWaters });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const { audit } = data;

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          nav, header, aside, [data-sidebar] { display: none !important; }
          body { background: white !important; margin: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .report-page { padding: 0 !important; margin: 0 !important; }
          .page-break { page-break-before: always; }
          .avoid-break { page-break-inside: avoid; }
          @page { margin: 10mm; size: A4; }
        }
        .report-body { background: #f4f6f5; }
        .teal { color: #1B4040; }
        .bg-teal { background-color: #1B4040; }
        .border-teal { border-color: #1B4040; }
        .bg-teal-light { background-color: #e8f0ef; }
        .decorative-lines {
          position: absolute;
          pointer-events: none;
          overflow: hidden;
        }
        .decorative-lines svg { opacity: 0.08; }
      `}</style>

      {/* Toolbar */}
      <div className="no-print flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/audit/${auditId}/report`)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Report
        </button>
        <button
          onClick={exportPDF}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-60"
          style={{ background: '#1B4040' }}
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {exporting ? 'Generating PDF...' : 'Export PDF'}
        </button>
      </div>

      {/* Report Document */}
      <div ref={reportRef} className="report-body rounded-2xl overflow-hidden shadow-xl report-page" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
        <ReportHeader audit={audit} />

        <div className="px-10 py-8 space-y-12" style={{ background: '#f4f6f5' }}>
          {/* Executive Summary */}
          <section className="avoid-break">
            <SectionTitle number="Executive Summary" plain />
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-sm leading-relaxed" style={{ color: '#2c4a4a' }}>
                This report details the findings of a comprehensive energy audit conducted at the{' '}
                <strong>{audit.site_name}</strong> facility located at <strong>{audit.site_address}</strong>.
                The audit assessed the site's electrical infrastructure, HVAC, lighting, solar PV potential,
                forklift charging operations, and hot water systems. The goal of this assessment is to establish
                a baseline of current energy-consuming assets and identify opportunities for efficiency upgrades,
                load management, and emissions reductions.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <InfoBox label="Audit Date" value={moment(audit.audit_date).format('MMMM D, YYYY')} />
                <InfoBox label="Inspector" value={audit.inspector_name} />
                <InfoBox label="Status" value={audit.status} />
              </div>
            </div>
          </section>

          <ReportElectrical mains={data.mains} additionals={data.additionals} zoneMap={data.zoneMap} />
          <ReportHVAC hvacs={data.hvacs} zoneMap={data.zoneMap} />
          <ReportLighting lights={data.lights} zoneMap={data.zoneMap} />
          <ReportSolar solars={data.solars} zoneMap={data.zoneMap} />
          <ReportForklift forklifts={data.forklifts} zoneMap={data.zoneMap} />
          <ReportHotWater hotWaters={data.hotWaters} zoneMap={data.zoneMap} />
          <ReportObservations
            lights={data.lights}
            solars={data.solars}
            forklifts={data.forklifts}
            hotWaters={data.hotWaters}
          />
        </div>

        {/* Footer */}
        <div className="px-10 py-5 text-center text-xs" style={{ background: '#1B4040', color: '#a0c4c4' }}>
          Prepared by Sustainability Wise &nbsp;|&nbsp; Confidential Energy Audit Report &nbsp;|&nbsp;{' '}
          {moment().format('MMMM YYYY')} &nbsp;|&nbsp; {audit.site_name}
        </div>
      </div>
    </>
  );
}

export function SectionTitle({ number, title, plain }) {
  if (plain) {
    return (
      <h2 className="text-lg font-bold uppercase tracking-widest mb-4" style={{ color: '#1B4040' }}>
        {number}
      </h2>
    );
  }
  return (
    <div className="flex items-baseline gap-3 mb-5">
      <span className="text-2xl font-black" style={{ color: '#1B4040' }}>{number}.</span>
      <h2 className="text-lg font-bold uppercase tracking-widest" style={{ color: '#1B4040' }}>{title}</h2>
    </div>
  );
}

export function InfoBox({ label, value }) {
  return (
    <div className="rounded-lg p-3" style={{ background: '#e8f0ef' }}>
      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#1B4040' }}>{label}</p>
      <p className="text-sm font-medium" style={{ color: '#2c4a4a' }}>{value || '—'}</p>
    </div>
  );
}

export function FieldRow({ label, value }) {
  return (
    <div className="flex gap-2 py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold w-48 flex-shrink-0" style={{ color: '#1B4040' }}>{label}</span>
      <span className="text-xs text-gray-700">{value || '—'}</span>
    </div>
  );
}

export function PhotoBox({ url, label }) {
  if (url) {
    return (
      <div className="rounded-lg overflow-hidden border border-gray-200">
        <img src={url} alt={label || 'Photo'} className="w-full h-40 object-cover" />
        {label && <p className="text-xs text-center py-1 text-gray-500">{label}</p>}
      </div>
    );
  }
  return (
    <div className="rounded-lg border-2 border-dashed border-gray-200 h-40 flex items-center justify-center">
      <p className="text-xs text-gray-400 text-center px-4">📷 {label || 'Photo placeholder'}</p>
    </div>
  );
}

export function SubSectionTitle({ title }) {
  return (
    <h3 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: '#1B4040', borderColor: '#1B4040' }}>
      {title}
    </h3>
  );
}
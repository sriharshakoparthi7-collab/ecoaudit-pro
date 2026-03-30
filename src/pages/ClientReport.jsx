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

    // Force A4-equivalent pixel width before capture
    const prevWidth = el.style.width;
    const prevMaxWidth = el.style.maxWidth;
    el.style.width = '794px';
    el.style.maxWidth = '794px';
    await new Promise(r => setTimeout(r, 300));

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#f7f8f8',
      logging: false,
      width: 794,
      height: el.scrollHeight,
      windowWidth: 794,
      windowHeight: el.scrollHeight,
    });

    el.style.width = prevWidth;
    el.style.maxWidth = prevMaxWidth;

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();

    const HEADER_H = 10; // mm reserved at top for header (pages 2+)
    const FOOTER_H = 10; // mm reserved at bottom for footer
    const MARGIN = 0;    // image starts at left edge

    // Page 1 uses full height (no header), subsequent pages reserve header space
    const page1ContentH = pdfH - FOOTER_H;
    const pageContentH = pdfH - HEADER_H - FOOTER_H;

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const imgTotalH = (canvas.height * pdfW) / canvas.width; // total image height in mm

    // Calculate how many pages we need
    let pages = 1;
    if (imgTotalH > page1ContentH) {
      pages += Math.ceil((imgTotalH - page1ContentH) / pageContentH);
    }

    const siteName = data?.audit?.site_name || 'Energy Audit';
    const auditDate = data?.audit?.audit_date ? moment(data.audit.audit_date).format('DD MMM YYYY') : '';

    for (let i = 0; i < pages; i++) {
      if (i > 0) pdf.addPage();

      // How far into the image this page starts (in mm)
      const imgOffsetMm = i === 0 ? 0 : page1ContentH + (i - 1) * pageContentH;
      // Top of content area on this PDF page
      const contentTop = i === 0 ? 0 : HEADER_H;

      // Draw the image slice
      pdf.addImage(imgData, 'JPEG', MARGIN, contentTop - imgOffsetMm, pdfW, imgTotalH);

      // Clip: white bar at top (for pages 2+) and at bottom to hide bleed
      if (i > 0) {
        pdf.setFillColor(247, 248, 248);
        pdf.rect(0, 0, pdfW, HEADER_H, 'F');
      }
      pdf.setFillColor(247, 248, 248);
      pdf.rect(0, pdfH - FOOTER_H, pdfW, FOOTER_H, 'F');

      // Header (pages 2+)
      if (i > 0) {
        pdf.setFillColor(27, 64, 64);
        pdf.rect(0, 0, pdfW, HEADER_H - 1, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(255, 255, 255);
        pdf.text('SUSTAINABILITY WISE', 8, 6.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.setTextColor(160, 196, 196);
        pdf.text(`${siteName}  |  Energy Audit Report  |  ${auditDate}`, pdfW / 2, 6.5, { align: 'center' });
        pdf.setTextColor(160, 196, 196);
        pdf.text(`Page ${i + 1} of ${pages}`, pdfW - 8, 6.5, { align: 'right' });
      }

      // Footer (all pages)
      pdf.setFillColor(27, 64, 64);
      pdf.rect(0, pdfH - FOOTER_H + 1, pdfW, FOOTER_H - 1, 'F');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(160, 196, 196);
      pdf.text('Prepared by Sustainability Wise  |  Confidential Energy Audit Report', pdfW / 2, pdfH - 3.5, { align: 'center' });
      pdf.setTextColor(100, 160, 160);
      pdf.text(`${siteName}  |  ${auditDate}`, pdfW / 2, pdfH - 1, { align: 'center' });
    }

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
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
        .report-body, .report-body * { font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif !important; }
        .report-body { background: #f7f8f8; }
        .report-content { padding: 2.54cm; }
        .report-body p, .report-body td, .report-body li { font-size: 11pt; color: #333333; line-height: 1.6; }
        .report-body table { width: 100%; table-layout: fixed; border-collapse: collapse; }
        .report-body td, .report-body th { word-wrap: break-word; overflow-wrap: break-word; white-space: normal; padding: 7px 10px; font-size: 10pt; }
        .report-body th { font-size: 10pt; font-weight: 700; background: #f4f4f4 !important; color: #2C3E50; }
        .report-body img { max-width: 100%; border: 1px solid #DDDDDD; border-radius: 6px; }
        .avoid-break { page-break-inside: avoid; break-inside: avoid; }
        .page-break { page-break-before: always; break-before: always; }
        .keep-with-next { page-break-after: avoid; break-after: avoid; }
        .section-block { page-break-inside: avoid; break-inside: avoid; }
        @media print {
          .no-print { display: none !important; }
          nav, header, aside { display: none !important; }
          body { background: white !important; margin: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { margin: 1.8cm; size: A4; }
          .report-page-border { box-shadow: inset 0 0 0 2px #2C3E50 !important; }
        }
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
      <div ref={reportRef} className="report-body rounded-2xl overflow-hidden shadow-xl report-page report-page-border" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', outline: '2px solid #2C3E50', outlineOffset: '-12px' }} style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
        <ReportHeader audit={audit} />

        <div className="report-content space-y-8" style={{ background: '#f7f8f8' }}>
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
      <h2 className="keep-with-next" style={{ fontSize: '18pt', fontWeight: 800, color: '#2C3E50', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
        {number}
      </h2>
    );
  }
  return (
    <div className="keep-with-next" style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px', paddingBottom: '8px', borderBottom: '2px solid #1B4040', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
      <span style={{ fontSize: '20pt', fontWeight: 800, color: '#1B4040' }}>{number}.</span>
      <h2 style={{ fontSize: '18pt', fontWeight: 700, color: '#2C3E50', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>{title}</h2>
    </div>
  );
}

export function InfoBox({ label, value }) {
  return (
    <div style={{ borderRadius: '8px', padding: '12px', background: '#EAF0EF' }}>
      <p style={{ fontSize: '9pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', color: '#1B4040' }}>{label}</p>
      <p style={{ fontSize: '11pt', fontWeight: 600, color: '#2C3E50' }}>{value || '—'}</p>
    </div>
  );
}

export function FieldRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: '8px', padding: '6px 0', borderBottom: '1px solid #F0F0F0' }}>
      <span style={{ fontSize: '10pt', fontWeight: 600, width: '180px', flexShrink: 0, color: '#2C3E50' }}>{label}</span>
      <span style={{ fontSize: '10pt', color: '#333333', wordBreak: 'break-word', flex: 1 }}>{value ?? '—'}</span>
    </div>
  );
}

export function PhotoBox({ url, label }) {
  if (!url) return null;
  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #DDDDDD', width: '45%', maxWidth: '280px' }}>
      <img src={url} alt={label || 'Photo'} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block', border: 'none' }} />
      {label && <p style={{ fontSize: '9pt', textAlign: 'center', padding: '4px', color: '#666', background: '#fafafa' }}>{label}</p>}
    </div>
  );
}

export function SubSectionTitle({ title }) {
  return (
    <h3 className="keep-with-next" style={{ fontSize: '13pt', fontWeight: 600, color: '#333333', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px', paddingBottom: '4px', borderBottom: '1px solid #DDDDDD', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
      {title}
    </h3>
  );
}
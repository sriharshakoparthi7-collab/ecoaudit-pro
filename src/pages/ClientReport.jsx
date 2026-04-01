import { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Download, Loader2, Settings2 } from 'lucide-react';
import moment from 'moment';
import DownloadOptionsDialog from '../components/report/DownloadOptionsDialog';
import ReportHeader from '../components/report/ReportHeader';
import ReportElectrical from '../components/report/ReportElectrical';
import ReportHVAC from '../components/report/ReportHVAC';
import ReportLighting from '../components/report/ReportLighting';
import ReportSolar from '../components/report/ReportSolar';
import ReportForklift from '../components/report/ReportForklift';
import ReportHotWater from '../components/report/ReportHotWater';
import ReportObservations from '../components/report/ReportObservations';

function removeExcludedPhotos(obj, excludedSet) {
  if (!obj || excludedSet.size === 0) return obj;
  const result = { ...obj };
  for (const [key, val] of Object.entries(result)) {
    if (typeof val === 'string' && excludedSet.has(val)) {
      result[key] = '';
    } else if (Array.isArray(val)) {
      result[key] = val.filter(v => !excludedSet.has(v));
    }
  }
  return result;
}

export default function ClientReport() {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const excludedPhotos = new Set(location.state?.excludedPhotos || []);
  const editedContent = location.state?.editedContent || {};
  const reportRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  useEffect(() => {
    loadAll();
  }, [auditId]);

  const exportPDF = async (config) => {
    setExporting(true);
    // Build filtered data based on config
    const filtered = config ? {
      ...baseData,
      hvacs: config.sections.has('hvac') ? (baseData.hvacs.filter(i => config.items.hvac?.has(i.id) ?? true)) : [],
      lights: config.sections.has('lighting') ? (baseData.lights.filter(i => config.items.lighting?.has(i.id) ?? true)) : [],
      solars: config.sections.has('solar') ? (baseData.solars.filter(i => config.items.solar?.has(i.id) ?? true)) : [],
      forklifts: config.sections.has('forklift') ? (baseData.forklifts.filter(i => config.items.forklift?.has(i.id) ?? true)) : [],
      hotWaters: config.sections.has('hotwater') ? (baseData.hotWaters.filter(i => config.items.hotwater?.has(i.id) ?? true)) : [],
      mains: config.sections.has('electrical') ? baseData.mains : [],
      additionals: config.sections.has('electrical') ? baseData.additionals : [],
      _showObservations: config.sections.has('observations'),
    } : baseData;
    setExportFilter(filtered);
    // Wait for re-render then capture
    await new Promise(r => setTimeout(r, 300));

    const el = reportRef.current;
    const canvas = await html2canvas(el, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#f7f8f8',
      logging: false,
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();   // 210mm
    const pdfH = pdf.internal.pageSize.getHeight();  // 297mm

    const borderInset = 8;       // mm from edge
    const headerH = 12;          // mm — header band height
    const footerH = 12;          // mm — footer band height
    const marginX = borderInset + 2; // content left/right margin
    const contentTop = borderInset + headerH + 3;  // content starts here
    const contentBottom = pdfH - borderInset - footerH - 3;
    const contentW = pdfW - marginX * 2;
    const contentH = contentBottom - contentTop;   // usable height per page

    const siteName = data?.audit?.site_name || 'Energy Audit';
    const auditDate = data?.audit?.audit_date
      ? new Date(data.audit.audit_date).toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' })
      : '';

    // Total rendered image height in mm
    const totalImgH = (canvas.height * contentW) / canvas.width;
    const totalPages = Math.ceil(totalImgH / contentH);

    const drawBorder = () => {
      pdf.setDrawColor(44, 62, 80);
      pdf.setLineWidth(0.6);
      pdf.rect(borderInset, borderInset, pdfW - borderInset * 2, pdfH - borderInset * 2);
    };

    const drawHeader = () => {
      // Header background
      pdf.setFillColor(22, 42, 78);
      pdf.rect(borderInset, borderInset, pdfW - borderInset * 2, headerH, 'F');
      // Left: company
      pdf.setTextColor(121, 180, 74);
      pdf.setFontSize(7.5);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SUSTAINABILITY WISE', marginX, borderInset + 7.5);
      // Centre: report title
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(255, 255, 255);
      pdf.text(`${siteName} — Energy Audit Report`, pdfW / 2, borderInset + 7.5, { align: 'center' });
      // Right: date
      pdf.setTextColor(121, 180, 74);
      pdf.text(auditDate, pdfW - marginX, borderInset + 7.5, { align: 'right' });
    };

    const drawFooter = (pageNum) => {
      const footerY = pdfH - borderInset - footerH;
      // Divider line
      pdf.setDrawColor(200, 215, 210);
      pdf.setLineWidth(0.3);
      pdf.line(marginX, footerY + 2, pdfW - marginX, footerY + 2);
      // Left text
      pdf.setTextColor(90, 110, 150);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Sustainability Wise — Confidential Energy Audit Report', marginX, footerY + 8);
      // Right: page number
      pdf.text(`Page ${pageNum} of ${totalPages}`, pdfW - marginX, footerY + 8, { align: 'right' });
    };

    for (let p = 0; p < totalPages; p++) {
      if (p > 0) pdf.addPage();

      // Slice this page's portion of the canvas
      const srcYPx = (p * contentH * canvas.width) / contentW;
      const srcHPx = Math.min((contentH * canvas.width) / contentW, canvas.height - srcYPx);

      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = Math.ceil(srcHPx);
      const ctx = sliceCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, -Math.floor(srcYPx));
      const sliceData = sliceCanvas.toDataURL('image/jpeg', 1.0);
      const sliceH = (sliceCanvas.height * contentW) / canvas.width;

      pdf.addImage(sliceData, 'JPEG', marginX, contentTop, contentW, sliceH);

      drawBorder();
      drawHeader();
      drawFooter(p + 1);
    }

    pdf.save(`${siteName.replace(/\s+/g, '-')}-Energy-Audit-Report.pdf`);
    setExportFilter(null);
    setExporting(false);
  };

  const [exportFilter, setExportFilter] = useState(null);
  const baseData = data ? {
    ...data,
    mains: (data.mains || []).map(i => removeExcludedPhotos(i, excludedPhotos)),
    additionals: (data.additionals || []).map(i => removeExcludedPhotos(i, excludedPhotos)),
    hvacs: (data.hvacs || []).map(i => removeExcludedPhotos(i, excludedPhotos)),
    lights: (data.lights || []).map(i => removeExcludedPhotos(i, excludedPhotos)),
    solars: (data.solars || []).map(i => removeExcludedPhotos(i, excludedPhotos)),
    forklifts: (data.forklifts || []).map(i => removeExcludedPhotos(i, excludedPhotos)),
    hotWaters: (data.hotWaters || []).map(i => removeExcludedPhotos(i, excludedPhotos)),
  } : data;
  const displayData = exportFilter || baseData;

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
        .report-body p, .report-body li { orphans: 2; widows: 2; }
        .report-body tr { page-break-inside: avoid; break-inside: avoid; }
        .report-body .card-block { page-break-inside: avoid; break-inside: avoid; }
        .report-body .photo-evidence { page-break-inside: avoid; break-inside: avoid; }
        .report-content { padding-bottom: 3cm; }
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
          onClick={() => navigate(`/audit/${auditId}/photo-preview`)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Report
        </button>
        <button
          onClick={() => setShowDownloadDialog(true)}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-60"
          style={{ background: '#1B4040' }}
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings2 className="w-4 h-4" />}
          {exporting ? 'Generating PDF...' : 'Download Options'}
        </button>
      </div>

      {/* Report Document */}
      <div ref={reportRef} className="report-body rounded-2xl overflow-hidden shadow-xl report-page report-page-border" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', outline: '2px solid #2C3E50', outlineOffset: '-12px' }} style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
        <ReportHeader audit={audit} />

        <div className="report-content space-y-12" style={{ background: '#f7f8f8' }}>
          {/* Executive Summary */}
          <section className="avoid-break">
            <SectionTitle number="Executive Summary" plain />
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-sm leading-relaxed" style={{ color: '#2c4a4a' }}>
                This report details the findings of a comprehensive energy audit conducted at the{' '}
                {editedContent.execSummary ? editedContent.execSummary : (
                  <><strong>{audit.site_name}</strong> facility located at <strong>{audit.site_address}</strong>.
                The audit assessed the site's electrical infrastructure, HVAC, lighting, solar PV potential,
                forklift charging operations, and hot water systems. The goal of this assessment is to establish
                a baseline of current energy-consuming assets and identify opportunities for efficiency upgrades,
                load management, and emissions reductions.</>
                )}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <InfoBox label="Audit Date" value={moment(audit.audit_date).format('MMMM D, YYYY')} />
                <InfoBox label="Inspector" value={audit.inspector_name} />
                <InfoBox label="Status" value={audit.status} />
              </div>
            </div>
          </section>

          {(displayData.mains?.length > 0 || displayData.additionals?.length > 0) && (
                <ReportElectrical mains={displayData.mains} additionals={displayData.additionals} zoneMap={displayData.zoneMap} />
              )}
              {displayData.hvacs?.length > 0 && <ReportHVAC hvacs={displayData.hvacs} zoneMap={displayData.zoneMap} />}
              {displayData.lights?.length > 0 && <ReportLighting lights={displayData.lights} zoneMap={displayData.zoneMap} />}
              {displayData.solars?.length > 0 && <ReportSolar solars={displayData.solars} zoneMap={displayData.zoneMap} />}
              {displayData.forklifts?.length > 0 && <ReportForklift forklifts={displayData.forklifts} zoneMap={displayData.zoneMap} />}
              {displayData.hotWaters?.length > 0 && <ReportHotWater hotWaters={displayData.hotWaters} zoneMap={displayData.zoneMap} />}
              {(displayData._showObservations !== false) && (
                <ReportObservations
                  lights={displayData.lights || []}
                  solars={displayData.solars || []}
                  forklifts={displayData.forklifts || []}
                  hotWaters={displayData.hotWaters || []}
                  extraNotes={editedContent}
                />
              )}
        </div>

      <DownloadOptionsDialog
        open={showDownloadDialog}
        onClose={() => setShowDownloadDialog(false)}
        data={data}
        onExport={exportPDF}
      />

        {/* Footer */}
        <div className="px-10 py-5 text-center text-xs" style={{ background: '#162A4E', color: '#b8d49a' }}>
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
      <h2 className="keep-with-next" style={{ fontSize: '18pt', fontWeight: 800, color: '#162A4E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
        {number}
      </h2>
    );
  }
  return (
    <div className="keep-with-next" style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px', paddingBottom: '8px', borderBottom: '2px solid #162A4E', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
      <span style={{ fontSize: '20pt', fontWeight: 800, color: '#162A4E' }}>{number}.</span>
      <h2 style={{ fontSize: '18pt', fontWeight: 700, color: '#2C3E50', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>{title}</h2>
    </div>
  );
}

export function InfoBox({ label, value }) {
  return (
    <div style={{ borderRadius: '8px', padding: '12px', background: '#EEF3F8' }}>
      <p style={{ fontSize: '9pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', color: '#162A4E' }}>{label}</p>
      <p style={{ fontSize: '11pt', fontWeight: 600, color: '#2C3E50' }}>{value || '—'}</p>
    </div>
  );
}

export function FieldRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: '8px', padding: '6px 0', borderBottom: '1px solid #F0F0F0' }}>
      <span style={{ fontSize: '10pt', fontWeight: 600, width: '180px', flexShrink: 0, color: '#162A4E' }}>{label}</span>
      <span style={{ fontSize: '10pt', color: '#333333', wordBreak: 'break-word', flex: 1 }}>{value ?? '—'}</span>
    </div>
  );
}

export function PhotoBox({ url, label }) {
  const [failed, setFailed] = useState(false);
  if (!url || failed) return null;
  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #DDDDDD', width: '45%', maxWidth: '340px' }}>
      <img src={url} alt={label || 'Photo'} onError={() => setFailed(true)} style={{ width: '100%', height: 'auto', display: 'block', border: 'none' }} />
      {label && <p style={{ fontSize: '9pt', textAlign: 'center', padding: '4px', color: '#666', background: '#fafafa' }}>{label}</p>}
    </div>
  );
}

export function SubSectionTitle({ title }) {
  return (
    <h3 className="keep-with-next" style={{ fontSize: '13pt', fontWeight: 600, color: '#162A4E', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px', paddingBottom: '4px', borderBottom: '1px solid #79B44A', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
      {title}
    </h3>
  );
}
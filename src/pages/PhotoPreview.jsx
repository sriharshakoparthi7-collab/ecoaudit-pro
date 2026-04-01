import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, CheckSquare, Square, FileText, Image, Eye, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReportHeader from '../components/report/ReportHeader';
import ReportElectrical from '../components/report/ReportElectrical';
import ReportHVAC from '../components/report/ReportHVAC';
import ReportLighting from '../components/report/ReportLighting';
import ReportSolar from '../components/report/ReportSolar';
import ReportForklift from '../components/report/ReportForklift';
import ReportHotWater from '../components/report/ReportHotWater';
import ReportObservations from '../components/report/ReportObservations';
import ReportContentEditor from '../components/report/ReportContentEditor';
import moment from 'moment';

const EQUIPMENT_LABELS = {
  main_switchboard: 'Main Switchboard',
  additional_switchboard: 'Additional Switchboard',
  hvac: 'HVAC',
  lighting: 'Lighting',
  solar: 'Solar PV',
  forklift: 'Forklift Charger',
  hotwater: 'Hot Water System',
};

const ENTITY_MAP = {
  main_switchboard: 'MainSwitchboard',
  additional_switchboard: 'AdditionalSwitchboard',
  hvac: 'HVACUnit',
  lighting: 'LightingSystem',
  solar: 'SolarPV',
  forklift: 'ForkliftCharger',
  hotwater: 'HotWaterSystem',
};

function extractPhotos(item) {
  const photos = [];
  for (const [key, val] of Object.entries(item)) {
    if (key === 'id' || key === 'audit_id' || key === 'zone_id') continue;
    if (typeof val === 'string' && val.startsWith('http')) {
      photos.push({ url: val, label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) });
    } else if (Array.isArray(val)) {
      val.forEach((v, i) => {
        if (typeof v === 'string' && v.startsWith('http')) {
          photos.push({ url: v, label: `${key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} ${i + 1}` });
        }
      });
    }
  }
  return photos;
}

function getItemName(type, item) {
  switch (type) {
    case 'main_switchboard': return item.name || 'Main Switchboard';
    case 'additional_switchboard': return item.name || 'Switchboard';
    case 'hvac': return item.unit_name || 'HVAC Unit';
    case 'lighting': return item.light_type || 'Lighting';
    case 'solar': return 'Solar PV';
    case 'forklift': return item.charger_type || 'Forklift Charger';
    case 'hotwater': return item.dhw_details_type || 'Hot Water';
    default: return 'Item';
  }
}

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

export default function PhotoPreview() {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [excluded, setExcluded] = useState(new Set());
  const [rawData, setRawData] = useState(null);
  const [editedContent, setEditedContent] = useState({});

  useEffect(() => {
    loadAll();
  }, [auditId]);

  const loadAll = async () => {
    const [audits, zones, ...eqResults] = await Promise.all([
      base44.entities.Audit.filter({ id: auditId }),
      base44.entities.Zone.filter({ audit_id: auditId }),
      ...Object.entries(ENTITY_MAP).map(([key, entity]) =>
        base44.entities[entity].filter({ audit_id: auditId }).then(items => [key, items])
      ),
    ]);

    const zoneMap = {};
    zones.forEach(z => { zoneMap[z.id] = z.zone_name; });

    const eqMap = {};
    const newGroups = [];
    for (const [type, items] of eqResults) {
      eqMap[type] = items;
      for (const item of items) {
        const photos = extractPhotos(item);
        if (photos.length > 0) {
          newGroups.push({ type, label: EQUIPMENT_LABELS[type], itemName: getItemName(type, item), itemId: item.id, photos });
        }
      }
    }

    setRawData({
      audit: audits[0] || {},
      zoneMap,
      mains: eqMap.main_switchboard || [],
      additionals: eqMap.additional_switchboard || [],
      hvacs: eqMap.hvac || [],
      lights: eqMap.lighting || [],
      solars: eqMap.solar || [],
      forklifts: eqMap.forklift || [],
      hotWaters: eqMap.hotwater || [],
    });
    setGroups(newGroups);
    setLoading(false);
  };

  const togglePhoto = (url) => {
    setExcluded(prev => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const toggleGroup = (photos) => {
    const urls = photos.map(p => p.url);
    const allExcluded = urls.every(u => excluded.has(u));
    setExcluded(prev => {
      const next = new Set(prev);
      if (allExcluded) urls.forEach(u => next.delete(u));
      else urls.forEach(u => next.add(u));
      return next;
    });
  };

  const allPhotos = groups.flatMap(g => g.photos.map(p => p.url));
  const selectedCount = allPhotos.length - excluded.size;

  const handleGenerate = () => {
    navigate(`/audit/${auditId}/client-report`, {
      state: { excludedPhotos: [...excluded], editedContent },
    });
  };

  // Build filtered display data for live preview
  const displayData = rawData ? {
    ...rawData,
    mains: rawData.mains.map(i => removeExcludedPhotos(i, excluded)),
    additionals: rawData.additionals.map(i => removeExcludedPhotos(i, excluded)),
    hvacs: rawData.hvacs.map(i => removeExcludedPhotos(i, excluded)),
    lights: rawData.lights.map(i => removeExcludedPhotos(i, excluded)),
    solars: rawData.solars.map(i => removeExcludedPhotos(i, excluded)),
    forklifts: rawData.forklifts.map(i => removeExcludedPhotos(i, excluded)),
    hotWaters: rawData.hotWaters.map(i => removeExcludedPhotos(i, excluded)),
  } : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/audit/${auditId}/report`)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Report
        </button>
        <Button onClick={handleGenerate}>
          <FileText className="w-4 h-4 mr-1.5" />
          Download Report ({selectedCount} photos)
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="photos">
        <TabsList className="w-full">
          <TabsTrigger value="photos" className="flex-1 text-xs">
            <Images className="w-3.5 h-3.5 mr-1.5" />
            Select Photos ({selectedCount}/{allPhotos.length})
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex-1 text-xs">
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Report Preview
          </TabsTrigger>
        </TabsList>

        {/* Photo Selection Tab */}
        <TabsContent value="photos" className="mt-4">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-4">
            <p className="text-sm text-muted-foreground">
              Tap a photo to <strong>exclude</strong> it from the report. Switch to "Report Preview" to see the live result.
            </p>
          </div>

          {groups.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Image className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-1">No photos found</h3>
              <p className="text-sm text-muted-foreground">No equipment photos were attached to this audit.</p>
              <Button className="mt-4" onClick={handleGenerate}>
                <FileText className="w-4 h-4 mr-2" />
                Continue to Report
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {groups.map((group) => {
                const allGroupExcluded = group.photos.every(p => excluded.has(p.url));
                return (
                  <div key={`${group.type}-${group.itemId}`} className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{group.label}</span>
                        <h3 className="font-semibold text-foreground">{group.itemName}</h3>
                      </div>
                      <button
                        onClick={() => toggleGroup(group.photos)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {allGroupExcluded ? (
                          <><Square className="w-4 h-4" /> Include all</>
                        ) : (
                          <><CheckSquare className="w-4 h-4 text-primary" /> Exclude all</>
                        )}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {group.photos.map((photo) => {
                        const isExcluded = excluded.has(photo.url);
                        return (
                          <button
                            key={photo.url}
                            type="button"
                            onClick={() => togglePhoto(photo.url)}
                            className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                              isExcluded ? 'border-destructive/50 opacity-40' : 'border-primary/50'
                            }`}
                          >
                            <img src={photo.url} alt={photo.label} className="w-full h-32 object-cover block" />
                            <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isExcluded ? 'opacity-100' : 'opacity-0'}`}
                              style={{ background: 'rgba(0,0,0,0.45)' }}>
                              <span className="text-white text-xs font-semibold bg-destructive/80 px-2 py-1 rounded">Excluded</span>
                            </div>
                            <div className="absolute top-1.5 right-1.5">
                              {isExcluded
                                ? <Square className="w-5 h-5 text-white drop-shadow" />
                                : <CheckSquare className="w-5 h-5 text-white drop-shadow" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }} />
                              }
                            </div>
                            <div className="px-2 py-1 bg-black/50">
                              <p className="text-xs text-white truncate text-left">{photo.label}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Live Report Preview Tab */}
        <TabsContent value="preview" className="mt-4">
          <ReportContentEditor content={editedContent} onChange={setEditedContent} />

          {displayData && (
            <div className="report-body rounded-2xl overflow-hidden shadow-xl border border-border" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: '#f7f8f8' }}>
              <style>{`
                .preview-report p, .preview-report td, .preview-report li { font-size: 11pt; color: #333; line-height: 1.6; }
                .preview-report table { width: 100%; border-collapse: collapse; }
                .preview-report td, .preview-report th { word-wrap: break-word; padding: 7px 10px; font-size: 10pt; }
                .preview-report th { font-weight: 700; background: #f4f4f4; color: #2C3E50; }
                .preview-report img { max-width: 100%; border: 1px solid #ddd; border-radius: 6px; }
              `}</style>

              <ReportHeader audit={displayData.audit} />

              <div className="preview-report space-y-10" style={{ padding: '2rem', background: '#f7f8f8' }}>
                {/* Executive Summary */}
                <section>
                  <h2 style={{ fontSize: '18pt', fontWeight: 800, color: '#2C3E50', textTransform: 'uppercase', marginBottom: '16px' }}>
                    Executive Summary
                  </h2>
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p style={{ fontSize: '11pt', color: '#2c4a4a', lineHeight: 1.7 }}>
                      {editedContent.execSummary
                      ? editedContent.execSummary
                      : (
                        <>
                          This report details the findings of a comprehensive energy audit conducted at the{' '}
                          <strong>{displayData.audit.site_name}</strong> facility located at <strong>{displayData.audit.site_address}</strong>.
                          The audit assessed the site's electrical infrastructure, HVAC, lighting, solar PV potential,
                          forklift charging operations, and hot water systems.
                        </>
                      )
                    }
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {[
                        { label: 'Audit Date', value: moment(displayData.audit.audit_date).format('MMMM D, YYYY') },
                        { label: 'Inspector', value: displayData.audit.inspector_name },
                        { label: 'Status', value: displayData.audit.status },
                      ].map(box => (
                        <div key={box.label} style={{ borderRadius: '8px', padding: '12px', background: '#EAF0EF' }}>
                          <p style={{ fontSize: '9pt', fontWeight: 700, textTransform: 'uppercase', color: '#1B4040', marginBottom: '4px' }}>{box.label}</p>
                          <p style={{ fontSize: '11pt', fontWeight: 600, color: '#2C3E50' }}>{box.value || '—'}</p>
                        </div>
                      ))}
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
                <ReportObservations
                  lights={displayData.lights || []}
                  solars={displayData.solars || []}
                  forklifts={displayData.forklifts || []}
                  hotWaters={displayData.hotWaters || []}
                  extraNotes={editedContent}
                />
              </div>

              <div className="px-10 py-5 text-center text-xs" style={{ background: '#1B4040', color: '#a0c4c4' }}>
                Prepared by Sustainability Wise &nbsp;|&nbsp; Confidential Energy Audit Report &nbsp;|&nbsp;{' '}
                {moment().format('MMMM YYYY')} &nbsp;|&nbsp; {displayData.audit.site_name}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Sticky bottom bar */}
      <div className="sticky bottom-4 flex justify-center pt-2">
        <Button onClick={handleGenerate} size="lg" className="shadow-lg px-8">
          <FileText className="w-4 h-4 mr-2" />
          Download Report ({selectedCount} of {allPhotos.length} photos selected)
        </Button>
      </div>
    </div>
  );
}
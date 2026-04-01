import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, CheckSquare, Square, FileText, Loader2, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export default function PhotoPreview() {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]); // [{ type, label, itemName, itemId, photos: [{url, label}] }]
  const [excluded, setExcluded] = useState(new Set()); // set of excluded URLs

  useEffect(() => {
    loadAll();
  }, [auditId]);

  const loadAll = async () => {
    const results = await Promise.all(
      Object.entries(ENTITY_MAP).map(([key, entity]) =>
        base44.entities[entity].filter({ audit_id: auditId }).then(items => [key, items])
      )
    );

    const newGroups = [];
    for (const [type, items] of results) {
      for (const item of items) {
        const photos = extractPhotos(item);
        if (photos.length > 0) {
          newGroups.push({
            type,
            label: EQUIPMENT_LABELS[type],
            itemName: getItemName(type, item),
            itemId: item.id,
            photos,
          });
        }
      }
    }
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
      state: { excludedPhotos: [...excluded] },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/audit/${auditId}/report`)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Report
        </button>
        <Button onClick={handleGenerate} disabled={selectedCount === 0}>
          <FileText className="w-4 h-4 mr-2" />
          Generate Report ({selectedCount} photos)
        </Button>
      </div>

      {/* Instructions */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <h1 className="font-semibold text-foreground mb-1">Photo Selection</h1>
        <p className="text-sm text-muted-foreground">
          Review all photos below. Tap a photo to deselect it — deselected photos won't appear in the client report. Tap again to re-include.
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
        <div className="space-y-6">
          {groups.map((group) => {
            const allGroupExcluded = group.photos.every(p => excluded.has(p.url));
            return (
              <div key={`${group.type}-${group.itemId}`} className="bg-card rounded-xl border border-border p-4">
                {/* Group header */}
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
                      <><Square className="w-4 h-4" /> Select all</>
                    ) : (
                      <><CheckSquare className="w-4 h-4 text-primary" /> Deselect all</>
                    )}
                  </button>
                </div>

                {/* Photo grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {group.photos.map((photo) => {
                    const isExcluded = excluded.has(photo.url);
                    return (
                      <button
                        key={photo.url}
                        type="button"
                        onClick={() => togglePhoto(photo.url)}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                          isExcluded
                            ? 'border-destructive/50 opacity-40'
                            : 'border-primary/50'
                        }`}
                      >
                        <img
                          src={photo.url}
                          alt={photo.label}
                          className="w-full h-32 object-cover block"
                        />
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

      {/* Sticky bottom bar */}
      {groups.length > 0 && (
        <div className="sticky bottom-4 flex justify-center">
          <Button onClick={handleGenerate} size="lg" className="shadow-lg px-8" disabled={selectedCount === 0}>
            <FileText className="w-4 h-4 mr-2" />
            Generate Report ({selectedCount} of {allPhotos.length} photos)
          </Button>
        </div>
      )}
    </div>
  );
}
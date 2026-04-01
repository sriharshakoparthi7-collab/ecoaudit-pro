import { useState, useRef } from 'react';
import { Camera, ImagePlus, X, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function MultiPhotoUpload({ value = [], onChange, label = "Photos" }) {
  const [uploading, setUploading] = useState(false);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const urls = Array.isArray(value) ? value : (value ? [value] : []);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange([...urls, file_url]);
    setUploading(false);
  };

  const removePhoto = (idx) => {
    onChange(urls.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>

      {/* Hidden inputs */}
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
      <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {urls.map((url, idx) => (
            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
              <img src={url} alt={`${label} ${idx + 1}`} className="w-full h-full object-cover" />
              <button type="button" onClick={() => removePhoto(idx)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center">
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploading ? (
        <div className="flex items-center justify-center h-16 rounded-lg border-2 border-dashed border-border bg-muted/30">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => cameraInputRef.current.click()}
            className="flex flex-col items-center justify-center h-16 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors bg-muted/30 w-full">
            <Camera className="w-4 h-4 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Take Photo</span>
          </button>
          <button type="button" onClick={() => galleryInputRef.current.click()}
            className="flex flex-col items-center justify-center h-16 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors bg-muted/30 w-full">
            <ImagePlus className="w-4 h-4 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Choose Photo</span>
          </button>
        </div>
      )}
    </div>
  );
}
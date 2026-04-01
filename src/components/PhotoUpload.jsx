import { useState, useRef } from 'react';
import { Camera, ImagePlus, X, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function PhotoUpload({ value, onChange, label = "Photo" }) {
  const [uploading, setUploading] = useState(false);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const uploadFile = async (file) => {
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange(file_url);
    setUploading(false);
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';
    await uploadFile(file);
  };

  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>

      {/* Hidden inputs */}
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
      <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      {value ? (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {uploading ? (
            <div className="col-span-2 flex items-center justify-center h-20 rounded-lg border-2 border-dashed border-border bg-muted/30">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => cameraInputRef.current.click()}
                className="flex flex-col items-center justify-center h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer bg-muted/30 w-full"
              >
                <Camera className="w-5 h-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Take Photo</span>
              </button>
              <button
                type="button"
                onClick={() => galleryInputRef.current.click()}
                className="flex flex-col items-center justify-center h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer bg-muted/30 w-full"
              >
                <ImagePlus className="w-5 h-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Choose Photo</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
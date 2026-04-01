import { useState, useRef } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function PhotoUpload({ value, onChange, label = "Photo" }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange(file_url);
    setUploading(false);
  };

  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

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
        <div>
          {uploading ? (
            <div className="flex items-center justify-center h-20 rounded-lg border-2 border-dashed border-border bg-muted/30">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="flex flex-col items-center justify-center h-20 w-full rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer bg-muted/30"
            >
              <ImagePlus className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">Tap to add photo</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
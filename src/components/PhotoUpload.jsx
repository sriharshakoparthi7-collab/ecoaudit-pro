import { useState } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function PhotoUpload({ value, onChange, label = "Photo" }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange(file_url);
    setUploading(false);
  };

  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
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
        <label className="flex flex-col items-center justify-center w-full h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer bg-muted/30">
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Camera className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">Tap to capture</span>
            </>
          )}
          <input type="file" accept="image/*" capture="environment" onChange={handleUpload} className="hidden" />
        </label>
      )}
    </div>
  );
}
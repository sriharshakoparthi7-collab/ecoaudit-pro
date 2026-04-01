import { useState, useRef } from 'react';
import { Camera, ImagePlus, X, Loader2, FlipHorizontal } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function PhotoUpload({ value, onChange, label = "Photo" }) {
  const [uploading, setUploading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const galleryInputRef = useRef(null);

  const setVideoRef = (el) => {
    videoRef.current = el;
    if (el && streamRef.current) {
      el.srcObject = streamRef.current;
      el.play().catch(() => {});
    }
  };

  const uploadFile = async (file) => {
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange(file_url);
    setUploading(false);
  };

  const handleGallery = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await uploadFile(file);
  };

  const openCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 9999 }, height: { ideal: 9999 } }, audio: false });
      streamRef.current = s;
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play();
      }
      setCameraOpen(true);
    } catch {
      galleryInputRef.current.click();
    }
  };

  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    closeCamera();
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      await uploadFile(file);
    }, 'image/jpeg', 1.0);
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      setStream(null);
    }
    setCameraOpen(false);
  };

  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera viewfinder */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <video ref={setVideoRef} autoPlay playsInline muted webkit-playsinline="true" className="flex-1 w-full object-cover" />
          <div className="flex items-center justify-around p-6 bg-black">
            <button type="button" onClick={closeCamera} className="text-white text-sm px-5 py-3">Cancel</button>
            <button
              type="button"
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center"
            >
              <Camera className="w-7 h-7 text-black" />
            </button>
            <div className="w-16" />
          </div>
        </div>
      )}

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
                onClick={openCamera}
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
              <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleGallery} className="hidden" />
            </>
          )}
        </div>
      )}
    </div>
  );
}
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Link as LinkIcon } from "lucide-react";

declare global {
  interface Window { cloudinary: any; }
}

interface CloudinaryUploadProps {
  value?: string;
  onUpload: (url: string) => void;
  label?: string;
  aspectRatio?: string;
}

const CloudinaryUpload = ({ value, onUpload, label = "Upload Image", aspectRatio = "16/9" }: CloudinaryUploadProps) => {
  const widgetRef = useRef<any>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(!!window.cloudinary);

  useEffect(() => {
    if (window.cloudinary) { setScriptLoaded(true); return; }
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  const openWidget = () => {
    if (!scriptLoaded || !window.cloudinary) {
      setShowUrlInput(true);
      return;
    }
    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "demo",
          uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ml_default",
          sources: ["local", "url", "camera"],
          multiple: false,
          cropping: false,
          resourceType: "image",
          folder: "patliputra-vinfast",
          styles: {
            palette: { action: "#C80F1E", link: "#C80F1E" },
          },
        },
        (error: any, result: any) => {
          if (!error && result?.event === "success") {
            onUpload(result.info.secure_url);
            widgetRef.current = null;
          }
        }
      );
    }
    widgetRef.current.open();
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onUpload(urlInput.trim());
      setUrlInput("");
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative rounded-xl overflow-hidden bg-secondary/30 border border-border/50" style={{ aspectRatio }}>
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onUpload("")}
            className="absolute top-2 right-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center hover:bg-destructive transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>
          <button
            type="button"
            onClick={openWidget}
            className="absolute bottom-2 right-2 text-[10px] bg-black/70 text-white px-2 py-1 rounded hover:bg-black transition-colors"
          >
            Change
          </button>
        </div>
      ) : (
        <div
          onClick={openWidget}
          className="rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 bg-secondary/20 hover:bg-secondary/40 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 py-6"
          style={{ aspectRatio }}
        >
          <Upload className="w-6 h-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-[10px] text-muted-foreground/60">Click to upload via Cloudinary</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={openWidget} className="flex-1 gap-1.5 text-xs">
          <Upload className="w-3 h-3" /> {value ? "Change" : "Upload"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setShowUrlInput(!showUrlInput)} className="gap-1.5 text-xs">
          <LinkIcon className="w-3 h-3" /> URL
        </Button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image URL..."
            className="bg-secondary/50 text-xs h-9"
            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
          />
          <Button type="button" size="sm" onClick={handleUrlSubmit} className="bg-primary text-primary-foreground text-xs px-3">
            Set
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setShowUrlInput(false)} className="text-xs px-2">
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;

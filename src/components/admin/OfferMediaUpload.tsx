import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Link as LinkIcon, Loader2, FolderOpen, Film, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { OfferMediaType } from "@/lib/adminCmsMappers";

const CLOUDINARY_FOLDER = "patliputra-vinfast/offers";

type OfferMediaUploadProps = {
  value?: string;
  mediaType: OfferMediaType;
  onMediaTypeChange: (type: OfferMediaType) => void;
  onUpload: (url: string) => void;
};

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        opts: Record<string, unknown>,
        cb: (error: unknown, result: unknown) => void,
      ) => { open: () => void; close?: () => void; destroy?: () => void };
    };
  }
}

const OfferMediaUpload = ({
  value,
  mediaType,
  onMediaTypeChange,
  onUpload,
}: OfferMediaUploadProps) => {
  const fileInputId = useId();
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(typeof window !== "undefined" && !!window.cloudinary);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.cloudinary) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);
  const widgetRef = useRef<{ open: () => void; close?: () => void; destroy?: () => void } | null>(null);
  const onUploadRef = useRef(onUpload);
  onUploadRef.current = onUpload;

  const cloudName = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined)?.trim() || "demo";
  const uploadPreset = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined)?.trim() || "ml_default";

  const cloudinaryResourceType = mediaType === "video" ? "video" : "image";

  useEffect(() => {
    if (typeof window === "undefined" || mediaType === "gif" || !scriptLoaded || !window.cloudinary) return;

    const widget = window.cloudinary!.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ["local", "url"],
        multiple: false,
        resourceType: cloudinaryResourceType,
        folder: CLOUDINARY_FOLDER,
        z_index: 999999,
      },
      (error: unknown, result: unknown) => {
        const r = result as { event?: string; info?: { secure_url?: string } } | undefined;
        if (!error && r?.event === "success" && r.info?.secure_url) {
          onUploadRef.current(r.info.secure_url);
          widget.close?.();
        }
      },
    );
    widgetRef.current = widget;
    return () => {
      try {
        widget.destroy?.();
      } catch {
        /* ignore */
      }
      widgetRef.current = null;
    };
  }, [cloudName, uploadPreset, cloudinaryResourceType, mediaType, scriptLoaded]);

  const handleNativeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const isVideo = mediaType === "video";
    const isGif = mediaType === "gif" || file.type === "image/gif";
    if (isVideo && !file.type.startsWith("video/")) {
      toast.error("Please choose a video file.");
      return;
    }
    if (!isVideo && !file.type.startsWith("image/")) {
      toast.error("Please choose an image or GIF file.");
      return;
    }
    if (cloudName === "demo" || uploadPreset === "ml_default") {
      toast.error("Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env.");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", uploadPreset);
      fd.append("folder", CLOUDINARY_FOLDER);
      const endpoint = isVideo ? "video" : "image";
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${endpoint}/upload`, {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as { secure_url?: string; error?: { message?: string } };
      if (!res.ok) throw new Error(data.error?.message || `Upload failed (${res.status})`);
      if (!data.secure_url) throw new Error("No media URL returned");
      onUpload(data.secure_url);
      if (isGif) onMediaTypeChange("gif");
      toast.success(isVideo ? "Video uploaded" : "Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const openWidget = useCallback(() => {
    if (!widgetRef.current) {
      toast.error("Cloudinary widget is loading — use “Choose file” or paste a URL.");
      return;
    }
    widgetRef.current.open();
  }, []);

  const accept =
    mediaType === "video" ? "video/*" : "image/*,.gif";

  const preview = value ? (
    <div className="relative overflow-hidden rounded-xl border border-border/50 bg-secondary/30 aspect-[16/10]">
      {mediaType === "video" ? (
        <video src={value} className="h-full w-full object-cover" controls playsInline />
      ) : (
        <img src={value} alt="Offer media" className="h-full w-full object-cover" />
      )}
      <button
        type="button"
        onClick={() => onUpload("")}
        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 hover:bg-destructive"
      >
        <X className="h-3.5 w-3.5 text-white" />
      </button>
    </div>
  ) : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(["image", "video", "gif"] as OfferMediaType[]).map((t) => (
          <Button
            key={t}
            type="button"
            size="sm"
            variant={mediaType === t ? "default" : "outline"}
            className="text-xs capitalize"
            onClick={() => onMediaTypeChange(t)}
          >
            {t === "video" ? <Film className="mr-1 h-3 w-3" /> : <ImageIcon className="mr-1 h-3 w-3" />}
            {t === "gif" ? "GIF" : t}
          </Button>
        ))}
      </div>

      <Label className="text-xs text-muted-foreground">
        Upload {mediaType === "video" ? "video" : mediaType === "gif" ? "GIF" : "image"} for the homepage card
      </Label>

      {preview ?? (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/50 bg-secondary/20 px-4 py-8",
            uploading && "pointer-events-none opacity-70",
          )}
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <label
            htmlFor={fileInputId}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderOpen className="h-4 w-4" />}
            {uploading ? "Uploading…" : "Choose file"}
          </label>
          <input
            id={fileInputId}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={handleNativeFile}
            disabled={uploading}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {mediaType !== "gif" ? (
          <Button type="button" variant="outline" size="sm" className="text-xs" onClick={openWidget}>
            Cloudinary widget
          </Button>
        ) : null}
        <Button type="button" variant="outline" size="sm" className="text-xs gap-1" onClick={() => setShowUrlInput(!showUrlInput)}>
          <LinkIcon className="h-3 w-3" /> Paste URL
        </Button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="h-9 bg-secondary/50 text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter" && urlInput.trim()) {
                onUpload(urlInput.trim());
                setUrlInput("");
                setShowUrlInput(false);
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            className="bg-primary text-primary-foreground text-xs"
            onClick={() => {
              if (urlInput.trim()) {
                onUpload(urlInput.trim());
                setUrlInput("");
                setShowUrlInput(false);
              }
            }}
          >
            Set
          </Button>
        </div>
      )}
    </div>
  );
};

export default OfferMediaUpload;

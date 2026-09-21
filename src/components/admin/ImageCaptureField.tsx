import { useRef, type ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Camera, FolderOpen } from "lucide-react";
import { toast } from "sonner";

export type ImagePick = { file: File | null; preview: string | null };

type Props = {
  id: string;
  label: string;
  required?: boolean;
  photo: ImagePick;
  onPick: (p: ImagePick) => void;
  disabled?: boolean;
  /** Shown when no local preview is selected (e.g. existing server image). */
  existingPreviewUrl?: string | null;
  emptyHint?: string;
};

function pickImageFile(picked: File | undefined, onPick: (p: ImagePick) => void) {
  if (!picked) return;
  if (!picked.type.startsWith("image/")) {
    toast.error("Please choose an image file.");
    return;
  }
  onPick({ file: picked, preview: URL.createObjectURL(picked) });
}

export function ImageCaptureField({
  id,
  label,
  required,
  photo,
  onPick,
  disabled,
  existingPreviewUrl,
  emptyHint = "Take a photo or choose from files",
}: Props) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    pickImageFile(picked, onPick);
  };

  const preview = photo.preview ?? existingPreviewUrl ?? null;

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">
        {label} {required ? "*" : <span className="text-muted-foreground font-normal">(optional)</span>}
      </Label>

      {preview ? (
        <div className="rounded-lg border border-border/50 overflow-hidden bg-muted/20">
          <img src={preview} alt={label} className="w-full max-h-32 object-contain" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border/50 bg-secondary/20 py-5 px-3">
          <Camera className="w-4 h-4 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground text-center">{emptyHint}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1 text-[11px] font-medium hover:bg-accent disabled:opacity-50"
          disabled={disabled}
          onClick={() => cameraRef.current?.click()}
        >
          <Camera className="w-3.5 h-3.5" />
          {photo.file ? "Retake" : "Camera"}
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1 text-[11px] font-medium hover:bg-accent disabled:opacity-50"
          disabled={disabled}
          onClick={() => fileRef.current?.click()}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          {photo.file ? "Change file" : "Choose file"}
        </button>
        {photo.file ? (
          <button
            type="button"
            className="text-[11px] text-muted-foreground hover:text-destructive disabled:opacity-50"
            onClick={() => onPick({ file: null, preview: null })}
            disabled={disabled}
          >
            Remove
          </button>
        ) : null}
      </div>

      <input
        ref={cameraRef}
        id={`${id}-camera`}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        disabled={disabled}
        onChange={handleChange}
      />
      <input
        ref={fileRef}
        id={`${id}-file`}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={disabled}
        onChange={handleChange}
      />
    </div>
  );
}

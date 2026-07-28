import { useEffect, useId, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Camera, Loader2, MapPin, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { updateCompletionMedia, type TDLogRecord } from "@/lib/tdLogApi";
import { formatApiErrors } from "@/lib/api";
import { LocationPinMap } from "@/components/admin/LocationPinMap";

type GeoFix = { lat: number; lng: number; accuracy?: number };
type PhotoPick = { file: File | null; preview: string | null };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: TDLogRecord | null;
  onUpdated: () => void | Promise<void>;
};

/**
 * Post-completion editor for customer photo + Google-pinned map location.
 */
export function UpdateCompletionMediaDialog({ open, onOpenChange, log, onUpdated }: Props) {
  const idBase = useId();
  const [customerPhoto, setCustomerPhoto] = useState<PhotoPick>({ file: null, preview: null });
  const [geo, setGeo] = useState<GeoFix | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [geoError, setGeoError] = useState("");
  const [saving, setSaving] = useState(false);

  const captureLocation = () => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("error");
      setGeoError("Geolocation is not supported on this device/browser.");
      return;
    }
    setGeoStatus("loading");
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setGeoStatus("ok");
      },
      (err) => {
        setGeoStatus("error");
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied — allow location access and retry."
            : "Could not get the current location.",
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
    );
  };

  useEffect(() => {
    if (!open || !log) return;
    setCustomerPhoto({
      file: null,
      preview: log.customerPhotoUrl || null,
    });
    if (log.endLocation?.lat != null && log.endLocation?.lng != null) {
      setGeo({
        lat: log.endLocation.lat,
        lng: log.endLocation.lng,
        accuracy: log.endLocation.accuracy,
      });
      setGeoStatus("ok");
    } else {
      setGeo(null);
      setGeoStatus("idle");
      captureLocation();
    }
    setGeoError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, log?._id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    if (!picked.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setCustomerPhoto({ file: picked, preview: URL.createObjectURL(picked) });
  };

  const handleSubmit = async () => {
    if (!log?._id) return;
    if (!customerPhoto.file && !geo) {
      toast.error("Select a new photo and/or pin a location.");
      return;
    }
    setSaving(true);
    try {
      await updateCompletionMedia(log._id, {
        customerPhoto: customerPhoto.file,
        endLat: geo?.lat,
        endLng: geo?.lng,
        endAccuracy: geo?.accuracy,
      });
      toast.success("Photo / location updated");
      onOpenChange(false);
      await onUpdated();
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !saving && onOpenChange(o)}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Update photo & location</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="space-y-1.5">
            <Label className="text-xs">Customer photo</Label>
            {customerPhoto.preview ? (
              <div className="rounded-lg border border-border/50 overflow-hidden bg-muted/20">
                <img src={customerPhoto.preview} alt="Customer" className="w-full max-h-40 object-contain" />
              </div>
            ) : (
              <label
                htmlFor={`${idBase}-photo`}
                className="flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border/50 bg-secondary/20 py-5 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">Take / choose photo</span>
              </label>
            )}
            <label
              htmlFor={`${idBase}-photo`}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-2.5 py-1 text-[11px] font-medium cursor-pointer hover:bg-accent"
            >
              {customerPhoto.file || customerPhoto.preview ? "Change photo" : "Select photo"}
            </label>
            <input
              id={`${idBase}-photo`}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              disabled={saving}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-xs">Google-pinned location</Label>
              <button
                type="button"
                className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                onClick={captureLocation}
                disabled={saving}
              >
                {geoStatus === "loading" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                Use my location
              </button>
            </div>
            <LocationPinMap
              value={geo}
              onChange={(pin) => {
                setGeo({ ...geo, ...pin });
                setGeoStatus("ok");
              }}
              disabled={saving}
            />
            {geo ? (
              <a
                href={`https://www.google.com/maps?q=${geo.lat},${geo.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                Open in Google Maps ({geo.lat.toFixed(5)}, {geo.lng.toFixed(5)})
              </a>
            ) : geoError ? (
              <p className="text-[11px] text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {geoError}
              </p>
            ) : null}
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" disabled={saving} onClick={() => void handleSubmit()}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save
            </Button>
            <Button variant="outline" className="flex-1" disabled={saving} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

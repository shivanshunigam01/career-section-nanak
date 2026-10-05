import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Trash2, Plus, Tag, Eye, EyeOff } from "lucide-react";
import OfferMediaUpload from "@/components/admin/OfferMediaUpload";
import { OfferMedia } from "@/components/OfferMedia";
import { getStoredState, setStoredState } from "@/lib/vfLocalStorage";
import { hasApi } from "@/lib/apiConfig";
import { adminDeleteJson, adminGetData, adminPostJson, adminPutJson, formatApiErrors } from "@/lib/api";
import { getAdminUser, canPerformAction, canPerformManagerAction } from "@/lib/adminAuth";
import {
  adminOfferFromApi,
  adminOfferToApiPayload,
  isMongoId,
  type AdminOfferRow,
} from "@/lib/adminCmsMappers";
import { toast } from "sonner";

type Offer = AdminOfferRow;

const OFFER_TYPES = ["Launch", "Exchange", "Finance", "Accessory", "Seasonal", "Other"];

const AdminOffers = () => {
  const adminUser = getAdminUser();
  const canCreate = canPerformAction(adminUser, "offers", "create");
  const canUpdate = canPerformAction(adminUser, "offers", "update");
  const canDelete = canPerformManagerAction(adminUser, "offers", "delete");
  const [hydrated, setHydrated] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [editOffer, setEditOffer] = useState<Offer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const STORAGE_KEY = "vf_admin_offers";

  const emptyOffer: Offer = {
    id: "",
    title: "",
    description: "",
    model: "All Models",
    validTill: "",
    active: true,
    type: "Launch",
    imageUrl: "",
    mediaType: "image",
    ctaLabel: "Know more",
    ctaLink: "/contact",
    displayOrder: 0,
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (hasApi()) {
        try {
          const data = await adminGetData<unknown[]>("/admin/offers?limit=200&page=1");
          if (!cancelled) {
            const rows = Array.isArray(data)
              ? data.map((doc) => adminOfferFromApi(doc as Record<string, unknown>))
              : [];
            setOffers(rows.sort((a, b) => a.displayOrder - b.displayOrder));
          }
        } catch (e) {
          if (!cancelled) {
            setOffers([]);
            toast.error(formatApiErrors(e));
          }
        }
      } else {
        const stored = getStoredState<Offer[] | null>(STORAGE_KEY, null);
        if (!cancelled) setOffers(Array.isArray(stored) ? stored : []);
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (hasApi()) return;
    setStoredState(STORAGE_KEY, offers);
  }, [offers, hydrated]);

  const handleSave = async (offer: Offer) => {
    if (!offer.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (hasApi()) {
      try {
        const payload = adminOfferToApiPayload(offer);
        if (isMongoId(offer.id)) {
          const raw = await adminPutJson<Record<string, unknown>>(`/admin/offers/${offer.id}`, payload);
          const mapped = adminOfferFromApi(raw);
          setOffers((prev) =>
            [...prev.map((o) => (o.id === offer.id ? mapped : o))].sort((a, b) => a.displayOrder - b.displayOrder),
          );
        } else {
          const raw = await adminPostJson<Record<string, unknown>>("/admin/offers", payload);
          const mapped = adminOfferFromApi(raw);
          setOffers((prev) => {
            const filtered = offer.id ? prev.filter((o) => o.id !== offer.id) : prev;
            return [...filtered, mapped].sort((a, b) => a.displayOrder - b.displayOrder);
          });
        }
        toast.success("Offer saved");
      } catch (e) {
        toast.error(formatApiErrors(e));
        return;
      }
    } else if (offer.id) {
      setOffers((prev) => prev.map((o) => (o.id === offer.id ? offer : o)));
    } else {
      setOffers((prev) => [...prev, { ...offer, id: `O${prev.length + 1}` }]);
    }
    setShowForm(false);
    setEditOffer(null);
  };

  const toggleActive = async (id: string) => {
    const o = offers.find((x) => x.id === id);
    if (!o) return;
    const next = { ...o, active: !o.active };
    if (hasApi() && isMongoId(id)) {
      try {
        const raw = await adminPutJson<Record<string, unknown>>(`/admin/offers/${id}`, adminOfferToApiPayload(next));
        setOffers((prev) => prev.map((x) => (x.id === id ? adminOfferFromApi(raw) : x)));
        toast.success(next.active ? "Offer will show on homepage" : "Offer hidden from homepage");
      } catch (e) {
        toast.error(formatApiErrors(e));
      }
      return;
    }
    setOffers((prev) => prev.map((x) => (x.id === id ? next : x)));
  };

  const handleDelete = async (id: string) => {
    if (hasApi() && isMongoId(id)) {
      try {
        await adminDeleteJson(`/admin/offers/${id}`);
        setOffers((prev) => prev.filter((o) => o.id !== id));
        toast.success("Offer removed");
      } catch (e) {
        toast.error(formatApiErrors(e));
      }
      return;
    }
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Offers</h1>
          <p className="text-muted-foreground text-sm">
            Create promotions with image, video, or GIF. Toggle &quot;Show on homepage&quot; to publish.
          </p>
        </div>
        {canCreate ? (
          <Button onClick={() => { setEditOffer(emptyOffer); setShowForm(true); }} className="bg-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" /> Add Offer
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {hydrated && offers.length === 0 && (
          <Card className="border-dashed border-border/70 bg-muted/20 p-8 text-center lg:col-span-2">
            <Tag className="mx-auto mb-3 h-8 w-8 text-muted-foreground opacity-60" />
            <p className="font-medium text-foreground">No offers yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add an offer with media and turn on &quot;Show on homepage&quot; to display it on the public site.
            </p>
          </Card>
        )}
        {offers.map((offer) => (
          <Card
            key={offer.id}
            className={`overflow-hidden border-border/50 transition-opacity ${offer.active ? "bg-card" : "bg-card/50 opacity-75"}`}
          >
            <div className="relative aspect-[16/9] bg-secondary/30">
              <OfferMedia
                url={offer.imageUrl ?? ""}
                mediaType={offer.mediaType}
                title={offer.title}
                className="absolute inset-0"
                autoPlayVideo={false}
              />
              {!offer.active && (
                <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                  <EyeOff className="h-3 w-3" /> Hidden
                </span>
              )}
              {offer.active && (
                <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground">
                  <Eye className="h-3 w-3" /> Live on homepage
                </span>
              )}
            </div>
            <div className="p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display font-semibold text-foreground">{offer.title}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{offer.type}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{offer.model}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
              <p className="text-xs text-muted-foreground">
                {offer.validTill ? `Valid till ${offer.validTill}` : "No end date"} · Order {offer.displayOrder}
              </p>
              <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-3">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`offer-active-${offer.id}`}
                    checked={offer.active}
                    onCheckedChange={() => canUpdate && toggleActive(offer.id)}
                    disabled={!canUpdate}
                  />
                  <Label htmlFor={`offer-active-${offer.id}`} className="text-xs cursor-pointer">
                    Show on homepage
                  </Label>
                </div>
                <div className="flex items-center gap-1">
                  {canUpdate ? (
                    <button
                      type="button"
                      onClick={() => { setEditOffer(offer); setShowForm(true); }}
                      className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  ) : null}
                  {canDelete ? (
                    <button
                      type="button"
                      onClick={() => handleDelete(offer.id)}
                      className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={(open) => { setShowForm(open); if (!open) setEditOffer(null); }}>
        <DialogContent className="bg-card border-border max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editOffer?.id ? "Edit Offer" : "Add Offer"}</DialogTitle>
          </DialogHeader>
          {editOffer && (
            <div className="space-y-4">
              <OfferMediaUpload
                value={editOffer.imageUrl}
                mediaType={editOffer.mediaType}
                onMediaTypeChange={(t) => setEditOffer({ ...editOffer, mediaType: t })}
                onUpload={(url) => setEditOffer({ ...editOffer, imageUrl: url })}
              />

              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/20 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-foreground">Show on homepage</p>
                  <p className="text-[11px] text-muted-foreground">When off, visitors will not see this offer.</p>
                </div>
                <Switch
                  checked={editOffer.active}
                  onCheckedChange={(checked) => setEditOffer({ ...editOffer, active: checked })}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Title</Label>
                <Input
                  value={editOffer.title}
                  onChange={(e) => setEditOffer({ ...editOffer, title: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Textarea
                  value={editOffer.description}
                  onChange={(e) => setEditOffer({ ...editOffer, description: e.target.value })}
                  className="bg-secondary/50"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Model</Label>
                  <Input
                    value={editOffer.model}
                    onChange={(e) => setEditOffer({ ...editOffer, model: e.target.value })}
                    className="bg-secondary/50"
                    placeholder="All Models"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Type</Label>
                  <Select value={editOffer.type} onValueChange={(v) => setEditOffer({ ...editOffer, type: v })}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OFFER_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Valid till</Label>
                  <Input
                    type="date"
                    value={editOffer.validTill}
                    onChange={(e) => setEditOffer({ ...editOffer, validTill: e.target.value })}
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Display order</Label>
                  <Input
                    type="number"
                    min={0}
                    value={editOffer.displayOrder}
                    onChange={(e) => setEditOffer({ ...editOffer, displayOrder: Number(e.target.value) || 0 })}
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Button label</Label>
                  <Input
                    value={editOffer.ctaLabel}
                    onChange={(e) => setEditOffer({ ...editOffer, ctaLabel: e.target.value })}
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Button link</Label>
                  <Input
                    value={editOffer.ctaLink}
                    onChange={(e) => setEditOffer({ ...editOffer, ctaLink: e.target.value })}
                    className="bg-secondary/50"
                    placeholder="/contact"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={() => handleSave(editOffer)} className="bg-primary text-primary-foreground flex-1">
                  Save
                </Button>
                <Button onClick={() => { setShowForm(false); setEditOffer(null); }} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOffers;

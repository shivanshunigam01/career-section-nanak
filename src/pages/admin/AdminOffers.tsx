import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Edit2, Trash2, Plus, Tag } from "lucide-react";
import { getStoredState, setStoredState } from "@/lib/vfLocalStorage";
import { hasApi } from "@/lib/apiConfig";
import { adminDeleteJson, adminGetData, adminPostJson, adminPutJson, formatApiErrors } from "@/lib/api";
import {
  adminOfferFromApi,
  adminOfferToApiPayload,
  isMongoId,
  type AdminOfferRow,
} from "@/lib/adminCmsMappers";
import { toast } from "sonner";

type Offer = AdminOfferRow;

const initialOffers: Offer[] = [
  { id: "O1", title: "Launch Bonus — ₹2 Lakh Off", description: "Exclusive launch discount on VF 7 Plus variant for first 50 customers", model: "VF 7", validTill: "2026-04-30", active: true, type: "Launch" },
  { id: "O2", title: "Exchange Bonus ₹75,000", description: "Extra exchange value when you trade in your old car", model: "All Models", validTill: "2026-04-15", active: true, type: "Exchange" },
  { id: "O3", title: "Free Home Charging Setup", description: "Complimentary home charger installation with every VF 6 booking", model: "VF 6", validTill: "2026-05-31", active: true, type: "Accessory" },
  { id: "O4", title: "0% EMI for 12 Months", description: "Zero interest EMI through select finance partners", model: "All Models", validTill: "2026-04-30", active: false, type: "Finance" },
];

const AdminOffers = () => {
  const [hydrated, setHydrated] = useState(false);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
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
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (hasApi()) {
        try {
          const data = await adminGetData<unknown[]>("/admin/offers?limit=200&page=1");
          if (!cancelled && Array.isArray(data) && data.length > 0) {
            setOffers(data.map((doc) => adminOfferFromApi(doc as Record<string, unknown>)));
            setHydrated(true);
            return;
          }
        } catch {
          /* fallback */
        }
        if (!cancelled) {
          const stored = getStoredState<Offer[] | null>(STORAGE_KEY, null);
          setOffers(stored && stored.length > 0 ? stored : initialOffers);
        }
      } else {
        const stored = getStoredState<Offer[] | null>(STORAGE_KEY, null);
        if (!cancelled && stored && stored.length > 0) setOffers(stored);
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
    if (hasApi()) {
      try {
        const payload = adminOfferToApiPayload(offer);
        if (isMongoId(offer.id)) {
          const raw = await adminPutJson<Record<string, unknown>>(`/admin/offers/${offer.id}`, payload);
          const mapped = adminOfferFromApi(raw);
          setOffers((prev) => prev.map((o) => (o.id === offer.id ? mapped : o)));
        } else {
          const raw = await adminPostJson<Record<string, unknown>>("/admin/offers", payload);
          const mapped = adminOfferFromApi(raw);
          setOffers((prev) => {
            const filtered = offer.id ? prev.filter((o) => o.id !== offer.id) : prev;
            return [...filtered, mapped];
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
          <p className="text-muted-foreground text-sm">Manage deals and promotions</p>
        </div>
        <Button onClick={() => { setEditOffer(emptyOffer); setShowForm(true); }} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add Offer
        </Button>
      </div>

      <div className="space-y-3">
        {offers.map((offer) => (
          <Card key={offer.id} className={`border-border/50 p-4 transition-opacity ${offer.active ? "bg-card" : "bg-card/50 opacity-60"}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-primary" />
                  <h3 className="font-display font-semibold text-foreground">{offer.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{offer.type}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{offer.model}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{offer.description}</p>
                <p className="text-xs text-muted-foreground mt-1">Valid till: {offer.validTill}</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={offer.active} onCheckedChange={() => toggleActive(offer.id)} />
                <button onClick={() => { setEditOffer(offer); setShowForm(true); }} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(offer.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={(open) => { setShowForm(open); if (!open) setEditOffer(null); }}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">{editOffer?.id ? "Edit Offer" : "Add Offer"}</DialogTitle></DialogHeader>
          {editOffer && (
            <div className="space-y-4">
              <div className="space-y-1.5"><Label className="text-xs">Title</Label><Input value={editOffer.title} onChange={e => setEditOffer({ ...editOffer, title: e.target.value })} className="bg-secondary/50" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Description</Label><Textarea value={editOffer.description} onChange={e => setEditOffer({ ...editOffer, description: e.target.value })} className="bg-secondary/50" rows={2} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">Model</Label><Input value={editOffer.model} onChange={e => setEditOffer({ ...editOffer, model: e.target.value })} className="bg-secondary/50" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Type</Label><Input value={editOffer.type} onChange={e => setEditOffer({ ...editOffer, type: e.target.value })} className="bg-secondary/50" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Valid Till</Label><Input type="date" value={editOffer.validTill} onChange={e => setEditOffer({ ...editOffer, validTill: e.target.value })} className="bg-secondary/50" /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={() => handleSave(editOffer)} className="bg-primary text-primary-foreground flex-1">Save</Button>
                <Button onClick={() => { setShowForm(false); setEditOffer(null); }} variant="outline" className="flex-1">Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOffers;

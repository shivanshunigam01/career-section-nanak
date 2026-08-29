import { useCallback, useEffect, useMemo, useState } from "react";
import { ClipboardList, Loader2, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatApiErrors } from "@/lib/api";
import { getAdminUser, canPerformAction } from "@/lib/adminAuth";
import { useVehicleCatalog } from "@/hooks/useVehicleCatalog";
import { exteriorColoursFor } from "@/data/stockColourOptions";
import {
  approvePurchaseOrder,
  createPipelinePurchaseOrder,
  fetchPipelinePurchaseOrders,
  rejectPurchaseOrder,
  releasePurchaseOrder,
  submitPurchaseOrder,
  type PurchaseOrder,
} from "@/lib/stockPipelineApi";

export default function AdminPurchaseOrders() {
  const admin = getAdminUser();
  const canCreatePo =
    canPerformAction(admin, "stock_po", "create") ||
    canPerformAction(admin, "stock_delivery", "create");
  const canSubmitPo =
    canPerformAction(admin, "stock_po", "update") ||
    canPerformAction(admin, "stock_delivery", "update");
  const canApprovePo = canPerformAction(admin, "stock_po", "approve");
  const canReleasePo =
    canPerformAction(admin, "stock_po", "update") ||
    canPerformAction(admin, "stock_delivery", "update");

  const { models: catalogModels, trimsFor } = useVehicleCatalog();

  const [rows, setRows] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [colour, setColour] = useState("");
  const [qty, setQty] = useState("1");
  const [poType, setPoType] = useState("Regular");
  const [paymentTerms, setPaymentTerms] = useState("Advance");
  const [basicPrice, setBasicPrice] = useState("");
  const [saving, setSaving] = useState(false);

  const variantOptions = useMemo(() => trimsFor(model), [trimsFor, model]);
  const colourOptions = useMemo(() => {
    const base = exteriorColoursFor(model, variant);
    if (colour && !base.includes(colour)) return [colour, ...base];
    return base;
  }, [model, variant, colour]);

  const applyModelChange = (m: string) => {
    const nextVariant = trimsFor(m)[0] ?? "";
    setModel(m);
    setVariant(nextVariant);
    setColour(exteriorColoursFor(m, nextVariant)[0] ?? "");
  };

  const applyVariantChange = (v: string) => {
    setVariant(v);
    const nextColours = exteriorColoursFor(model, v);
    if (!colour || !nextColours.includes(colour)) {
      setColour(nextColours[0] ?? "");
    }
  };

  useEffect(() => {
    if (!model && catalogModels.length) {
      const m = catalogModels[0];
      const nextVariant = trimsFor(m)[0] ?? "";
      setModel(m);
      setVariant(nextVariant);
      setColour(exteriorColoursFor(m, nextVariant)[0] ?? "");
    }
  }, [catalogModels, model, trimsFor]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await fetchPipelinePurchaseOrders({ limit: 100 }));
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onCreate = async () => {
    if (!model.trim()) return toast.error("Select a vehicle model");
    setSaving(true);
    try {
      await createPipelinePurchaseOrder({
        poType,
        paymentTerms,
        supplier: "VinFast",
        bookingLinked: false,
        lines: [{
          model: model.trim(),
          variant: variant.trim() || undefined,
          colour: colour.trim() || undefined,
          qty: Math.max(1, Number(qty) || 1),
          basicPrice: Number(basicPrice) || 0,
          modelYear: new Date().getFullYear(),
        }],
      });
      toast.success("Purchase order created (Draft)");
      setCreateOpen(false);
      void load();
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setSaving(false);
    }
  };

  const pendingApproval = rows.filter((po) => po.status === "SUBMITTED").length;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6" /> Purchase Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stock Manager creates & submits → GM / MD / CEO / Sales Head approves → Procurement releases
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => void load()}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          {canCreatePo ? (
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> New PO
            </Button>
          ) : null}
        </div>
      </div>

      {canApprovePo && pendingApproval > 0 ? (
        <Card className="p-3 border-amber-500/40 bg-amber-500/5 text-sm">
          <strong>{pendingApproval}</strong> PO(s) awaiting your approval (SUBMITTED).
        </Card>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : rows.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground border-dashed">No purchase orders yet.</Card>
      ) : (
        <div className="space-y-3">
          {rows.map((po) => (
            <Card key={po._id} className="p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono font-semibold">{po.poNumber}</p>
                  <p className="text-xs text-muted-foreground">{po.poType || "Regular"} · {po.paymentTerms || "Advance"}</p>
                </div>
                <Badge variant={po.status === "SUBMITTED" ? "default" : "secondary"}>{po.status}</Badge>
              </div>
              <ul className="text-sm space-y-1">
                {po.lines.map((l, i) => (
                  <li key={l._id || i}>
                    {l.model}{l.variant ? ` · ${l.variant}` : ""}{l.colour ? ` · ${l.colour}` : ""} — {l.receivedQty ?? 0}/{l.qty}
                    {l.netPurchaseValue ? ` · ₹${l.netPurchaseValue.toLocaleString()}` : ""}
                  </li>
                ))}
              </ul>
              {po.approvalHistory?.length ? (
                <ul className="text-xs text-muted-foreground border-t border-border/40 pt-2 space-y-0.5">
                  {po.approvalHistory.map((h, i) => (
                    <li key={i}>
                      {h.action} → {h.status}
                      {h.byName ? ` by ${h.byName}` : ""}
                      {h.at ? ` · ${new Date(h.at).toLocaleString()}` : ""}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="flex flex-wrap gap-2 pt-1">
                {canSubmitPo && po.status === "DRAFT" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      try {
                        await submitPurchaseOrder(po._id);
                        toast.success("Submitted for GM / leadership approval");
                        void load();
                      } catch (e) {
                        toast.error(formatApiErrors(e));
                      }
                    }}
                  >
                    Submit for approval
                  </Button>
                ) : null}
                {canApprovePo && po.status === "SUBMITTED" ? (
                  <>
                    <Button
                      size="sm"
                      onClick={async () => {
                        try {
                          await approvePurchaseOrder(po._id);
                          toast.success("PO approved");
                          void load();
                        } catch (e) {
                          toast.error(formatApiErrors(e));
                        }
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        try {
                          await rejectPurchaseOrder(po._id);
                          toast.success("PO rejected");
                          void load();
                        } catch (e) {
                          toast.error(formatApiErrors(e));
                        }
                      }}
                    >
                      Reject
                    </Button>
                  </>
                ) : null}
                {canReleasePo && po.status === "APPROVED" ? (
                  <Button
                    size="sm"
                    onClick={async () => {
                      try {
                        await releasePurchaseOrder(po._id);
                        toast.success("PO released — ready for dispatch");
                        void load();
                      } catch (e) {
                        toast.error(formatApiErrors(e));
                      }
                    }}
                  >
                    Release PO
                  </Button>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New purchase order</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>PO Type</Label>
                <Select value={poType} onValueChange={setPoType}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Regular", "Additional", "Demo", "Test Drive", "Replacement"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select></div>
              <div><Label>Payment Terms</Label>
                <Select value={paymentTerms} onValueChange={setPaymentTerms}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Advance", "Credit", "Inventory Funding", "Other"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select></div>
            </div>
            <div><Label>Model</Label>
              <Select value={model || undefined} onValueChange={applyModelChange}>
                <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger><SelectContent>{catalogModels.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Variant</Label>
                {variantOptions.length === 0 ? (
                  <Input value="Standard lineup" disabled className="bg-secondary/50" />
                ) : (
                  <Select value={variant || undefined} onValueChange={applyVariantChange}>
                    <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select variant" /></SelectTrigger>
                    <SelectContent>
                      {variantOptions.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div><Label>Colour</Label>
                <Select
                  value={colour || undefined}
                  onValueChange={setColour}
                  disabled={colourOptions.length === 0}
                >
                  <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select colour" /></SelectTrigger>
                  <SelectContent>
                    {colourOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Qty</Label><Input type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} /></div>
              <div><Label>Basic Price</Label><Input type="number" value={basicPrice} onChange={(e) => setBasicPrice(e.target.value)} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button disabled={saving || !model} onClick={() => void onCreate()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

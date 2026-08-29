import { useCallback, useEffect, useMemo, useState } from "react";
import { ClipboardList, Loader2, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatApiErrors } from "@/lib/api";
import { getAdminUser, canPerformAction } from "@/lib/adminAuth";
import { useVehicleCatalog } from "@/hooks/useVehicleCatalog";
import { exteriorColoursFor } from "@/data/stockColourOptions";
import PoLineEditorRow, { emptyPoLineDraft, formatPoLineLabel, type PoLineDraft } from "@/components/admin/PoLineEditorRow";
import {
  approvePurchaseOrder,
  createPipelinePurchaseOrder,
  fetchPipelinePurchaseOrders,
  rejectPurchaseOrder,
  releasePurchaseOrder,
  submitPurchaseOrder,
  type PurchaseOrder,
} from "@/lib/stockPipelineApi";

function openCreateLines(catalogModels: string[], trimsFor: (m: string) => string[]): PoLineDraft[] {
  const model = catalogModels[0] ?? "";
  const variant = trimsFor(model)[0] ?? "";
  return [emptyPoLineDraft(model, variant, exteriorColoursFor(model, variant)[0] ?? "")];
}

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
  const [lines, setLines] = useState<PoLineDraft[]>([]);
  const [poType, setPoType] = useState("Regular");
  const [paymentTerms, setPaymentTerms] = useState("Advance");
  const [saving, setSaving] = useState(false);

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

  const openCreateDialog = () => {
    setLines(openCreateLines(catalogModels, trimsFor));
    setCreateOpen(true);
  };

  const updateLine = (key: string, next: PoLineDraft) => {
    setLines((prev) => prev.map((l) => (l.key === key ? next : l)));
  };

  const addLine = () => {
    const model = catalogModels[0] ?? "";
    setLines((prev) => [...prev, emptyPoLineDraft(model, trimsFor(model)[0] ?? "", "")]);
  };

  const onCreate = async () => {
    const payloadLines = lines
      .filter((l) => l.model.trim())
      .map((l) => ({
        model: l.model.trim(),
        variant: l.variant.trim() || undefined,
        colour: l.colour.trim() || undefined,
        qty: Math.max(1, Number(l.qty) || 1),
        basicPrice: Number(l.basicPrice) || 0,
        modelYear: new Date().getFullYear(),
      }));
    if (!payloadLines.length) return toast.error("Add at least one PO line with a model");
    setSaving(true);
    try {
      await createPipelinePurchaseOrder({
        poType,
        paymentTerms,
        supplier: "VinFast",
        bookingLinked: false,
        lines: payloadLines,
      });
      toast.success(`Purchase order created with ${payloadLines.length} line(s)`);
      setCreateOpen(false);
      void load();
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setSaving(false);
    }
  };

  const pendingApproval = rows.filter((po) => po.status === "SUBMITTED").length;
  const lineSummary = useMemo(
    () => (po: PurchaseOrder) => po.lines.map((l) => formatPoLineLabel(l)).join(" | "),
    [],
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6" /> Purchase Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            One PO can include multiple model lines — each line is model + variant + colour + qty
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => void load()}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          {canCreatePo ? (
            <Button size="sm" onClick={openCreateDialog}>
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
                  <p className="text-xs text-muted-foreground">
                    {po.poType || "Regular"} · {po.paymentTerms || "Advance"} · {po.lines.length} line(s)
                  </p>
                </div>
                <Badge variant={po.status === "SUBMITTED" ? "default" : "secondary"}>{po.status}</Badge>
              </div>
              <div className="overflow-x-auto rounded-md border border-border/40">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground bg-secondary/30">
                      <th className="p-2 font-medium">#</th>
                      <th className="p-2 font-medium">Model line</th>
                      <th className="p-2 font-medium">Qty</th>
                      <th className="p-2 font-medium">Dispatched</th>
                      <th className="p-2 font-medium">Received</th>
                      <th className="p-2 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {po.lines.map((l, i) => (
                      <tr key={l._id || i} className="border-t border-border/30">
                        <td className="p-2 text-muted-foreground">{i + 1}</td>
                        <td className="p-2 font-medium">{formatPoLineLabel(l)}</td>
                        <td className="p-2">{l.qty}</td>
                        <td className="p-2">{l.dispatchedQty ?? 0} / {l.qty}</td>
                        <td className="p-2">{l.receivedQty ?? 0} / {l.qty}</td>
                        <td className="p-2">{l.netPurchaseValue ? `₹${l.netPurchaseValue.toLocaleString()}` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground truncate" title={lineSummary(po)}>
                {lineSummary(po)}
              </p>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New purchase order</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>PO Type</Label>
                <Select value={poType} onValueChange={setPoType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Regular", "Additional", "Demo", "Test Drive", "Replacement"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment Terms</Label>
                <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Advance", "Credit", "Inventory Funding", "Other"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">PO lines (model-wise)</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLine}>
                  <Plus className="h-4 w-4 mr-1" /> Add line
                </Button>
              </div>
              {lines.map((line, index) => (
                <PoLineEditorRow
                  key={line.key}
                  index={index}
                  line={line}
                  catalogModels={catalogModels}
                  trimsFor={trimsFor}
                  onChange={(next) => updateLine(line.key, next)}
                  onRemove={() => setLines((prev) => prev.filter((l) => l.key !== line.key))}
                  removable={lines.length > 1}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button disabled={saving || !lines.some((l) => l.model.trim())} onClick={() => void onCreate()}>
              Create PO ({lines.filter((l) => l.model.trim()).length} lines)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Plus, RefreshCw, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatApiErrors } from "@/lib/api";
import { formatPoLineLabel } from "@/components/admin/PoLineEditorRow";
import {
  createDispatch,
  fetchDispatches,
  fetchPipelinePurchaseOrders,
  type DispatchRecord,
  type PoLine,
  type PurchaseOrder,
} from "@/lib/stockPipelineApi";

type VinEntry = { key: string; poLineId: string; vin: string; motorNo: string };

function pendingQty(line: PoLine) {
  return Math.max(0, line.qty - (line.dispatchedQty ?? 0));
}

export default function AdminDispatches() {
  const [rows, setRows] = useState<DispatchRecord[]>([]);
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [poId, setPoId] = useState("");
  const [transport, setTransport] = useState({
    oemInvoiceNumber: "",
    oemInvoiceDate: new Date().toISOString().slice(0, 10),
    transporter: "VinFast Logistics",
    lrNumber: "",
    truckNumber: "",
    driverName: "",
    driverMobile: "",
  });
  const [vinEntries, setVinEntries] = useState<VinEntry[]>([]);
  const [saving, setSaving] = useState(false);

  const selectedPo = useMemo(() => pos.find((p) => p._id === poId), [pos, poId]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [d, released, partial] = await Promise.all([
        fetchDispatches(),
        fetchPipelinePurchaseOrders({ status: "RELEASED" }),
        fetchPipelinePurchaseOrders({ status: "PART_SUPPLIED" }),
      ]);
      setRows(d);
      const merged = [...released, ...partial.filter((p) => !released.some((r) => r._id === p._id))];
      setPos(merged);
      if (!poId && merged[0]) setPoId(merged[0]._id);
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setLoading(false);
    }
  }, [poId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!selectedPo) {
      setVinEntries([]);
      return;
    }
    setVinEntries([]);
  }, [selectedPo?._id]);

  const addVinRow = (line: PoLine) => {
    if (!line._id) return;
    const pending = pendingQty(line);
    const existing = vinEntries.filter((v) => v.poLineId === line._id).length;
    if (existing >= pending) {
      toast.error(`Line already has ${pending} pending VIN slot(s)`);
      return;
    }
    setVinEntries((prev) => [
      ...prev,
      { key: `${line._id}-${Date.now()}`, poLineId: line._id!, vin: "", motorNo: "" },
    ]);
  };

  const submit = async () => {
    if (!poId || !selectedPo) return toast.error("Select a released PO");
    if (!transport.oemInvoiceNumber || !transport.lrNumber || !transport.truckNumber) {
      return toast.error("Invoice number, LR number and truck number are required");
    }
    const items = vinEntries
      .filter((v) => v.vin.trim())
      .map((v) => {
        const line = selectedPo.lines.find((l) => l._id === v.poLineId);
        if (!line) return null;
        return {
          poLineId: v.poLineId,
          vin: v.vin.trim().toUpperCase(),
          model: line.model,
          variant: line.variant,
          colour: line.colour,
          motorNo: v.motorNo.trim() || undefined,
        };
      })
      .filter(Boolean);
    if (!items.length) return toast.error("Enter at least one VIN against a PO line");

    setSaving(true);
    try {
      await createDispatch({
        purchaseOrderId: poId,
        oemInvoiceNumber: transport.oemInvoiceNumber,
        oemInvoiceDate: transport.oemInvoiceDate,
        dispatchDate: new Date().toISOString(),
        transporter: transport.transporter,
        lrNumber: transport.lrNumber,
        truckNumber: transport.truckNumber,
        driverName: transport.driverName || undefined,
        driverMobile: transport.driverMobile || undefined,
        items,
      });
      toast.success(`Dispatch created with ${items.length} VIN(s)`);
      setOpen(false);
      setVinEntries([]);
      void load();
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Truck className="h-6 w-6" /> Dispatch & Transit</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Dispatch VINs against each PO line — model, variant and colour come from the PO
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => void load()}><RefreshCw className="h-4 w-4" /></Button>
          <Button size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" /> New Dispatch</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" /></div>
      ) : rows.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground border-dashed">No dispatches yet.</Card>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <Card key={r._id} className="p-4 space-y-3">
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div>
                  <p className="font-medium">{r.dispatchNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    PO: {r.poNumber} · Invoice: {r.oemInvoiceNumber} · Truck: {r.truckNumber}
                  </p>
                </div>
                <Badge>{r.status}</Badge>
              </div>
              {r.items?.length ? (
                <div className="overflow-x-auto rounded border border-border/40">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-muted-foreground bg-secondary/30 text-left">
                        <th className="p-2">VIN</th>
                        <th className="p-2">PO line</th>
                        <th className="p-2">Match</th>
                      </tr>
                    </thead>
                    <tbody>
                      {r.items.map((item, i) => (
                        <tr key={i} className="border-t border-border/30">
                          <td className="p-2 font-mono">{item.vin}</td>
                          <td className="p-2">
                            {formatPoLineLabel(item)}
                          </td>
                          <td className="p-2">{item.configMatch ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create dispatch from PO lines</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Purchase order *</Label>
              <Select value={poId} onValueChange={setPoId}>
                <SelectTrigger><SelectValue placeholder="Select released PO" /></SelectTrigger>
                <SelectContent>
                  {pos.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.poNumber} · {p.lines.length} line(s) · {p.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPo ? (
              <div className="space-y-3 rounded-lg border border-border/50 p-3 bg-secondary/10">
                <p className="text-xs font-semibold text-muted-foreground uppercase">PO lines — add VIN per line</p>
                {selectedPo.lines.map((line, index) => {
                  const pending = pendingQty(line);
                  const lineVins = vinEntries.filter((v) => v.poLineId === line._id);
                  return (
                    <div key={line._id || index} className="rounded-md border border-border/40 bg-background/80 p-3 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">Line {index + 1}: {formatPoLineLabel(line)}</p>
                          <p className="text-xs text-muted-foreground">
                            Ordered {line.qty} · Dispatched {line.dispatchedQty ?? 0} · Pending {pending}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={!line._id || pending <= 0}
                          onClick={() => addVinRow(line)}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" /> Add VIN
                        </Button>
                      </div>
                      {lineVins.map((entry) => (
                        <div key={entry.key} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                          <div>
                            <Label className="text-xs">VIN *</Label>
                            <Input
                              value={entry.vin}
                              onChange={(e) =>
                                setVinEntries((prev) =>
                                  prev.map((v) => (v.key === entry.key ? { ...v, vin: e.target.value.toUpperCase() } : v)),
                                )
                              }
                              className="font-mono uppercase"
                              placeholder="VIN for this line"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Motor no.</Label>
                            <Input
                              value={entry.motorNo}
                              onChange={(e) =>
                                setVinEntries((prev) =>
                                  prev.map((v) => (v.key === entry.key ? { ...v, motorNo: e.target.value.toUpperCase() } : v)),
                                )
                              }
                              className="font-mono uppercase"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => setVinEntries((prev) => prev.filter((v) => v.key !== entry.key))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ) : null}

            <div className="grid sm:grid-cols-2 gap-3">
              {(
                [
                  ["oemInvoiceNumber", "OEM Invoice No. *"],
                  ["oemInvoiceDate", "OEM Invoice Date *"],
                  ["transporter", "Transporter *"],
                  ["lrNumber", "LR Number *"],
                  ["truckNumber", "Truck Number *"],
                  ["driverName", "Driver Name"],
                  ["driverMobile", "Driver Mobile"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <Label className="text-xs">{label}</Label>
                  <Input
                    type={key === "oemInvoiceDate" ? "date" : "text"}
                    value={transport[key]}
                    onChange={(e) => setTransport({ ...transport, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => void submit()} disabled={saving}>
              {saving ? "Creating…" : `Create dispatch (${vinEntries.filter((v) => v.vin.trim()).length} VINs)`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

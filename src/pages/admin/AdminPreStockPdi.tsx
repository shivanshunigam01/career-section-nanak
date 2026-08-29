import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, RefreshCw, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  fetchPdiQueue,
  fetchPdis,
  submitPreStockPdi,
  type StockPdiRecord,
  type StockUnit,
} from "@/lib/stockPipelineApi";
import { formatApiErrors } from "@/lib/api";

export default function AdminPreStockPdi() {
  const [queue, setQueue] = useState<StockUnit[]>([]);
  const [completed, setCompleted] = useState<StockPdiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [soc, setSoc] = useState("80");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [q, done] = await Promise.all([fetchPdiQueue(), fetchPdis("PRE_STOCK")]);
      setQueue(q);
      setCompleted(done);
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async (unit: StockUnit, result: string) => {
    try {
      await submitPreStockPdi(unit._id, {
        result,
        socPercent: Number(soc),
        hvBatteryStatus: "OK",
        batteryWarning: false,
        diagnosticScan: true,
        dtcPresent: false,
        checklist: [],
        notes: result === "PASS" ? "Pre-stock PDI passed" : "Issue found",
      });
      toast.success(`PDI ${result} — ${unit.vinNo}`);
      void load();
    } catch (e) {
      toast.error(formatApiErrors(e));
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wrench className="h-6 w-6" /> Pre-Stock PDI
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Vehicles appear here after Receipt Verification (status PDI_PENDING). PASS → AVAILABLE stock.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Default SOC %</span>
          <Input className="w-20 h-9" value={soc} onChange={(e) => setSoc(e.target.value)} placeholder="SOC" />
          <Button variant="outline" size="sm" onClick={() => void load()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">PDI queue ({queue.length})</h2>
              <Badge variant="secondary">PDI Executive</Badge>
            </div>
            {queue.length === 0 ? (
              <Card className="p-8 text-center border-dashed space-y-3">
                <Wrench className="h-10 w-10 mx-auto text-muted-foreground/40" />
                <p className="font-medium text-foreground">No vehicles waiting for pre-stock PDI</p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Complete <strong>Receipt Verification</strong> on vehicles in RECEIVED status first.
                  Demo VIN <span className="font-mono">DEMOVF700005</span> is seeded at this stage.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/stock/receipt">Go to Receipt Verification</Link>
                </Button>
              </Card>
            ) : (
              queue.map((u) => (
                <Card key={u._id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                  <div className="min-w-0">
                    <p className="font-mono font-semibold">{u.vinNo}</p>
                    <p className="text-sm text-muted-foreground">
                      {u.model}{u.variant ? ` · ${u.variant}` : ""}{u.colour ? ` · ${u.colour}` : ""}
                    </p>
                    <Badge variant="outline" className="mt-1 text-[10px]">{u.vehicleStatus ?? u.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <Button size="sm" onClick={() => void submit(u, "PASS")}>PASS</Button>
                    <Button size="sm" variant="destructive" onClick={() => void submit(u, "FAIL")}>FAIL</Button>
                    <Button size="sm" variant="outline" onClick={() => void submit(u, "TECHNICAL_HOLD")}>HOLD</Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {completed.length > 0 ? (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold">Recent pre-stock PDI ({completed.length})</h2>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {completed.slice(0, 12).map((p) => (
                  <Card key={p._id} className="p-3 text-sm">
                    <p className="font-mono font-medium truncate">{p.vin || p.pdiNumber}</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {p.pdiNumber} · {p.result}
                      {p.performedAt ? ` · ${new Date(p.performedAt).toLocaleDateString()}` : ""}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

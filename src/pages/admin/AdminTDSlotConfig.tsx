import { useCallback, useEffect, useState } from "react";
import { adminGet, adminPostJson, formatApiErrors } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2, Clock, RefreshCw, Loader2, Save, Calendar,
  Ban, CheckCircle2, Search, Zap
} from "lucide-react";
import { toast } from "sonner";

type Branch = { _id: string; name: string; code: string };
type SlotConfig = {
  _id: string;
  branchId: { _id: string; name: string; code: string } | null;
  slotDuration: number;
  bufferTime: number;
  workingStartTime: string;
  workingEndTime: string;
  maxConcurrentBookings: number;
  autoExpiry: boolean;
  blockedDates: string[];
};

type SlotAvailability = { time: string; available: boolean; bookings: number; maxBookings: number };

export default function AdminTDSlotConfig() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [configs, setConfigs] = useState<SlotConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [form, setForm] = useState({
    branchId: "", slotDuration: 60, bufferTime: 15,
    workingStartTime: "09:00", workingEndTime: "18:00",
    maxConcurrentBookings: 2, autoExpiry: true
  });

  // Slot preview
  const [previewDate, setPreviewDate] = useState("");
  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Block date
  const [blockDate, setBlockDate] = useState("");
  const [blockLoading, setBlockLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [bRes, cRes] = await Promise.all([
        adminGet<Branch[]>("/admin/td/branches/public"),
        adminGet<SlotConfig[]>("/admin/td/slots")
      ]);
      setBranches(bRes.data ?? []);
      setConfigs(cRes.data ?? []);
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData]);

  // Load config when branch changes
  useEffect(() => {
    if (!selectedBranch) return;
    const existing = configs.find((c) => c.branchId?._id === selectedBranch);
    if (existing) {
      setForm({
        branchId: selectedBranch,
        slotDuration: existing.slotDuration,
        bufferTime: existing.bufferTime,
        workingStartTime: existing.workingStartTime,
        workingEndTime: existing.workingEndTime,
        maxConcurrentBookings: existing.maxConcurrentBookings,
        autoExpiry: existing.autoExpiry
      });
    } else {
      setForm((p) => ({ ...p, branchId: selectedBranch }));
    }
  }, [selectedBranch, configs]);

  const handleSave = async () => {
    if (!form.branchId) { toast.error("Please select a branch"); return; }
    setSaving(true);
    try {
      await adminPostJson("/admin/td/slots/config", form);
      toast.success("Slot configuration saved!");
      void fetchData();
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setSaving(false);
    }
  };

  const fetchSlotPreview = async () => {
    if (!selectedBranch || !previewDate) { toast.error("Select a branch and date first"); return; }
    setSlotsLoading(true);
    try {
      const { data } = await adminGet<SlotAvailability[]>(`/admin/td/slots/available?branchId=${selectedBranch}&date=${previewDate}`);
      setSlots(data ?? []);
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBlockDate = async (action: "block" | "unblock") => {
    if (!selectedBranch || !blockDate) { toast.error("Select a branch and date"); return; }
    setBlockLoading(true);
    try {
      const endpoint = action === "block" ? "/admin/td/slots/block-date" : "/admin/td/slots/unblock-date";
      await adminPostJson(endpoint, { branchId: selectedBranch, date: blockDate });
      toast.success(`Date ${action === "block" ? "blocked" : "unblocked"} successfully`);
      setBlockDate("");
      void fetchData();
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setBlockLoading(false);
    }
  };

  const currentConfig = configs.find((c) => c.branchId?._id === selectedBranch);
  const blockedDates = currentConfig?.blockedDates ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" /> Slot Configuration
          </h1>
          <p className="text-muted-foreground text-sm">Configure test drive slots, timings, and blocked dates</p>
        </div>
        <Button onClick={() => void fetchData()} variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...</div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Config Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Branch selector */}
            <Card className="bg-card border-border/50 p-4 space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Select Branch</h3>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Choose a branch to configure" /></SelectTrigger>
                <SelectContent>{branches.map((b) => <SelectItem key={b._id} value={b._id}>{b.name} ({b.code})</SelectItem>)}</SelectContent>
              </Select>
              {!selectedBranch && <p className="text-xs text-muted-foreground">Select a branch to view or edit its slot configuration.</p>}
            </Card>

            {selectedBranch && (
              <Tabs defaultValue="config">
                <TabsList className="bg-secondary/50">
                  <TabsTrigger value="config">Slot Config</TabsTrigger>
                  <TabsTrigger value="preview">Slot Preview</TabsTrigger>
                  <TabsTrigger value="blocked">Blocked Dates</TabsTrigger>
                </TabsList>

                {/* Config Tab */}
                <TabsContent value="config" className="mt-4">
                  <Card className="bg-card border-border/50 p-5 space-y-5">
                    <h3 className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Timing Configuration</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Slot Duration (minutes)</Label>
                        <Select value={String(form.slotDuration)} onValueChange={(v) => setForm((p) => ({ ...p, slotDuration: Number(v) }))}>
                          <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="30">30 min</SelectItem><SelectItem value="45">45 min</SelectItem><SelectItem value="60">60 min</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Buffer Time (minutes)</Label>
                        <Input type="number" min={0} max={30} value={form.bufferTime} onChange={(e) => setForm((p) => ({ ...p, bufferTime: Number(e.target.value) }))} className="bg-secondary/50" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Working Start Time</Label>
                        <Input type="time" value={form.workingStartTime} onChange={(e) => setForm((p) => ({ ...p, workingStartTime: e.target.value }))} className="bg-secondary/50" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Working End Time</Label>
                        <Input type="time" value={form.workingEndTime} onChange={(e) => setForm((p) => ({ ...p, workingEndTime: e.target.value }))} className="bg-secondary/50" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Max Concurrent Bookings per Slot</Label>
                        <Input type="number" min={1} max={10} value={form.maxConcurrentBookings} onChange={(e) => setForm((p) => ({ ...p, maxConcurrentBookings: Number(e.target.value) }))} className="bg-secondary/50" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Auto-Expiry of Stale Bookings</Label>
                        <Select value={String(form.autoExpiry)} onValueChange={(v) => setForm((p) => ({ ...p, autoExpiry: v === "true" }))}>
                          <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="true">Enabled</SelectItem><SelectItem value="false">Disabled</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Preview summary */}
                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1.5 font-medium text-foreground mb-1"><Zap className="w-3.5 h-3.5 text-primary" /> Configuration Preview</p>
                      <p>Slots run from <span className="text-foreground">{form.workingStartTime}</span> to <span className="text-foreground">{form.workingEndTime}</span></p>
                      <p>Each slot: <span className="text-foreground">{form.slotDuration} min</span> + <span className="text-foreground">{form.bufferTime} min buffer</span></p>
                      <p>Max <span className="text-foreground">{form.maxConcurrentBookings}</span> concurrent booking(s) per slot</p>
                      <p>Double booking: <span className="text-red-400">Not Allowed</span></p>
                    </div>

                    <Button onClick={() => void handleSave()} disabled={saving} className="bg-primary text-primary-foreground w-full">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save Configuration
                    </Button>
                  </Card>
                </TabsContent>

                {/* Preview Tab */}
                <TabsContent value="preview" className="mt-4">
                  <Card className="bg-card border-border/50 p-5 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><Search className="w-4 h-4 text-primary" /> Preview Available Slots</h3>
                    <div className="flex gap-3">
                      <Input type="date" value={previewDate} onChange={(e) => setPreviewDate(e.target.value)} className="bg-secondary/50 flex-1" />
                      <Button onClick={() => void fetchSlotPreview()} disabled={slotsLoading} className="bg-primary text-primary-foreground shrink-0">
                        {slotsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      </Button>
                    </div>
                    {slots.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {slots.map((slot) => (
                          <div key={slot.time} className={`rounded-lg border p-3 text-center ${slot.available ? "bg-green-400/5 border-green-400/20" : "bg-red-400/5 border-red-400/20"}`}>
                            <p className="font-mono font-semibold text-foreground">{slot.time}</p>
                            <p className={`text-xs mt-0.5 ${slot.available ? "text-green-400" : "text-red-400"}`}>
                              {slot.available ? `${slot.bookings}/${slot.maxBookings} booked` : "Full"}
                            </p>
                            {slot.available ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mx-auto mt-1" /> : <Ban className="w-3.5 h-3.5 text-red-400 mx-auto mt-1" />}
                          </div>
                        ))}
                      </div>
                    )}
                    {slots.length === 0 && previewDate && !slotsLoading && (
                      <p className="text-muted-foreground text-sm text-center py-6">No slots available for this date (may be blocked)</p>
                    )}
                  </Card>
                </TabsContent>

                {/* Blocked Dates Tab */}
                <TabsContent value="blocked" className="mt-4">
                  <Card className="bg-card border-border/50 p-5 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Blocked Dates</h3>
                    <div className="flex gap-3">
                      <Input type="date" value={blockDate} onChange={(e) => setBlockDate(e.target.value)} className="bg-secondary/50 flex-1" />
                      <Button onClick={() => void handleBlockDate("block")} disabled={blockLoading} variant="destructive" className="shrink-0">
                        <Ban className="w-4 h-4 mr-1" /> Block
                      </Button>
                      <Button onClick={() => void handleBlockDate("unblock")} disabled={blockLoading} variant="outline" className="shrink-0 text-green-400 border-green-400/20 hover:bg-green-400/10">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Unblock
                      </Button>
                    </div>
                    {blockedDates.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">{blockedDates.length} date(s) blocked</p>
                        <div className="flex flex-wrap gap-2">
                          {[...blockedDates].sort().map((d) => (
                            <Badge key={d} className="bg-red-400/10 text-red-400 border-red-400/20 font-mono">
                              {d}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm text-center py-6">No dates blocked for this branch</p>
                    )}
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>

          {/* Right: All branch configs summary */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> All Branch Configs</h3>
            {configs.length === 0 ? (
              <Card className="bg-card border-border/50 p-4 text-center text-muted-foreground text-sm">
                No configurations yet.<br />Select a branch and save to create one.
              </Card>
            ) : (
              configs.map((c) => (
                <Card key={c._id} className={`bg-card border-border/50 p-4 space-y-2 cursor-pointer transition-colors ${selectedBranch === c.branchId?._id ? "border-primary/50" : "hover:border-border"}`}
                  onClick={() => setSelectedBranch(c.branchId?._id ?? "")}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground text-sm">{c.branchId?.name ?? "Unknown Branch"}</p>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">{c.branchId?.code}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{c.workingStartTime} – {c.workingEndTime}</div>
                    <div className="flex items-center gap-1.5"><Zap className="w-3 h-3" />{c.slotDuration}min slots + {c.bufferTime}min buffer</div>
                    <div>Max concurrent: {c.maxConcurrentBookings}</div>
                    {c.blockedDates.length > 0 && (
                      <div className="text-red-400 flex items-center gap-1"><Ban className="w-3 h-3" />{c.blockedDates.length} date(s) blocked</div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

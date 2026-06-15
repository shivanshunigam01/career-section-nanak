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
  Ban, CheckCircle2, Search, Zap, Car, Plus, Trash2, Wand2
} from "lucide-react";
import { toast } from "sonner";
import {
  formatTime12h,
  generateSlotTimesFromRules,
  normalizeSlotTimesList,
} from "@/lib/tdSlotSchedule";
import { TdSlotGrid, type TdSlotGridItem } from "@/components/TdSlotGrid";

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
  slotTimes?: string[];
  disabledSlotsByDate?: Record<string, string[]>;
};

type SlotAvailability = {
  time: string;
  label?: string;
  available: boolean;
  bookings: number;
  maxBookings: number;
  reason?: string | null;
};
type FleetSummary = { model: string; available: number; total: number; capacity: number };

export default function AdminTDSlotConfig() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [configs, setConfigs] = useState<SlotConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [form, setForm] = useState({
    branchId: "", slotDuration: 60, bufferTime: 15,
    workingStartTime: "09:00", workingEndTime: "18:00",
    maxConcurrentBookings: 2, autoExpiry: true,
    slotTimes: [] as string[],
  });
  const [newSlotTime, setNewSlotTime] = useState("10:00");

  // Slot preview
  const [previewDate, setPreviewDate] = useState("");
  const [previewModel, setPreviewModel] = useState("VF 7");
  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Block date
  const [blockDate, setBlockDate] = useState("");
  const [blockLoading, setBlockLoading] = useState(false);
  const [fleetSummary, setFleetSummary] = useState<FleetSummary[]>([]);

  // Daily slot overrides (admin open/close per date)
  const [dailyDate, setDailyDate] = useState("");
  const [dailyModel, setDailyModel] = useState("VF 7");
  const [dailySlots, setDailySlots] = useState<TdSlotGridItem[]>([]);
  const [dailyDisabled, setDailyDisabled] = useState<string[]>([]);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [dailySaving, setDailySaving] = useState(false);

  const fetchFleetSummary = useCallback(async (branchId: string) => {
    if (!branchId) {
      setFleetSummary([]);
      return;
    }
    try {
      const { data } = await adminGet<{ model: string; status: string }[]>(
        `/admin/td/vehicles?branchId=${branchId}&limit=100`,
      );
      const rows = data ?? [];
      const byModel = new Map<string, { available: number; total: number; capacity: number }>();
      for (const v of rows) {
        const cur = byModel.get(v.model) ?? { available: 0, total: 0, capacity: 0 };
        cur.total += 1;
        cur.capacity += 1;
        if (v.status === "AVAILABLE") cur.available += 1;
        byModel.set(v.model, cur);
      }
      setFleetSummary(
        [...byModel.entries()].map(([model, counts]) => ({ model, ...counts })),
      );
    } catch {
      setFleetSummary([]);
    }
  }, []);

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
    void fetchFleetSummary(selectedBranch);
    const existing = configs.find((c) => c.branchId?._id === selectedBranch);
    if (existing) {
      setForm({
        branchId: selectedBranch,
        slotDuration: existing.slotDuration,
        bufferTime: existing.bufferTime,
        workingStartTime: existing.workingStartTime,
        workingEndTime: existing.workingEndTime,
        maxConcurrentBookings: existing.maxConcurrentBookings,
        autoExpiry: existing.autoExpiry,
        slotTimes: existing.slotTimes?.length
          ? [...existing.slotTimes]
          : generateSlotTimesFromRules({
              workingStartTime: existing.workingStartTime,
              workingEndTime: existing.workingEndTime,
              slotDuration: existing.slotDuration,
              bufferTime: existing.bufferTime,
            }),
      });
    } else {
      setForm((p) => ({
        ...p,
        branchId: selectedBranch,
        slotTimes: generateSlotTimesFromRules(p),
      }));
    }
  }, [selectedBranch, configs, fetchFleetSummary]);

  const handleSave = async () => {
    if (!form.branchId) { toast.error("Please select a branch"); return; }
    if (form.slotTimes.length === 0) {
      toast.error("Add at least one test drive time slot.");
      return;
    }
    setSaving(true);
    try {
      await adminPostJson("/admin/td/slots/config", {
        ...form,
        slotTimes: normalizeSlotTimesList(form.slotTimes),
      });
      toast.success("Slot configuration saved! Website test drive page will use these timings.");
      void fetchData();
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateTimings = () => {
    const generated = generateSlotTimesFromRules(form);
    setForm((p) => ({ ...p, slotTimes: generated }));
    toast.success(`Generated ${generated.length} time slot(s) from your duration & hours settings.`);
  };

  const handleAddSlotTime = () => {
    if (!newSlotTime) return;
    setForm((p) => ({
      ...p,
      slotTimes: normalizeSlotTimesList([...p.slotTimes, newSlotTime]),
    }));
  };

  const handleRemoveSlotTime = (time: string) => {
    setForm((p) => ({ ...p, slotTimes: p.slotTimes.filter((t) => t !== time) }));
  };

  const fetchSlotPreview = async () => {
    if (!selectedBranch || !previewDate) { toast.error("Select a branch and date first"); return; }
    setSlotsLoading(true);
    try {
      const q = new URLSearchParams({
        branchId: selectedBranch,
        date: previewDate,
        model: previewModel,
      });
      const { data } = await adminGet<SlotAvailability[]>(`/admin/td/slots/available?${q}`);
      setSlots(data ?? []);
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setSlotsLoading(false);
    }
  };

  const loadDailySlots = async () => {
    if (!selectedBranch || !dailyDate) {
      toast.error("Select a branch and date first");
      return;
    }
    setDailyLoading(true);
    try {
      const q = new URLSearchParams({
        branchId: selectedBranch,
        date: dailyDate,
        model: dailyModel,
      });
      const { data } = await adminGet<SlotAvailability[]>(`/admin/td/slots/available?${q}`);
      setDailySlots(data ?? []);
      const cfg = configs.find((c) => c.branchId?._id === selectedBranch);
      const map = cfg?.disabledSlotsByDate ?? {};
      setDailyDisabled(map[dailyDate] ?? []);
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setDailyLoading(false);
    }
  };

  const toggleDailySlot = (time: string) => {
    const slot = dailySlots.find((s) => s.time === time);
    const fullFromBookings = slot?.reason === "full" || (slot?.bookings ?? 0) >= (slot?.maxBookings ?? 1);
    if (fullFromBookings) {
      toast.info("This slot is already booked — it stays unavailable for new customers.");
      return;
    }
    setDailyDisabled((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : normalizeSlotTimesList([...prev, time]),
    );
  };

  const saveDailyOverrides = async () => {
    if (!selectedBranch || !dailyDate) return;
    setDailySaving(true);
    try {
      await adminPostJson("/admin/td/slots/date-overrides", {
        branchId: selectedBranch,
        date: dailyDate,
        disabledTimes: dailyDisabled,
      });
      toast.success("Daily slot availability saved — website will reflect this immediately.");
      void fetchData();
      void loadDailySlots();
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setDailySaving(false);
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
          <p className="text-muted-foreground text-sm">
            Manage test drive timings here — the website test drive page loads these exact slots via API.
          </p>
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

            {selectedBranch && fleetSummary.length > 0 && (
              <Card className="bg-card border-border/50 p-4 space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Car className="w-4 h-4 text-primary" /> Demo fleet capacity (website slots)
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Each time slot allows up to{" "}
                  <span className="text-foreground font-medium">{form.maxConcurrentBookings}</span> booking(s) per{" "}
                  <span className="text-foreground font-medium">model</span>, capped by demo cars for that model.
                  Example: Customer A books VF 7 on 16 Jun at 10:15 — that slot closes for VF 7 only; VF 6 can still
                  use 10:15 if a VF 6 demo car is free. Manage fleet under{" "}
                  <span className="text-primary">TD → Demo Fleet</span>.
                </p>
                <div className="flex flex-wrap gap-2">
                  {fleetSummary.map((f) => (
                    <Badge key={f.model} className="bg-secondary/80 text-foreground border-border/40">
                      {f.model}: {f.capacity} demo car(s) · {f.available} free now
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {selectedBranch && (
              <Tabs defaultValue="timings">
                <TabsList className="bg-secondary/50">
                  <TabsTrigger value="timings">Manage Timings</TabsTrigger>
                  <TabsTrigger value="daily">Daily availability</TabsTrigger>
                  <TabsTrigger value="config">Rules & Capacity</TabsTrigger>
                  <TabsTrigger value="preview">Live Preview</TabsTrigger>
                  <TabsTrigger value="blocked">Blocked Dates</TabsTrigger>
                </TabsList>

                {/* Manage Timings — shown on website */}
                <TabsContent value="timings" className="mt-4">
                  <Card className="bg-card border-border/50 p-5 space-y-5">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" /> Test drive time slots
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        These are the exact times customers see on the test drive booking page.
                        Remove a time to stop offering it; add custom times as needed.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={handleGenerateTimings}>
                        <Wand2 className="w-4 h-4 mr-2" /> Generate from rules below
                      </Button>
                      <Badge variant="outline" className="text-xs">
                        {form.slotTimes.length} slot(s) configured
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {form.slotTimes.map((t) => (
                        <div
                          key={t}
                          className="box-border flex h-[4.25rem] flex-col items-center justify-center rounded-xl border-2 border-primary/60 bg-background px-2 py-2 text-center relative group"
                        >
                          <p className="text-sm font-semibold">{formatTime12h(t)}</p>
                          <p className="text-[10px] text-emerald-500 font-medium mt-1">On website</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-7 w-7 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-400/10"
                            onClick={() => handleRemoveSlotTime(t)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {form.slotTimes.length === 0 ? (
                      <p className="text-sm text-amber-500 text-center py-4">
                        No timings yet. Generate from rules or add a time manually.
                      </p>
                    ) : null}

                    <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border/40">
                      <Input
                        type="time"
                        value={newSlotTime}
                        onChange={(e) => setNewSlotTime(e.target.value)}
                        className="bg-secondary/50 sm:max-w-[10rem]"
                      />
                      <Button type="button" variant="outline" onClick={handleAddSlotTime}>
                        <Plus className="w-4 h-4 mr-2" /> Add time slot
                      </Button>
                    </div>

                    <Button onClick={() => void handleSave()} disabled={saving} className="bg-primary text-primary-foreground w-full">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      Save timings to website
                    </Button>
                  </Card>
                </TabsContent>

                {/* Daily availability — toggle open/closed per date (same UX as website) */}
                <TabsContent value="daily" className="mt-4">
                  <Card className="bg-card border-border/50 p-5 space-y-4">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" /> Daily slot availability
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Pick a date and model, then tap slots to open or close them — same grid customers see.
                        Booked slots stay locked for that model only.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="date"
                        value={dailyDate}
                        onChange={(e) => setDailyDate(e.target.value)}
                        className="bg-secondary/50 flex-1"
                      />
                      <Select value={dailyModel} onValueChange={setDailyModel}>
                        <SelectTrigger className="bg-secondary/50 w-full sm:w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VF 6">VF 6</SelectItem>
                          <SelectItem value="VF 7">VF 7</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => void loadDailySlots()}
                        disabled={dailyLoading}
                        className="bg-primary text-primary-foreground shrink-0"
                      >
                        {dailyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                        Load slots
                      </Button>
                    </div>
                    {dailySlots.length > 0 ? (
                      <>
                        <TdSlotGrid
                          slots={dailySlots.map((s) => {
                            const full = (s.bookings ?? 0) >= (s.maxBookings ?? 1);
                            const adminOff = dailyDisabled.includes(s.time);
                            return {
                              ...s,
                              available: !full && !adminOff,
                              reason: full ? "full" : adminOff ? "blocked" : s.reason,
                            };
                          })}
                          toggleMode
                          adminDisabledTimes={dailyDisabled}
                          onToggleAdmin={toggleDailySlot}
                        />
                        <Button
                          onClick={() => void saveDailyOverrides()}
                          disabled={dailySaving}
                          className="w-full bg-primary text-primary-foreground"
                        >
                          {dailySaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                          Save availability for {dailyDate}
                        </Button>
                      </>
                    ) : dailyDate && !dailyLoading ? (
                      <p className="text-sm text-muted-foreground text-center py-6">
                        Click Load slots to manage availability for this date.
                      </p>
                    ) : null}
                  </Card>
                </TabsContent>

                {/* Config Tab */}
                <TabsContent value="config" className="mt-4">
                  <Card className="bg-card border-border/50 p-5 space-y-5">
                    <h3 className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Booking rules</h3>
                    <p className="text-xs text-muted-foreground">
                      Use these to auto-generate timings, or set capacity limits. Customer-facing times are managed in the Timings tab.
                    </p>
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
                        <Label className="text-xs">Max bookings per slot (per model)</Label>
                        <Input type="number" min={1} max={10} value={form.maxConcurrentBookings} onChange={(e) => setForm((p) => ({ ...p, maxConcurrentBookings: Number(e.target.value) }))} className="bg-secondary/50" />
                        <p className="text-[10px] text-muted-foreground">
                          Use 1 so one customer per model per time closes the slot. Use 2+ only if you have multiple demo cars of the same model.
                        </p>
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
                      <p>Max <span className="text-foreground">{form.maxConcurrentBookings}</span> booking(s) per slot per model (VF 6 and VF 7 tracked separately).</p>
                      <p>Same date + time + model: second customer sees slot as <span className="text-red-400">Full</span>.</p>
                    </div>

                    <Button onClick={() => void handleSave()} disabled={saving} className="bg-primary text-primary-foreground w-full">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save Configuration
                    </Button>
                  </Card>
                </TabsContent>

                {/* Preview Tab — same API as website */}
                <TabsContent value="preview" className="mt-4">
                  <Card className="bg-card border-border/50 p-5 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><Search className="w-4 h-4 text-primary" /> Website preview (live API)</h3>
                    <p className="text-xs text-muted-foreground">
                      Same API as the public test drive page — pick model to preview VF 6 vs VF 7 availability.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input type="date" value={previewDate} onChange={(e) => setPreviewDate(e.target.value)} className="bg-secondary/50 flex-1" />
                      <Select value={previewModel} onValueChange={setPreviewModel}>
                        <SelectTrigger className="bg-secondary/50 w-full sm:w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VF 6">VF 6</SelectItem>
                          <SelectItem value="VF 7">VF 7</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={() => void fetchSlotPreview()} disabled={slotsLoading} className="bg-primary text-primary-foreground shrink-0">
                        {slotsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      </Button>
                    </div>
                    {slots.length > 0 && (
                      <TdSlotGrid slots={slots} disabled />
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
                    <div className="flex items-center gap-1.5"><Zap className="w-3 h-3" />{(c.slotTimes?.length ?? 0) || "—"} website slot(s)</div>
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

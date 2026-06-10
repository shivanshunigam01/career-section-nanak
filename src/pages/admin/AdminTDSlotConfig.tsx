import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Clock, Plus, Save, Edit2, Trash2, CheckCircle, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  managerName: string;
  active: boolean;
  tdStartTime: string;
  tdEndTime: string;
  tdSlotDuration: number;
  tdBufferTime: number;
  weekdays: Record<string, boolean>;
}

const DEFAULT_WEEKDAYS = { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false };

const MOCK_BRANCHES: Branch[] = [
  {
    id: "1", name: "Patna Main Showroom", code: "PNA01",
    city: "Patna", address: "Dak Bungalow Road, Patna, Bihar 800001",
    phone: "9231445060", email: "patna@patliputravinfast.com",
    managerName: "Ankit Srivastava", active: true,
    tdStartTime: "09:00", tdEndTime: "18:00",
    tdSlotDuration: 45, tdBufferTime: 15,
    weekdays: { ...DEFAULT_WEEKDAYS }
  }
];

// Preview generated slots
const previewSlots = (start: string, end: string, duration: number, buffer: number) => {
  const slots: string[] = [];
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let current = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const step = duration + buffer;
  while (current + duration <= endMin) {
    const sH = String(Math.floor(current / 60)).padStart(2, "0");
    const sM = String(current % 60).padStart(2, "0");
    const eM2 = current + duration;
    const eH = String(Math.floor(eM2 / 60)).padStart(2, "0");
    const eMM = String(eM2 % 60).padStart(2, "0");
    slots.push(`${sH}:${sM} – ${eH}:${eMM}`);
    current += step;
  }
  return slots;
};

const DAY_LABELS: Record<string, string> = { monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun" };

const AdminTDSlotConfig = () => {
  const [branches, setBranches] = useState<Branch[]>(MOCK_BRANCHES);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);
  const [previewBranch, setPreviewBranch] = useState<Branch | null>(branches[0]);

  const previewSlotList = previewBranch
    ? previewSlots(previewBranch.tdStartTime, previewBranch.tdEndTime, previewBranch.tdSlotDuration, previewBranch.tdBufferTime)
    : [];

  const openEdit = (b: Branch) => { setEditBranch({ ...b }); setShowBranchForm(true); };
  const openAdd = () => { setEditBranch({ id: "", name: "", code: "", city: "", address: "", phone: "", email: "", managerName: "", active: true, tdStartTime: "09:00", tdEndTime: "18:00", tdSlotDuration: 45, tdBufferTime: 15, weekdays: { ...DEFAULT_WEEKDAYS } }); setShowBranchForm(true); };

  const saveBranch = (b: Branch) => {
    if (b.id) {
      setBranches(prev => prev.map(x => x.id === b.id ? b : x));
    } else {
      setBranches(prev => [...prev, { ...b, id: String(Date.now()) }]);
    }
    setShowBranchForm(false);
    toast.success("Branch configuration saved");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Slot & Branch Configuration</h1>
          <p className="text-muted-foreground text-sm">Configure test drive slots, timing, and branch settings</p>
        </div>
        <Button onClick={openAdd} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add Branch
        </Button>
      </div>

      <Tabs defaultValue="branches" className="space-y-4">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="preview">Slot Preview</TabsTrigger>
        </TabsList>

        {/* Branches Tab */}
        <TabsContent value="branches" className="space-y-4">
          {branches.map(branch => (
            <Card key={branch.id} className="bg-card border-border/50 overflow-hidden">
              {/* Branch Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground">{branch.name}</p>
                    <p className="text-xs text-muted-foreground">{branch.code} · {branch.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${branch.active ? "bg-green-400/10 text-green-400 border-green-400/30" : "bg-secondary text-muted-foreground border-border"}`}>
                    {branch.active ? "Active" : "Inactive"}
                  </span>
                  <button onClick={() => openEdit(branch)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Branch Config Grid */}
              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Slot Duration</p>
                  <p className="text-xl font-bold text-foreground font-display">{branch.tdSlotDuration}<span className="text-xs text-muted-foreground font-normal"> min</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1">Buffer Time</p>
                  <p className="text-xl font-bold text-foreground font-display">{branch.tdBufferTime}<span className="text-xs text-muted-foreground font-normal"> min</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1">Operating Hours</p>
                  <p className="text-sm font-semibold text-foreground">{branch.tdStartTime} – {branch.tdEndTime}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1">Slots / Day</p>
                  <p className="text-xl font-bold text-primary font-display">
                    {previewSlots(branch.tdStartTime, branch.tdEndTime, branch.tdSlotDuration, branch.tdBufferTime).length}
                  </p>
                </div>
              </div>

              {/* Weekdays */}
              <div className="px-4 pb-4 flex gap-1.5 flex-wrap">
                {Object.entries(branch.weekdays).map(([day, active]) => (
                  <span key={day} className={`text-[10px] px-2 py-1 rounded font-medium border ${active ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary/30 text-muted-foreground border-border/30 line-through opacity-50"}`}>
                    {DAY_LABELS[day]}
                  </span>
                ))}
              </div>

              {/* Contact */}
              <div className="px-4 pb-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span>{branch.address}</span>
                <span className="text-right">{branch.phone} · {branch.email}</span>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Slot Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card className="bg-card border-border/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Live Slot Preview
              </h3>
              {branches.length > 1 && (
                <Select value={previewBranch?.id} onValueChange={id => setPreviewBranch(branches.find(b => b.id === id) || null)}>
                  <SelectTrigger className="w-48 bg-secondary/50 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>

            {previewBranch && (
              <>
                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-lg font-bold text-foreground">{previewBranch.tdSlotDuration} min</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Buffer</p>
                    <p className="text-lg font-bold text-foreground">{previewBranch.tdBufferTime} min</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Total Slots/Day</p>
                    <p className="text-lg font-bold text-primary">{previewSlotList.length}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {previewSlotList.map((slot, i) => (
                    <div key={i} className="bg-secondary/30 border border-border/30 rounded-lg px-3 py-2 text-center">
                      <p className="text-xs font-semibold text-foreground">{slot}</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <CheckCircle className="w-2.5 h-2.5 text-green-400" />
                        <span className="text-[9px] text-green-400">Available</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Showing {previewSlotList.length} slots for {previewBranch.tdStartTime}–{previewBranch.tdEndTime} with {previewBranch.tdSlotDuration}min slots + {previewBranch.tdBufferTime}min buffer
                </p>
              </>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Branch Form Dialog */}
      <Dialog open={showBranchForm} onOpenChange={setShowBranchForm}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editBranch?.id ? "Edit Branch Configuration" : "Add New Branch"}</DialogTitle>
          </DialogHeader>
          {editBranch && <BranchForm branch={editBranch} onSave={saveBranch} onCancel={() => setShowBranchForm(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const BranchForm = ({ branch, onSave, onCancel }: { branch: Branch; onSave: (b: Branch) => void; onCancel: () => void }) => {
  const [form, setForm] = useState<Branch>(branch);
  const update = (k: keyof Branch, v: unknown) => setForm(p => ({ ...p, [k]: v }));
  const toggleDay = (day: string) => setForm(p => ({ ...p, weekdays: { ...p.weekdays, [day]: !p.weekdays[day] } }));

  const slots = previewSlots(form.tdStartTime, form.tdEndTime, form.tdSlotDuration, form.tdBufferTime);

  return (
    <div className="space-y-5 mt-2">
      {/* Basic Info */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Branch Details</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs">Branch Name</Label>
            <Input value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Patna Main Showroom" className="bg-secondary/50" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Branch Code</Label>
            <Input value={form.code} onChange={e => update("code", e.target.value.toUpperCase())} placeholder="PNA01" className="bg-secondary/50 uppercase" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">City</Label>
            <Input value={form.city} onChange={e => update("city", e.target.value)} placeholder="Patna" className="bg-secondary/50" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs">Address</Label>
            <Input value={form.address} onChange={e => update("address", e.target.value)} className="bg-secondary/50" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Phone</Label>
            <Input value={form.phone} onChange={e => update("phone", e.target.value)} className="bg-secondary/50" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Email</Label>
            <Input value={form.email} onChange={e => update("email", e.target.value)} className="bg-secondary/50" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs">Branch Manager</Label>
            <Input value={form.managerName} onChange={e => update("managerName", e.target.value)} className="bg-secondary/50" />
          </div>
        </div>
      </div>

      {/* Slot Config */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Slot Configuration</p>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Start Time</Label>
              <Input type="time" value={form.tdStartTime} onChange={e => update("tdStartTime", e.target.value)} className="bg-secondary/50" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">End Time</Label>
              <Input type="time" value={form.tdEndTime} onChange={e => update("tdEndTime", e.target.value)} className="bg-secondary/50" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Slot Duration: <span className="text-primary font-bold">{form.tdSlotDuration} minutes</span></Label>
              <span className="text-[10px] text-muted-foreground">30–60 min</span>
            </div>
            <Slider
              value={[form.tdSlotDuration]}
              onValueChange={([v]) => update("tdSlotDuration", v)}
              min={30} max={60} step={5}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              {[30, 35, 40, 45, 50, 55, 60].map(v => <span key={v}>{v}</span>)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Buffer Time: <span className="text-primary font-bold">{form.tdBufferTime} minutes</span></Label>
              <span className="text-[10px] text-muted-foreground">0–30 min</span>
            </div>
            <Slider
              value={[form.tdBufferTime]}
              onValueChange={([v]) => update("tdBufferTime", v)}
              min={0} max={30} step={5}
              className="w-full"
            />
          </div>

          {/* Preview count */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Generated slots per day</span>
            <span className="text-lg font-bold font-display text-primary">{slots.length} slots</span>
          </div>
        </div>
      </div>

      {/* Active Days */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Operating Days</p>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(form.weekdays).map(([day, active]) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${active ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary/30 text-muted-foreground border-border/30"}`}
            >
              {DAY_LABELS[day]}
            </button>
          ))}
        </div>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center gap-3">
        <Switch checked={form.active} onCheckedChange={v => update("active", v)} />
        <Label className="text-xs">{form.active ? "Branch Active" : "Branch Inactive"}</Label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form)} className="bg-primary text-primary-foreground flex-1">
          <Save className="w-4 h-4 mr-2" /> Save Configuration
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
      </div>
    </div>
  );
};

export default AdminTDSlotConfig;

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Car, Battery, Zap, Wrench, AlertTriangle, CheckCircle,
  Clock, MapPin, Gauge, TrendingUp, RefreshCw, ChevronRight, Activity
} from "lucide-react";

type VehicleStatus = "Available" | "Booked" | "Running" | "Charging" | "Under Repair" | "Battery Low";

interface DemoVehicle {
  id: string;
  vehicleId: string;
  model: "VF 6" | "VF 7";
  variant: string;
  color: string;
  registrationNumber: string;
  vinNumber: string;
  year: number;
  status: VehicleStatus;
  batteryPercentage: number;
  chargingStatus: "Not Charging" | "Charging" | "Full";
  currentOdometer: number;
  totalKmDriven: number;
  dailyKm: number;
  monthlyKm: number;
  totalTestDrives: number;
  totalChargingCycles: number;
  underRepair: boolean;
  replacementRecommended: boolean;
  depletionPct: number;
  branch: string;
  assignedExecutive?: string;
  estimatedAvailableAt?: string;
  lastServiceAt?: string;
}

const STATUS_CONFIG: Record<VehicleStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  Available: { label: "Available", color: "text-green-400", bg: "bg-green-400/15 border-green-400/30", icon: CheckCircle },
  Booked: { label: "Booked", color: "text-blue-400", bg: "bg-blue-400/15 border-blue-400/30", icon: Car },
  Running: { label: "Running", color: "text-orange-400", bg: "bg-orange-400/15 border-orange-400/30", icon: Activity },
  Charging: { label: "Charging", color: "text-purple-400", bg: "bg-purple-400/15 border-purple-400/30", icon: Zap },
  "Under Repair": { label: "Under Repair", color: "text-red-400", bg: "bg-red-400/15 border-red-400/30", icon: Wrench },
  "Battery Low": { label: "Battery Low", color: "text-yellow-400", bg: "bg-yellow-400/15 border-yellow-400/30", icon: AlertTriangle },
};

const MOCK_VEHICLES: DemoVehicle[] = [
  { id: "1", vehicleId: "VF7-1001", model: "VF 7", variant: "Plus", color: "Pearl White", registrationNumber: "BR01AX0001", vinNumber: "VF7IND2024001", year: 2024, status: "Available", batteryPercentage: 87, chargingStatus: "Not Charging", currentOdometer: 4210, totalKmDriven: 4210, dailyKm: 32, monthlyKm: 890, totalTestDrives: 67, totalChargingCycles: 42, underRepair: false, replacementRecommended: false, depletionPct: 5, branch: "Patna Main", lastServiceAt: "2025-12-01" },
  { id: "2", vehicleId: "VF7-1002", model: "VF 7", variant: "Plus", color: "Jet Black", registrationNumber: "BR01AX0002", vinNumber: "VF7IND2024002", year: 2024, status: "Booked", batteryPercentage: 72, chargingStatus: "Not Charging", currentOdometer: 6540, totalKmDriven: 6540, dailyKm: 45, monthlyKm: 1200, totalTestDrives: 102, totalChargingCycles: 65, underRepair: false, replacementRecommended: false, depletionPct: 8, branch: "Patna Main", assignedExecutive: "Rahul Kumar" },
  { id: "3", vehicleId: "VF6-2001", model: "VF 6", variant: "Eco", color: "Urban Mint", registrationNumber: "BR01BX0001", vinNumber: "VF6IND2024001", year: 2024, status: "Charging", batteryPercentage: 28, chargingStatus: "Charging", currentOdometer: 8900, totalKmDriven: 8900, dailyKm: 60, monthlyKm: 1650, totalTestDrives: 148, totalChargingCycles: 90, underRepair: false, replacementRecommended: false, depletionPct: 11, branch: "Patna Main", estimatedAvailableAt: "2:30 PM" },
  { id: "4", vehicleId: "VF7-1003", model: "VF 7", variant: "Plus", color: "Crimson Red", registrationNumber: "BR01AX0003", vinNumber: "VF7IND2024003", year: 2024, status: "Running", batteryPercentage: 61, chargingStatus: "Not Charging", currentOdometer: 3100, totalKmDriven: 3100, dailyKm: 28, monthlyKm: 720, totalTestDrives: 48, totalChargingCycles: 31, underRepair: false, replacementRecommended: false, depletionPct: 4, branch: "Patna Main", assignedExecutive: "Priya Singh" },
  { id: "5", vehicleId: "VF6-2002", model: "VF 6", variant: "Plus", color: "Zenith Grey", registrationNumber: "BR01BX0002", vinNumber: "VF6IND2024002", year: 2024, status: "Under Repair", batteryPercentage: 45, chargingStatus: "Not Charging", currentOdometer: 12400, totalKmDriven: 12400, dailyKm: 0, monthlyKm: 980, totalTestDrives: 215, totalChargingCycles: 112, underRepair: true, replacementRecommended: false, depletionPct: 16, branch: "Patna Main", estimatedAvailableAt: "Tomorrow 10 AM" },
  { id: "6", vehicleId: "VF7-1004", model: "VF 7", variant: "Eco", color: "Desat Silver", registrationNumber: "BR01AX0004", vinNumber: "VF7IND2024004", year: 2023, status: "Battery Low", batteryPercentage: 14, chargingStatus: "Not Charging", currentOdometer: 18200, totalKmDriven: 18200, dailyKm: 0, monthlyKm: 1100, totalTestDrives: 298, totalChargingCycles: 188, underRepair: false, replacementRecommended: false, depletionPct: 23, branch: "Patna Main" },
];

const StatusBadge = ({ status }: { status: VehicleStatus }) => {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color} ${cfg.bg}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
};

const BatteryBar = ({ pct }: { pct: number }) => {
  const color = pct <= 20 ? "bg-red-400" : pct <= 40 ? "bg-yellow-400" : pct <= 60 ? "bg-orange-400" : "bg-green-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground">{pct}%</span>
    </div>
  );
};

const STATUSES: VehicleStatus[] = ["Available", "Booked", "Running", "Charging", "Under Repair", "Battery Low"];

const AdminTDDemoVehicles = () => {
  const [vehicles, setVehicles] = useState<DemoVehicle[]>(MOCK_VEHICLES);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<DemoVehicle | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const statusCounts = STATUSES.reduce((acc, s) => {
    acc[s] = vehicles.filter(v => v.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  const filtered = vehicles.filter(v => {
    const matchFilter = filter === "all" || v.status === filter;
    const matchSearch = !search || v.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
      v.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const openDetail = (v: DemoVehicle) => { setSelected(v); setShowDetail(true); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Demo Vehicle Fleet</h1>
          <p className="text-muted-foreground text-sm">{vehicles.length} vehicles · {statusCounts["Available"] || 0} available</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add Vehicle
        </Button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {STATUSES.map(s => {
          const cfg = STATUS_CONFIG[s];
          const Icon = cfg.icon;
          return (
            <button
              key={s}
              onClick={() => setFilter(filter === s ? "all" : s)}
              className={`p-3 rounded-xl border text-center transition-all ${filter === s ? cfg.bg + " border-current" : "bg-card border-border/40 hover:border-border"}`}
            >
              <Icon className={`w-4 h-4 mx-auto mb-1 ${cfg.color}`} />
              <p className={`text-lg font-bold ${cfg.color}`}>{statusCounts[s] || 0}</p>
              <p className="text-[9px] text-muted-foreground leading-tight">{s}</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <Input
          placeholder="Search by Vehicle ID, Reg. No., Model..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-secondary/50 max-w-sm"
        />
        {filter !== "all" && (
          <Button variant="outline" size="sm" onClick={() => setFilter("all")}>
            Clear Filter
          </Button>
        )}
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(vehicle => {
          const cfg = STATUS_CONFIG[vehicle.status];
          return (
            <Card
              key={vehicle.id}
              className={`bg-card border overflow-hidden hover:shadow-lg transition-all cursor-pointer ${vehicle.replacementRecommended ? "border-yellow-400/40" : "border-border/40"}`}
              onClick={() => openDetail(vehicle)}
            >
              {/* Card Header */}
              <div className={`px-4 py-3 border-b border-border/30 flex items-center justify-between ${cfg.bg}`}>
                <div>
                  <p className="font-display font-bold text-foreground text-sm">{vehicle.vehicleId}</p>
                  <p className="text-xs text-muted-foreground">{vehicle.model} {vehicle.variant} · {vehicle.color}</p>
                </div>
                <StatusBadge status={vehicle.status} />
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {vehicle.branch}</span>
                  <span className="text-muted-foreground">{vehicle.registrationNumber}</span>
                </div>

                {/* Battery */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Battery className="w-3 h-3" /> Battery</span>
                    {vehicle.status === "Charging" && (
                      <span className="text-[10px] text-purple-400 flex items-center gap-0.5"><Zap className="w-2.5 h-2.5" /> Charging{vehicle.estimatedAvailableAt ? ` · ETA ${vehicle.estimatedAvailableAt}` : ""}</span>
                    )}
                  </div>
                  <BatteryBar pct={vehicle.batteryPercentage} />
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-foreground">{vehicle.currentOdometer.toLocaleString()}</p>
                    <p className="text-[9px] text-muted-foreground">Odometer KM</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-foreground">{vehicle.totalTestDrives}</p>
                    <p className="text-[9px] text-muted-foreground">Total TDs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-foreground">{vehicle.depletionPct}%</p>
                    <p className="text-[9px] text-muted-foreground">Depletion</p>
                  </div>
                </div>

                {/* Depletion Bar */}
                <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${vehicle.depletionPct >= 75 ? "bg-red-400" : vehicle.depletionPct >= 50 ? "bg-yellow-400" : "bg-green-400"}`}
                    style={{ width: `${vehicle.depletionPct}%` }}
                  />
                </div>

                {/* Footer flags */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-2">
                    {vehicle.replacementRecommended && (
                      <span className="text-[9px] bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-1.5 py-0.5 rounded font-medium">REPLACEMENT DUE</span>
                    )}
                    {vehicle.assignedExecutive && (
                      <span className="text-[9px] text-muted-foreground">{vehicle.assignedExecutive}</span>
                    )}
                    {vehicle.status === "Under Repair" && vehicle.estimatedAvailableAt && (
                      <span className="text-[9px] text-red-400">ETA: {vehicle.estimatedAvailableAt}</span>
                    )}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Car className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No vehicles match the current filter</p>
        </div>
      )}

      {/* Vehicle Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" />
              {selected?.vehicleId} — {selected?.model} {selected?.variant}
            </DialogTitle>
          </DialogHeader>
          {selected && <VehicleDetailPanel vehicle={selected} onClose={() => setShowDetail(false)} />}
        </DialogContent>
      </Dialog>

      {/* Add Vehicle Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Add Demo Vehicle</DialogTitle>
          </DialogHeader>
          <AddVehicleForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const VehicleDetailPanel = ({ vehicle, onClose }: { vehicle: DemoVehicle; onClose: () => void }) => {
  const cfg = STATUS_CONFIG[vehicle.status];
  return (
    <Tabs defaultValue="overview" className="mt-2">
      <TabsList className="bg-secondary/50 w-full">
        <TabsTrigger value="overview" className="flex-1 text-xs">Overview</TabsTrigger>
        <TabsTrigger value="utilization" className="flex-1 text-xs">Utilization</TabsTrigger>
        <TabsTrigger value="actions" className="flex-1 text-xs">Actions</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Registration", vehicle.registrationNumber],
            ["VIN", vehicle.vinNumber],
            ["Model", `${vehicle.model} ${vehicle.variant}`],
            ["Color", vehicle.color],
            ["Year", vehicle.year],
            ["Branch", vehicle.branch],
          ].map(([k, v]) => (
            <div key={k} className="bg-secondary/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground">{k}</p>
              <p className="text-sm font-medium text-foreground">{v}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/30 rounded-lg p-3">
            <p className="text-[10px] text-muted-foreground mb-2 flex items-center gap-1"><Battery className="w-3 h-3" /> Battery Level</p>
            <BatteryBar pct={vehicle.batteryPercentage} />
          </div>
          <div className="bg-secondary/30 rounded-lg p-3">
            <p className="text-[10px] text-muted-foreground">Status</p>
            <div className="mt-1"><StatusBadge status={vehicle.status} /></div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="utilization" className="mt-4 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            ["Odometer", `${vehicle.currentOdometer.toLocaleString()} km`, Gauge],
            ["Total KM", `${vehicle.totalKmDriven.toLocaleString()} km`, TrendingUp],
            ["Daily KM", `${vehicle.dailyKm} km`, Activity],
            ["Monthly KM", `${vehicle.monthlyKm.toLocaleString()} km`, Activity],
            ["Total TDs", vehicle.totalTestDrives, Car],
            ["Charge Cycles", vehicle.totalChargingCycles, RefreshCw],
          ].map(([label, val, Icon]) => (
            <div key={label as string} className="bg-secondary/30 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-foreground">{val}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{label as string}</p>
            </div>
          ))}
        </div>

        <div className="bg-secondary/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium">Fleet Depletion</p>
            <p className="text-xs font-bold text-foreground">{vehicle.depletionPct}%</p>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${vehicle.depletionPct >= 75 ? "bg-red-400" : vehicle.depletionPct >= 50 ? "bg-yellow-400" : "bg-green-400"}`}
              style={{ width: `${vehicle.depletionPct}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">{vehicle.totalKmDriven.toLocaleString()} / {(80000).toLocaleString()} km threshold</p>
        </div>

        {vehicle.replacementRecommended && (
          <div className="flex items-center gap-2 p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
            <p className="text-xs text-yellow-300">Replacement recommended — vehicle has exceeded utilization threshold</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="actions" className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="border-purple-400/30 text-purple-400 hover:bg-purple-400/10">
            <Zap className="w-4 h-4 mr-2" /> Start Charging
          </Button>
          <Button variant="outline" className="border-red-400/30 text-red-400 hover:bg-red-400/10">
            <Wrench className="w-4 h-4 mr-2" /> Log Repair
          </Button>
          <Button variant="outline" className="border-green-400/30 text-green-400 hover:bg-green-400/10">
            <CheckCircle className="w-4 h-4 mr-2" /> Mark Available
          </Button>
          <Button variant="outline" className="border-border text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" /> View History
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center pt-2">
          Connect backend API to enable real-time status updates
        </p>
      </TabsContent>
    </Tabs>
  );
};

const AddVehicleForm = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState({ model: "VF 7", variant: "", color: "", registrationNumber: "", vinNumber: "", year: new Date().getFullYear() });
  const update = (k: string, v: string | number) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Model</Label>
          <Select value={form.model} onValueChange={v => update("model", v)}>
            <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="VF 6">VF 6</SelectItem><SelectItem value="VF 7">VF 7</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Variant</Label>
          <Input value={form.variant} onChange={e => update("variant", e.target.value)} placeholder="e.g. Plus, Eco" className="bg-secondary/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Color</Label>
          <Input value={form.color} onChange={e => update("color", e.target.value)} placeholder="e.g. Pearl White" className="bg-secondary/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Year</Label>
          <Input type="number" value={form.year} onChange={e => update("year", Number(e.target.value))} className="bg-secondary/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Registration Number</Label>
          <Input value={form.registrationNumber} onChange={e => update("registrationNumber", e.target.value)} placeholder="BR01AX0001" className="bg-secondary/50 uppercase" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">VIN Number</Label>
          <Input value={form.vinNumber} onChange={e => update("vinNumber", e.target.value)} placeholder="VIN..." className="bg-secondary/50 uppercase" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button className="bg-primary text-primary-foreground flex-1">Add Vehicle</Button>
        <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
      </div>
    </div>
  );
};

export default AdminTDDemoVehicles;

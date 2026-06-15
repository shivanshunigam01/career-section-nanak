import { useCallback, useEffect, useState } from "react";
import { adminGet, adminPatchJson, adminPostJson, adminPutJson, formatApiErrors } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Users, Search, RefreshCw, Loader2, Plus, Edit2, UserCircle2
} from "lucide-react";
import { toast } from "sonner";
import {
  DESIGNATION_LABELS,
  STAFF_DESIGNATIONS,
  designationLabel,
  type StaffDesignation
} from "@/lib/staffRoles";

type StaffUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  designation: StaffDesignation;
  designationLabel?: string;
  active: boolean;
  createdAt?: string;
};

const emptyForm = {
  name: "",
  email: "",
  password: "",
  designation: "sales_executive" as StaffDesignation,
  active: true,
};

const DESIGNATION_COLORS: Record<StaffDesignation, string> = {
  sales_executive: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  sales_manager: "bg-indigo-400/10 text-indigo-400 border-indigo-400/20",
  branch_manager: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  gm: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  ceo: "bg-rose-400/10 text-rose-400 border-rose-400/20",
  md: "bg-amber-400/10 text-amber-400 border-amber-400/20",
};

export default function AdminTDUsers() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<typeof emptyForm & { _id?: string }>(emptyForm);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: "100" });
      if (filterDesignation !== "all") params.set("designation", filterDesignation);
      const { data } = await adminGet<StaffUser[]>(`/admin/td/users?${params}`);
      setUsers(data ?? []);
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setLoading(false);
    }
  }, [filterDesignation]);

  useEffect(() => { void fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
  });

  const openCreate = () => {
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (user: StaffUser) => {
    setForm({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: "",
      designation: user.designation,
      active: user.active,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    if (!form._id && (!form.password || form.password.length < 8)) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setActionLoading(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        email: form.email.trim(),
        designation: form.designation,
        active: form.active,
      };
      if (form.password) payload.password = form.password;

      if (form._id) {
        await adminPutJson(`/admin/td/users/${form._id}`, payload);
        toast.success("User updated");
      } else {
        await adminPostJson("/admin/td/users", payload);
        toast.success("User created");
      }
      setShowForm(false);
      void fetchUsers();
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setActionLoading(false);
    }
  };

  const toggleActive = async (user: StaffUser) => {
    setActionLoading(true);
    try {
      await adminPatchJson(`/admin/td/users/${user._id}`, { active: !user.active });
      toast.success(user.active ? "User deactivated" : "User activated");
      void fetchUsers();
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" /> User Master
          </h1>
          <p className="text-muted-foreground text-sm">
            Sales hierarchy — Executive → Manager → Branch Manager → GM → CEO → MD
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => void fetchUsers()} variant="outline" size="sm"><RefreshCw className="w-4 h-4" /></Button>
          <Button onClick={openCreate} size="sm" className="bg-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" /> Add User
          </Button>
        </div>
      </div>

      <Card className="p-4 border-primary/20 bg-primary/5 text-sm">
        <p className="font-medium text-foreground mb-1">Staff login</p>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Every user signs in at <span className="font-mono text-foreground">/admin/login</span> with their email and password.
          Assigned test drives appear under <strong className="text-foreground">My Test Drives</strong>.
          Sales Executives land on that page automatically; managers and above also see full TD Management.
        </p>
      </Card>

      <Card className="p-4 border-border/50 bg-card/50">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary/30"
            />
          </div>
          <Select value={filterDesignation} onValueChange={setFilterDesignation}>
            <SelectTrigger className="w-full sm:w-52 bg-secondary/30"><SelectValue placeholder="All roles" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {STAFF_DESIGNATIONS.map((d) => (
                <SelectItem key={d} value={d}>{DESIGNATION_LABELS[d]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground border-dashed">
          <UserCircle2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No users found. Add staff or run the TD seed script.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((user) => (
            <Card key={user._id} className="p-4 border-border/50 bg-card/50">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                    {user.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{user.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Badge variant="outline" className={DESIGNATION_COLORS[user.designation]}>
                    {user.designationLabel || designationLabel(user.designation)}
                  </Badge>
                  <Badge variant="outline" className={user.active ? "border-green-400/30 text-green-400" : "border-red-400/30 text-red-400"}>
                    {user.active ? "Active" : "Inactive"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => openEdit(user)}>
                    <Edit2 className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={actionLoading}
                    onClick={() => void toggleActive(user)}
                  >
                    {user.active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{form._id ? "Edit user" : "Add user"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{form._id ? "New password (optional)" : "Password"}</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={form._id ? "Leave blank to keep current" : "Min 8 characters"}
              />
            </div>
            <div className="space-y-2">
              <Label>Role / designation</Label>
              <Select value={form.designation} onValueChange={(v) => setForm({ ...form, designation: v as StaffDesignation })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STAFF_DESIGNATIONS.map((d) => (
                    <SelectItem key={d} value={d}>{DESIGNATION_LABELS[d]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
              <Label htmlFor="active-user">Active</Label>
              <Switch id="active-user" checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
            </div>
            <Button className="w-full" disabled={actionLoading} onClick={() => void handleSave()}>
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {form._id ? "Save changes" : "Create user"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

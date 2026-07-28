import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Edit2, Trash2, ShieldCheck, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { formatApiErrors } from "@/lib/api";
import {
  MODULE_GROUPS,
  modulesForGroup,
  actionToken,
  ACTION_LABELS,
  allActionTokensForModules,
  type AdminModuleKey,
  type AdminModuleAction,
} from "@/lib/adminModules";
import {
  createStaffRole,
  deleteStaffRole,
  fetchStaffRoles,
  updateStaffRole,
  type StaffRoleRecord,
} from "@/lib/staffRolesApi";

const emptyRoleForm = {
  name: "",
  description: "",
  authRole: "executive" as "executive" | "manager",
  allowedModules: [] as AdminModuleKey[],
  allowedActions: [] as string[],
  active: true,
};

type Props = {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

export function StaffRolesPanel({ canCreate, canUpdate, canDelete }: Props) {
  const [roles, setRoles] = useState<StaffRoleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<typeof emptyRoleForm & { _id?: string }>(emptyRoleForm);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StaffRoleRecord | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setRoles(await fetchStaffRoles());
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setForm(emptyRoleForm);
    setShowForm(true);
  };

  const openEdit = (role: StaffRoleRecord) => {
    setForm({
      _id: role._id,
      name: role.name,
      description: role.description || "",
      authRole: role.authRole === "manager" ? "manager" : "executive",
      allowedModules: (role.allowedModules || []) as AdminModuleKey[],
      allowedActions: role.allowedActions || [],
      active: role.active,
    });
    setShowForm(true);
  };

  const toggleModule = (key: AdminModuleKey, checked: boolean) => {
    setForm((f) => {
      if (checked) {
        const modules = [...new Set([...f.allowedModules, key])];
        const moduleTokens = allActionTokensForModules([key]);
        const actions = [...new Set([...f.allowedActions, ...moduleTokens])];
        return { ...f, allowedModules: modules, allowedActions: actions };
      }
      return {
        ...f,
        allowedModules: f.allowedModules.filter((m) => m !== key),
        allowedActions: f.allowedActions.filter((a) => !a.startsWith(`${key}:`)),
      };
    });
  };

  const toggleAction = (key: AdminModuleKey, action: AdminModuleAction, checked: boolean) => {
    const token = actionToken(key, action);
    setForm((f) => {
      if (checked) {
        const modules = f.allowedModules.includes(key) ? f.allowedModules : [...f.allowedModules, key];
        let actions = [...new Set([...f.allowedActions, token])];
        const viewToken = actionToken(key, "view");
        if (!actions.includes(viewToken)) actions = [...actions, viewToken];
        return { ...f, allowedModules: modules, allowedActions: actions };
      }
      if (action === "view") {
        return {
          ...f,
          allowedModules: f.allowedModules.filter((m) => m !== key),
          allowedActions: f.allowedActions.filter((a) => !a.startsWith(`${key}:`)),
        };
      }
      return { ...f, allowedActions: f.allowedActions.filter((a) => a !== token) };
    });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Role name is required");
      return;
    }
    setActionLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        authRole: form.authRole,
        allowedModules: form.allowedModules,
        allowedActions: form.allowedModules.length ? form.allowedActions : [],
        active: form.active,
      };
      if (form._id) {
        await updateStaffRole(form._id, payload);
        toast.success("Role updated");
      } else {
        await createStaffRole(payload);
        toast.success("Role created");
      }
      setShowForm(false);
      void load();
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await deleteStaffRole(deleteTarget._id);
      toast.success(`Role “${deleteTarget.name}” deleted`);
      setDeleteTarget(null);
      void load();
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Create permission templates. Assigning a role to an employee applies these modules and actions automatically.
        </p>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => void load()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          {canCreate ? (
            <Button size="sm" className="bg-primary text-primary-foreground" onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" /> Add Role
            </Button>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : roles.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground border-dashed">
          No roles yet. Create a role template to reuse permissions.
        </Card>
      ) : (
        <div className="grid gap-3">
          {roles.map((role) => (
            <Card key={role._id} className="p-4 border-border/50 bg-card/50">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                    {role.name}
                  </p>
                  {role.description ? (
                    <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{role.authRole}</Badge>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    {(role.allowedModules || []).length} modules
                  </Badge>
                  <Badge
                    variant="outline"
                    className={role.active ? "border-green-400/30 text-green-400" : "border-red-400/30 text-red-400"}
                  >
                    {role.active ? "Active" : "Inactive"}
                  </Badge>
                  {canUpdate ? (
                    <Button variant="outline" size="sm" onClick={() => openEdit(role)}>
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  ) : null}
                  {canDelete ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(role)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form._id ? "Edit role" : "Create role"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Role name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label>Access level</Label>
              <Select
                value={form.authRole}
                onValueChange={(v) =>
                  setForm({ ...form, authRole: v === "manager" ? "manager" : "executive" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">Executive</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="rounded-md border border-border/60 bg-secondary/20 p-3 space-y-3 max-h-64 overflow-y-auto">
                {MODULE_GROUPS.map((group) => (
                  <div key={group}>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                      {group}
                    </p>
                    <div className="space-y-2">
                      {modulesForGroup(group).map((mod) => {
                        const on = form.allowedModules.includes(mod.key);
                        return (
                          <div key={mod.key} className="space-y-1">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                              <Checkbox
                                checked={on}
                                onCheckedChange={(c) => toggleModule(mod.key, Boolean(c))}
                              />
                              <span>{mod.label}</span>
                            </label>
                            {on ? (
                              <div className="flex flex-wrap gap-x-3 gap-y-1 pl-6">
                                {mod.actions.map((action) => {
                                  const token = actionToken(mod.key, action);
                                  return (
                                    <label
                                      key={token}
                                      className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer"
                                    >
                                      <Checkbox
                                        checked={form.allowedActions.includes(token)}
                                        onCheckedChange={(c) =>
                                          toggleAction(mod.key, action, Boolean(c))
                                        }
                                      />
                                      {ACTION_LABELS[action] || action}
                                    </label>
                                  );
                                })}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button className="flex-1" disabled={actionLoading} onClick={() => void handleSave()}>
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save role
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete role?</AlertDialogTitle>
            <AlertDialogDescription>
              Delete “{deleteTarget?.name}”? Users still assigned to this role must be reassigned first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={actionLoading}
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

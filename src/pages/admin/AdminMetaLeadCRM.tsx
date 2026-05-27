import { useCallback, useEffect, useMemo, useState } from "react";
import { LEAD_STATUSES } from "@/data/mockData";
import { hasApi } from "@/lib/apiConfig";
import { adminPutJson, formatApiErrors } from "@/lib/api";
import { formatLeadSubmittedAt } from "@/lib/apiMappers";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Edit2, Phone, Mail, Download } from "lucide-react";
import { fetchMetaLeadsPayload, mapMetaLeadRow, metaLeadsRows, type MetaLeadRow } from "@/lib/metaLeadsApi";

const AdminMetaLeadCRM = () => {
  const useRemote = hasApi();
  const [hydrated, setHydrated] = useState(false);
  const [leads, setLeads] = useState<MetaLeadRow[]>([]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterModel, setFilterModel] = useState<string>("all");

  const [savingId, setSavingId] = useState<string | null>(null);
  const [editLead, setEditLead] = useState<MetaLeadRow | null>(null);
  const [showEdit, setShowEdit] = useState(false);

  const refreshFromApi = useCallback(async () => {
    const payload = await fetchMetaLeadsPayload();
    const mapped = metaLeadsRows(payload).map((d) => mapMetaLeadRow(d));
    setLeads(mapped);
  }, []);

  useEffect(() => {
    if (!useRemote) {
      setHydrated(true);
      return;
    }
    (async () => {
      try {
        await refreshFromApi();
      } catch (e) {
        toast.error(formatApiErrors(e));
      } finally {
        setHydrated(true);
      }
    })();
  }, [useRemote, refreshFromApi]);

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.mobile.includes(search) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    const matchModel = filterModel === "all" || l.model === filterModel || l.interestedModel === filterModel;
    return matchSearch && matchStatus && matchModel;
  });

  const models = useMemo(() => {
    const set = new Set<string>();
    for (const l of leads) set.add(l.model === "—" ? l.interestedModel : l.model);
    return Array.from(set).sort();
  }, [leads]);

  const updateStatus = async (lead: MetaLeadRow, status: string) => {
    if (!useRemote) return;
    if (!lead.leadId || lead.leadId === "—") {
      toast.error("Lead is not linked in CRM yet.");
      return;
    }
    setSavingId(lead.id);
    try {
      await adminPutJson(`/admin/leads/${lead.leadId}`, { status });
      toast.success("Lead status updated");
      await refreshFromApi();
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setSavingId(null);
    }
  };

  const saveMetaLead = async (next: MetaLeadRow) => {
    if (!useRemote) return;
    setSavingId(next.id);
    try {
      await adminPutJson(`/admin/meta-leads/${next.id}`, {
        name: next.name,
        mobile: next.mobile,
        whatsappNumber: next.whatsappNumber,
        email: next.email,
        state: next.state,
        pin: next.pin,
        interestedModel: next.interestedModel,
        existingVehicle: next.existingVehicle,
        status: next.status,
        nextFollowUp: next.nextFollowUp === "—" ? null : next.nextFollowUp,
        remarks: next.remarks,
        financeNeeded: next.financeNeeded,
        exchangeNeeded: next.exchangeNeeded,
      });
      toast.success("Meta lead updated");
      setShowEdit(false);
      setEditLead(null);
      await refreshFromApi();
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Meta Leads</h1>
          <p className="text-muted-foreground text-sm">
            {useRemote ? `Showing ${filtered.length} Meta leads` : `${filtered.length} total Meta leads`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Button
            onClick={() => void refreshFromApi()}
            variant="outline"
            className="bg-secondary/50"
            disabled={!hydrated || !useRemote}
          >
            <Download className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, mobile, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary/50"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48 bg-secondary/50">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {LEAD_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterModel} onValueChange={setFilterModel}>
          <SelectTrigger className="w-full sm:w-48 bg-secondary/50">
            <SelectValue placeholder="Filter by model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Models</SelectItem>
            {models.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-card border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/30">
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Name</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium hidden sm:table-cell">
                  Contact
                </th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">State</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">PIN</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Interested Model</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium hidden md:table-cell">Existing Vehicle</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium hidden md:table-cell">Email</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Status</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium hidden md:table-cell whitespace-nowrap">
                  Submitted
                </th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium hidden lg:table-cell">
                  Follow-up
                </th>
                <th className="text-right p-3 text-xs text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-muted-foreground">
                    No Meta leads found
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-border/20 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="p-3">
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">{lead.mobile}</p>
                      <p className="text-[10px] text-muted-foreground md:hidden mt-0.5 whitespace-nowrap">
                        {formatLeadSubmittedAt(lead.createdAt)}
                      </p>
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${lead.mobile}`}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                        <span className="text-xs text-muted-foreground">{lead.mobile}</span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{lead.state}</td>
                    <td className="p-3 text-muted-foreground">{lead.pin}</td>
                    <td className="p-3 text-foreground">{lead.interestedModel}</td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{lead.existingVehicle}</td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{lead.email}</td>
                    <td className="p-3">
                      <Select
                        value={lead.status}
                        onValueChange={(v) => void updateStatus(lead, v)}
                        disabled={savingId === lead.id}
                      >
                        <SelectTrigger className="h-7 w-40 bg-secondary/50 text-[11px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LEAD_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground text-xs whitespace-nowrap">
                      {formatLeadSubmittedAt(lead.createdAt)}
                    </td>
                    <td className="p-3 hidden lg:table-cell text-muted-foreground text-xs">
                      {lead.nextFollowUp || "—"}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditLead(lead);
                            setShowEdit(true);
                          }}
                          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
                          disabled={savingId === lead.id}
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog
        open={showEdit}
        onOpenChange={(open) => {
          setShowEdit(open);
          if (!open) setEditLead(null);
        }}
      >
        <DialogContent className="bg-card border-border max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Meta Lead</DialogTitle>
          </DialogHeader>
          {editLead && <MetaLeadForm lead={editLead} onSave={(l) => void saveMetaLead(l)} onCancel={() => setShowEdit(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const MetaLeadForm = ({
  lead,
  onSave,
  onCancel,
}: {
  lead: MetaLeadRow;
  onSave: (next: MetaLeadRow) => void | Promise<void>;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState<MetaLeadRow>(lead);
  const update = (key: keyof MetaLeadRow, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value as never }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Name</Label>
          <Input value={form.name} onChange={(e) => update("name", e.target.value)} className="bg-secondary/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Mobile</Label>
          <Input value={form.mobile} onChange={(e) => update("mobile", e.target.value)} className="bg-secondary/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">WhatsApp Number</Label>
          <Input
            value={form.whatsappNumber}
            onChange={(e) => update("whatsappNumber", e.target.value)}
            className="bg-secondary/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Email</Label>
          <Input value={form.email} onChange={(e) => update("email", e.target.value)} className="bg-secondary/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">State</Label>
          <Input value={form.state} onChange={(e) => update("state", e.target.value)} className="bg-secondary/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">PIN</Label>
          <Input value={form.pin} onChange={(e) => update("pin", e.target.value)} className="bg-secondary/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Interested Model</Label>
          <Input
            value={form.interestedModel}
            onChange={(e) => update("interestedModel", e.target.value)}
            className="bg-secondary/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Existing Vehicle</Label>
          <Input
            value={form.existingVehicle}
            onChange={(e) => update("existingVehicle", e.target.value)}
            className="bg-secondary/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Status</Label>
          <Select value={form.status} onValueChange={(v) => update("status", v)}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Next Follow-up</Label>
          <Input
            type="date"
            value={form.nextFollowUp === "—" ? "" : form.nextFollowUp}
            onChange={(e) => update("nextFollowUp", e.target.value)}
            className="bg-secondary/50"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Remarks</Label>
        <Textarea value={form.remarks} onChange={(e) => update("remarks", e.target.value)} className="bg-secondary/50" rows={2} />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={form.financeNeeded}
            onChange={(e) => update("financeNeeded", e.target.checked)}
            className="rounded"
          />
          Finance Needed
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={form.exchangeNeeded}
            onChange={(e) => update("exchangeNeeded", e.target.checked)}
            className="rounded"
          />
          Exchange Needed
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form)} className="bg-primary text-primary-foreground flex-1">
          Save
        </Button>
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AdminMetaLeadCRM;


import { useCallback, useEffect, useMemo, useState } from "react";
import { mockLeads, LEAD_STATUSES, type Lead, type LeadStatus } from "@/data/mockData";
import { hasApi } from "@/lib/apiConfig";
import { adminDeleteJson, adminPostJson, adminPutJson, formatApiErrors, publicGet } from "@/lib/api";
import { formatLeadSubmittedAt, leadFromApi, leadToApiPayload } from "@/lib/apiMappers";
import { fetchLeadsPage } from "@/lib/adminFetchAll";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Edit2, Trash2, Phone, Mail, Download } from "lucide-react";
import { parseStoredModelLine, leadModelLabel } from "@/data/vinfastModels";
import { ModelTrimSelect } from "@/components/ModelTrimSelect";

const CRM_LEAD_SOURCES = ["Website", "Google Ads", "Meta Ads", "WhatsApp", "Walk-in", "Referral"] as const;

const AdminMetaLeadCRM = () => {
  const useRemote = hasApi();
  const [hydrated, setHydrated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(() => (useRemote ? [] : mockLeads.filter((l) => l.source === "Meta Ads")));

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterModel, setFilterModel] = useState<string>("all");

  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyLead: Lead = {
    id: "",
    name: "",
    mobile: "",
    email: "",
    city: "",
    otherCity: "",
    model: "VF 7",
    source: "Meta Ads",
    status: "New Lead",
    assignedTo: "",
    createdAt: new Date().toISOString().split("T")[0],
    nextFollowUp: "",
    remarks: "",
    financeNeeded: false,
    exchangeNeeded: false,
  };

  const refreshFromApi = useCallback(async () => {
    const { rows } = await fetchLeadsPage((d) => leadFromApi(d), {
      limit: 500,
      page: 1,
      source: "Meta Ads",
    });
    setLeads(rows);
  }, []);

  useEffect(() => {
    if (!useRemote) {
      setHydrated(true);
      return;
    }
    (async () => {
      try {
        // Triggers backend disk-to-Mongo backfill for older webhook payloads (no UI usage).
        await publicGet<unknown>("/public/All_leads");
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
    const matchModel = filterModel === "all" || l.model === filterModel;
    return matchSearch && matchStatus && matchModel;
  });

  const models = useMemo(() => {
    const set = new Set<string>();
    for (const l of leads) set.add(l.model);
    return Array.from(set).sort();
  }, [leads]);

  const handleSave = async (lead: Lead) => {
    if (!useRemote) return;
    try {
      const payload = leadToApiPayload(lead);
      if (lead.id) {
        await adminPutJson(`/admin/leads/${lead.id}`, payload);
      } else {
        await adminPostJson("/admin/leads", payload);
      }
      toast.success("Lead saved");
      setShowForm(false);
      setEditLead(null);
      await refreshFromApi();
    } catch (e) {
      toast.error(formatApiErrors(e));
    }
  };

  const handleDelete = async (id: string) => {
    if (!useRemote) return;
    try {
      await adminDeleteJson(`/admin/leads/${id}`);
      toast.success("Lead deleted");
      await refreshFromApi();
    } catch (e) {
      toast.error(formatApiErrors(e));
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
          {/* Intentionally no "Add Lead" here; Meta leads should come from provider webhook. */}
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
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Model</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium hidden md:table-cell">
                  Source
                </th>
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
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
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
                    <td className="p-3 text-foreground">{lead.model}</td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{lead.source}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                          lead.status === "New Lead"
                            ? "bg-blue-400/10 text-blue-400"
                            : lead.status === "Interested"
                              ? "bg-green-400/10 text-green-400"
                              : lead.status === "Booked"
                                ? "bg-primary/10 text-primary"
                                : lead.status === "Lost"
                                  ? "bg-destructive/10 text-destructive"
                                  : lead.status === "Negotiation"
                                    ? "bg-amber-400/10 text-amber-400"
                                    : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {lead.status}
                      </span>
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
                            setShowForm(true);
                          }}
                          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => void handleDelete(lead.id)}
                          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Lead Form Dialog */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditLead(null);
        }}
      >
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editLead?.id ? "Edit Lead" : "Add Lead"}</DialogTitle>
          </DialogHeader>
          {editLead && (
            <LeadForm lead={editLead} onSave={(l) => void handleSave(l)} onCancel={() => { setShowForm(false); setEditLead(null); }} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const LeadForm = ({
  lead,
  onSave,
  onCancel,
}: {
  lead: Lead;
  onSave: (l: Lead) => void | Promise<void>;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState(lead);
  const update = (key: keyof Lead, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const sourceChoices: string[] = [...CRM_LEAD_SOURCES];
  if (form.source && !sourceChoices.includes(form.source)) sourceChoices.push(form.source);

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
          <Label className="text-xs">Email</Label>
          <Input value={form.email} onChange={(e) => update("email", e.target.value)} className="bg-secondary/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">City</Label>
          <Input value={form.city} onChange={(e) => update("city", e.target.value)} className="bg-secondary/50" />
        </div>

        <div className="space-y-1.5 col-span-2">
          <Label className="text-xs">Model &amp; trim</Label>
          {(() => {
            const { model: tm, variant: tv } = parseStoredModelLine(form.model);
            return (
              <ModelTrimSelect
                model={tm}
                variant={tv}
                onChange={(m, v) => update("model", leadModelLabel(m, v))}
                includeNotSureBoth
                className="h-10 w-full px-3 rounded-lg bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            );
          })()}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Source</Label>
          <Select value={form.source || "Meta Ads"} onValueChange={(v) => update("source", v)}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              {sourceChoices.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Status</Label>
          <Select value={form.status} onValueChange={(v) => update("status", v as LeadStatus)}>
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

        <div className="space-y-1.5 col-span-2">
          <Label className="text-xs">Next Follow-up</Label>
          <Input type="date" value={form.nextFollowUp} onChange={(e) => update("nextFollowUp", e.target.value)} className="bg-secondary/50" />
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


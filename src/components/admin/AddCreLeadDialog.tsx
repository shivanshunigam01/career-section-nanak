import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BiharDistrictField } from "@/components/BiharDistrictField";
import { ModelTrimSelect } from "@/components/ModelTrimSelect";
import { BIHAR_DEFAULT_DISTRICT } from "@/data/biharDistricts";
import { DEFAULT_VF7_TRIM, leadModelLabel } from "@/data/vinfastModels";
import { formatApiErrors } from "@/lib/api";
import {
  createPvCrmLead,
  type AssignableStaffUser,
  type CreatePvCrmLeadPayload,
  type PvCrmLead,
} from "@/lib/pvLeadCrmApi";
import { lookupCrmCustomerByMobile, type CustomerHistory } from "@/lib/crmCustomerApi";
import { CustomerHistoryDialog } from "@/components/admin/CustomerHistoryDialog";
import {
  CRE_LEAD_TYPE_OPTIONS,
  CRE_SOURCE_OPTIONS,
  normalizeCreLeadType,
} from "@/lib/creLeadImport";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (lead: PvCrmLead) => void;
  executives?: AssignableStaffUser[];
};

const emptyForm = () => ({
  enquiryDate: new Date().toISOString().slice(0, 10),
  source: "Walk-in",
  name: "",
  mobile: "",
  email: "",
  city: BIHAR_DEFAULT_DISTRICT,
  otherCity: "",
  area: "",
  address: "",
  existingVariant: "",
  model: "VF 7",
  variant: DEFAULT_VF7_TRIM,
  callDate: new Date().toISOString().slice(0, 10),
  initialRemark: "",
  leadType: "HOT (within 30 days)" as string,
  executiveId: "",
  salesPersonRemark: "",
  exchangeNeeded: false,
});

/**
 * CRE add-lead form — mirrors the dealership "Current Format" Excel columns
 * for intake + assignment to a sales consultant.
 */
export function AddCreLeadDialog({
  open,
  onOpenChange,
  onCreated,
  executives = [],
}: Props) {
  const [form, setForm] = useState(() => emptyForm());
  const [saving, setSaving] = useState(false);
  const staffUsers = Array.isArray(executives) ? executives : [];
  const [existingHistory, setExistingHistory] = useState<CustomerHistory | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const lookedUpMobileRef = useRef("");

  useEffect(() => {
    if (!open) return;
    setForm(emptyForm());
    setExistingHistory(null);
    setShowHistory(false);
    lookedUpMobileRef.current = "";
  }, [open]);

  useEffect(() => {
    const mobile = form.mobile.trim();
    if (!open || !/^[6-9]\d{9}$/.test(mobile) || lookedUpMobileRef.current === mobile) return;
    lookedUpMobileRef.current = mobile;
    lookupCrmCustomerByMobile(mobile)
      .then((res) => {
        if (res.existingCustomer) {
          setExistingHistory(res);
          setShowHistory(true);
          setForm((f) => ({
            ...f,
            name: f.name.trim() || res.customer.name,
            email: f.email.trim() || res.customer.email || "",
          }));
        } else {
          setExistingHistory(null);
        }
      })
      .catch(() => setExistingHistory(null));
  }, [open, form.mobile]);

  const handleSave = async () => {
    if (!form.name.trim() || form.name.trim().length < 2) {
      toast.error("Enter customer name");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    if (!form.city.trim()) {
      toast.error("Select location / city");
      return;
    }
    if (!form.executiveId) {
      toast.error("Assign a sales consultant");
      return;
    }

    const remarkParts = [
      form.initialRemark.trim() ? `Initial: ${form.initialRemark.trim()}` : "",
      form.salesPersonRemark.trim() ? `Sales: ${form.salesPersonRemark.trim()}` : "",
      form.existingVariant.trim() && form.existingVariant.trim().toUpperCase() !== "NO"
        ? `Existing variant: ${form.existingVariant.trim()}`
        : "",
      form.enquiryDate ? `Enquiry date: ${form.enquiryDate}` : "",
      form.callDate ? `Call date: ${form.callDate}` : "",
      form.leadType ? `Lead type: ${form.leadType}` : "",
    ].filter(Boolean);

    const payload: CreatePvCrmLeadPayload = {
      name: form.name.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim() || undefined,
      city: form.city,
      otherCity: form.city === "Other" ? form.otherCity.trim() : undefined,
      area: form.area.trim() || form.city,
      address: form.address.trim() || undefined,
      model: leadModelLabel(form.model, form.variant),
      source: form.source,
      remarks: remarkParts.join("\n") || undefined,
      exchangeNeeded: form.exchangeNeeded,
      executiveId: form.executiveId,
      status: normalizeCreLeadType(form.leadType),
      leadType: form.leadType,
      enquiryDate: form.enquiryDate || undefined,
      callDate: form.callDate || undefined,
      existingVariant: form.existingVariant.trim() || undefined,
    };

    setSaving(true);
    try {
      const lead = await createPvCrmLead(payload);
      toast.success(`Lead ${lead.leadId ?? ""} created & assigned`);
      onCreated?.(lead);
      onOpenChange(false);
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Add Lead (CRE Format)</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground -mt-1">
          Matches the Current Format sheet — capture enquiry details and assign to a sales consultant.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Enquiry date</Label>
            <Input
              type="date"
              value={form.enquiryDate}
              onChange={(e) => setForm((f) => ({ ...f, enquiryDate: e.target.value }))}
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Lead source</Label>
            <Select value={form.source} onValueChange={(source) => setForm((f) => ({ ...f, source }))}>
              <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CRE_SOURCE_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Customer name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Phone</Label>
            <Input
              value={form.mobile}
              onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
              className="bg-secondary/50"
              inputMode="numeric"
            />
            {existingHistory ? (
              <button
                type="button"
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 hover:underline"
              >
                <History className="w-3 h-3" />
                Existing customer — view history
              </button>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Mail ID</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="bg-secondary/50"
              placeholder="Optional"
            />
          </div>

          <div className="sm:col-span-2">
            <BiharDistrictField
              label="Location / city"
              labelClassName="text-xs"
              value={form.city}
              otherValue={form.otherCity}
              onDistrictChange={(city) => setForm((f) => ({ ...f, city, area: f.area || city }))}
              onOtherChange={(otherCity) => setForm((f) => ({ ...f, otherCity }))}
              selectClassName="h-10 w-full px-3 rounded-lg bg-secondary/50 border border-border text-sm"
              otherInputClassName="h-10 w-full px-3 rounded-lg bg-secondary/50 border border-border text-sm"
              fullWidthOtherRow
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Area (for executive routing)</Label>
            <Input
              value={form.area}
              onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
              className="bg-secondary/50"
              placeholder="e.g. Danapur, Boring Road"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Address / landmark</Label>
            <Input
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="bg-secondary/50"
              placeholder="Optional full address"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Existing variant</Label>
            <Input
              value={form.existingVariant}
              onChange={(e) => setForm((f) => ({ ...f, existingVariant: e.target.value }))}
              className="bg-secondary/50"
              placeholder="NO / current car"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Call date</Label>
            <Input
              type="date"
              value={form.callDate}
              onChange={(e) => setForm((f) => ({ ...f, callDate: e.target.value }))}
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Model</Label>
            <ModelTrimSelect
              model={form.model}
              variant={form.variant}
              onChange={(model, variant) => setForm((f) => ({ ...f, model, variant }))}
              className="h-10 w-full px-3 rounded-lg bg-secondary/50 border border-border text-sm"
              includeMpv7
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Lead type</Label>
            <Select value={form.leadType} onValueChange={(leadType) => setForm((f) => ({ ...f, leadType }))}>
              <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CRE_LEAD_TYPE_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Sales consultant (assign)</Label>
            <Select
              value={form.executiveId || "unassigned"}
              onValueChange={(v) => setForm((f) => ({ ...f, executiveId: v === "unassigned" ? "" : v }))}
            >
              <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select consultant" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Un-assigned</SelectItem>
                {staffUsers.map((e) => (
                  <SelectItem key={e._id} value={e._id}>
                    {e.name}{e.designationLabel ? ` (${e.designationLabel})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Initial remark</Label>
            <Textarea
              value={form.initialRemark}
              onChange={(e) => setForm((f) => ({ ...f, initialRemark: e.target.value }))}
              className="bg-secondary/50"
              rows={2}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Sales person remark</Label>
            <Textarea
              value={form.salesPersonRemark}
              onChange={(e) => setForm((f) => ({ ...f, salesPersonRemark: e.target.value }))}
              className="bg-secondary/50"
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Exchange</Label>
            <Select
              value={form.exchangeNeeded ? "yes" : "no"}
              onValueChange={(v) => setForm((f) => ({ ...f, exchangeNeeded: v === "yes" }))}
            >
              <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="no">NO</SelectItem>
                <SelectItem value="yes">YES</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={() => void handleSave()} disabled={saving} className="flex-1 bg-primary text-primary-foreground">
            {saving ? "Saving…" : "Save & Assign Lead"}
          </Button>
          <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1" disabled={saving}>
            Cancel
          </Button>
        </div>
      </DialogContent>

      <CustomerHistoryDialog
        open={showHistory}
        onOpenChange={setShowHistory}
        history={existingHistory}
        headline="Existing customer — full history"
      />
    </Dialog>
  );
}

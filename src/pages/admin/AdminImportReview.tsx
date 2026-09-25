import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Loader2, Upload, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatApiErrors } from "@/lib/api";
import {
  commitImportBatch,
  fetchImportBatch,
  updateImportBatchRow,
  type ImportBatch,
  type ImportBatchRow,
} from "@/lib/pvLeadCrmApi";
import { CRM_CURRENT_FORMAT_HEADERS } from "@/lib/crmImportFormat";

const EDITABLE_FIELDS = [
  "CUSTOMER NAME",
  "PHONE",
  "MODEL",
  "SALES CONSULTANT",
  "LEAD SOURCE",
  "MAIL ID",
  "LOCATION",
] as const;

export default function AdminImportReview() {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<ImportBatch | null>(null);
  const [rows, setRows] = useState<ImportBatchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRow, setSavingRow] = useState<number | null>(null);
  const [committing, setCommitting] = useState(false);
  const [drafts, setDrafts] = useState<Record<number, Record<string, string>>>({});

  const load = useCallback(async () => {
    if (!batchId) return;
    setLoading(true);
    try {
      const data = await fetchImportBatch(batchId);
      setBatch(data.batch);
      setRows(data.rows);
      const initial: Record<number, Record<string, string>> = {};
      for (const row of data.rows) {
        initial[row.rowNumber] = { ...(row.corrections || {}) };
      }
      setDrafts(initial);
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setLoading(false);
    }
  }, [batchId]);

  useEffect(() => {
    void load();
  }, [load]);

  const errorCount = useMemo(() => rows.filter((r) => r.status === "error").length, [rows]);
  const readyCount = useMemo(
    () => rows.filter((r) => r.status === "valid" || r.status === "corrected").length,
    [rows],
  );

  const saveRow = async (row: ImportBatchRow) => {
    if (!batchId) return;
    setSavingRow(row.rowNumber);
    try {
      const corrections = drafts[row.rowNumber] || {};
      const updated = await updateImportBatchRow(batchId, row.rowNumber, corrections);
      setRows((prev) => prev.map((r) => (r.rowNumber === row.rowNumber ? updated : r)));
      toast.success(`Row ${row.rowNumber} saved`);
      void load();
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setSavingRow(null);
    }
  };

  const handleCommit = async () => {
    if (!batchId) return;
    setCommitting(true);
    try {
      const result = await commitImportBatch(batchId);
      toast.success(
        `Uploaded: ${result.results.created ?? 0} created, ${result.results.updated ?? 0} updated`,
      );
      navigate("/admin/crm/leads");
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setCommitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading import review…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Upload className="w-6 h-6 text-primary" /> Import Error Review
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {batch?.fileName || "Upload"} — fix invalid rows in the UI, then press Final Upload.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/crm/leads")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to CRM
          </Button>
          <Button
            disabled={committing || errorCount > 0 || batch?.status !== "review"}
            onClick={() => void handleCommit()}
          >
            {committing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
            Final Upload
          </Button>
        </div>
      </div>

      <Card className="p-4 flex flex-wrap gap-4 text-sm">
        <span>Total: <strong>{batch?.summary?.total ?? rows.length}</strong></span>
        <span className="text-emerald-600">Ready: <strong>{readyCount}</strong></span>
        <span className="text-red-600">Errors: <strong>{errorCount}</strong></span>
        <span>Status: <Badge variant="outline">{batch?.status}</Badge></span>
      </Card>

      <div className="space-y-4">
        {rows
          .filter((r) => r.status === "error" || r.status === "corrected" || r.issues?.length)
          .map((row) => (
            <Card key={row._id} className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium flex items-center gap-2">
                  Row {row.rowNumber}
                  {row.status === "error" ? (
                    <Badge variant="destructive">Error</Badge>
                  ) : (
                    <Badge variant="secondary">{row.status}</Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={savingRow === row.rowNumber}
                  onClick={() => void saveRow(row)}
                >
                  {savingRow === row.rowNumber ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save row"}
                </Button>
              </div>

              {(row.issues || []).map((err, idx) => (
                <div key={idx} className="text-sm text-red-600 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{err.message || err.code}</span>
                </div>
              ))}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {EDITABLE_FIELDS.map((field) => {
                  const header = CRM_CURRENT_FORMAT_HEADERS.find(
                    (h) => h.toUpperCase() === field || h === field,
                  ) || field;
                  const rawVal = String(row.rawData?.[header] ?? row.rawData?.[field] ?? "");
                  const val = drafts[row.rowNumber]?.[header] ?? drafts[row.rowNumber]?.[field] ?? rawVal;
                  return (
                    <div key={field}>
                      <label className="text-xs text-muted-foreground">{field}</label>
                      <Input
                        value={val}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [row.rowNumber]: {
                              ...(prev[row.rowNumber] || {}),
                              [header]: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
      </div>

      {rows.filter((r) => r.status === "error" || r.issues?.length).length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          All rows are valid. Press <strong>Final Upload</strong> to import {readyCount} lead(s).
        </Card>
      ) : null}
    </div>
  );
}

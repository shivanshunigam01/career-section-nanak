import { useCallback, useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import {
  META_LEADS_API_URL,
  cellDisplay,
  fetchMetaLeadsPayload,
  metaLeadsRows,
  tableColumns,
  type MetaLeadsApiPayload,
} from "@/lib/metaLeadsApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Megaphone } from "lucide-react";
import { toast } from "sonner";

const AdminMetaLead = () => {
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState<MetaLeadsApiPayload | null>(null);
  const [authMode, setAuthMode] = useState<"open" | "admin-session" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMetaLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAuthMode(null);

    try {
      const result = await fetchMetaLeadsPayload();
      setPayload(result.data);
      setAuthMode(result.authMode);
      if (result.authMode === "admin-session") {
        toast.message("Loaded with admin login — redeploy backend for open /All_leads (no token).");
      }
    } catch (e) {
      setPayload(null);
      if (isAxiosError(e)) {
        const status = e.response?.status;
        const apiMsg = (e.response?.data as { message?: string } | undefined)?.message;
        let msg = apiMsg ?? e.message ?? `Request failed (${status ?? "network"})`;
        if (status === 401) {
          msg =
            "401 — sign in at /admin/login first, or redeploy backend so GET /admin/All_leads is registered before auth middleware.";
        } else if (status === 404) {
          msg = "404 — route missing on live API. Redeploy the backend folder and restart the server.";
        }
        setError(msg);
        toast.error(msg);
      } else {
        setError("Failed to load Meta leads");
        toast.error("Failed to load Meta leads");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMetaLeads();
  }, [fetchMetaLeads]);

  const rows = useMemo(() => metaLeadsRows(payload), [payload]);
  const columns = useMemo(() => tableColumns(rows), [rows]);
  const metaBlock = payload?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-primary" />
            Meta Lead
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            GET <code className="text-xs bg-secondary px-1 rounded break-all">{META_LEADS_API_URL}</code>
          </p>
          {authMode === "admin-session" && (
            <p className="text-amber-600 dark:text-amber-400 text-xs mt-2">
              Live API still requires login — loaded using your admin session. Redeploy backend for token-free access.
            </p>
          )}
          {authMode === "open" && (
            <p className="text-green-600 dark:text-green-400 text-xs mt-2">Open access (no token required).</p>
          )}
        </div>
        <Button onClick={() => void fetchMetaLeads()} variant="outline" disabled={loading} className="bg-secondary/50">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="p-4 border-destructive/50 bg-destructive/5 text-destructive text-sm">{error}</Card>
      )}

      {metaBlock != null && Object.keys(metaBlock).length > 0 && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <p className="text-xs font-medium text-muted-foreground mb-2">Response meta (from API)</p>
          <pre className="text-xs overflow-auto">{JSON.stringify(metaBlock, null, 2)}</pre>
        </Card>
      )}

      <Card className="bg-card border-border/50 overflow-hidden">
        <div className="p-3 border-b border-border/50 text-sm text-muted-foreground">
          {loading ? "Loading…" : `${rows.length} row(s) in data`}
          {payload?.success === true && " · success: true"}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/30">
                {columns.map((col) => (
                  <th key={col} className="text-left p-3 text-xs text-muted-foreground font-medium whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={Math.max(columns.length, 1)} className="p-8 text-center text-muted-foreground">
                    Fetching Meta leads…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={Math.max(columns.length, 1)} className="p-8 text-center text-muted-foreground">
                    No rows in <code className="text-xs">data</code>
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr key={String(row._id ?? row.id ?? i)} className="border-b border-border/20 hover:bg-secondary/20">
                    {columns.map((col) => (
                      <td key={col} className="p-3 text-foreground max-w-[200px] truncate" title={cellDisplay(row[col])}>
                        {cellDisplay(row[col])}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border/50">
        <p className="text-xs font-medium text-muted-foreground mb-2">Full JSON response</p>
        <pre className="text-xs overflow-auto max-h-96 p-3 rounded-lg bg-secondary/30 text-foreground">
          {loading ? "…" : JSON.stringify(payload, null, 2)}
        </pre>
      </Card>
    </div>
  );
};

export default AdminMetaLead;

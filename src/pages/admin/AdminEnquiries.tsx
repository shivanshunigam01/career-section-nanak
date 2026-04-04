import { useCallback, useEffect, useState } from "react";
import { mockEnquiries, type Enquiry } from "@/data/mockData";
import {
  getEnquiries,
  setEnquiries as setEnquiriesToStorage,
  getEnquiriesAdminInitial,
  subscribeVfStorage,
  VF_STORAGE_KEYS,
} from "@/lib/vfLocalStorage";
import { hasApi } from "@/lib/apiConfig";
import { adminGet, adminPutJson, formatApiErrors } from "@/lib/api";
import { enquiryFromApi, enquiryStatusPayload } from "@/lib/apiMappers";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Phone, Mail, CheckCircle, MessageSquare, Archive, Download, FileText, MessageCircle } from "lucide-react";

const statusColors: Record<string, string> = {
  Open: "bg-amber-400/10 text-amber-400",
  "In Progress": "bg-blue-400/10 text-blue-400",
  Responded: "bg-green-400/10 text-green-400",
  Closed: "bg-muted text-muted-foreground",
};

const AdminEnquiries = () => {
  const useRemote = hasApi();
  const [hydrated, setHydrated] = useState(false);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(mockEnquiries);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const refreshFromApi = useCallback(async () => {
    const { data } = await adminGet<unknown[]>("/admin/enquiries?limit=500&page=1");
    setEnquiries((data as Record<string, unknown>[]).map((d) => enquiryFromApi(d)));
  }, []);

  useEffect(() => {
    if (useRemote) {
      (async () => {
        try {
          await refreshFromApi();
        } catch (e) {
          toast.error(formatApiErrors(e));
        } finally {
          setHydrated(true);
        }
      })();
      return;
    }
    const { seedMock, enquiries: initial } = getEnquiriesAdminInitial();
    setEnquiries(seedMock ? mockEnquiries : initial);
    setHydrated(true);
    return subscribeVfStorage(VF_STORAGE_KEYS.enquiries, () => setEnquiries(getEnquiries()));
  }, [useRemote, refreshFromApi]);

  useEffect(() => {
    if (!hydrated || useRemote) return;
    setEnquiriesToStorage(enquiries);
  }, [enquiries, hydrated, useRemote]);

  const filtered = enquiries.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.mobile.includes(search);
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: string, status: Enquiry["status"]) => {
    if (useRemote) {
      try {
        const updated = await adminPutJson<Record<string, unknown>>(`/admin/enquiries/${id}`, enquiryStatusPayload(status));
        const mapped = enquiryFromApi(updated);
        setEnquiries((prev) => prev.map((e) => (e.id === id ? mapped : e)));
        toast.success("Enquiry updated");
      } catch (e) {
        toast.error(formatApiErrors(e));
      }
      return;
    }
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const escapeCsv = (value: unknown) => {
    const str = String(value ?? "");
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };

  const exportCsv = () => {
    const headers: (keyof Enquiry)[] = ["id", "name", "mobile", "email", "type", "message", "status", "createdAt"];
    const rows = filtered.map((e) => headers.map((h) => escapeCsv(e[h])).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patliputra-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const htmlRows = filtered
      .map(
        (e) => `<tr>
          <td>${e.name}</td>
          <td>${e.mobile}</td>
          <td>${e.email}</td>
          <td>${e.type}</td>
          <td>${e.status}</td>
          <td>${e.createdAt}</td>
        </tr>`,
      )
      .join("");

    const html = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Enquiries Export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 16px; }
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          <h2>Patliputra Enquiries Export (${filtered.length})</h2>
          <table>
            <thead>
              <tr><th>Name</th><th>Mobile</th><th>Email</th><th>Type</th><th>Status</th><th>Created At</th></tr>
            </thead>
            <tbody>${htmlRows}</tbody>
          </table>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  const shareWhatsApp = () => {
    const preview = filtered.slice(0, 10).map((e) => `• ${e.name} (${e.mobile}) - ${e.type} - ${e.status}`).join("\n");
    const suffix = filtered.length > 10 ? `\n...and ${filtered.length - 10} more` : "";
    const msg = `Patliputra Enquiries (${filtered.length})\n${preview}${suffix}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Enquiries</h1>
          <p className="text-muted-foreground text-sm">{enquiries.length} total enquiries</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Button onClick={exportCsv} variant="outline" className="bg-secondary/50">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={exportPdf} variant="outline" className="bg-secondary/50">
            <FileText className="w-4 h-4 mr-2" /> Export PDF
          </Button>
          <Button onClick={shareWhatsApp} variant="outline" className="bg-secondary/50">
            <MessageCircle className="w-4 h-4 mr-2" /> Share WhatsApp
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary/50" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40 bg-secondary/50"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Responded">Responded</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((enq) => (
          <Card key={enq.id} className="bg-card border-border/50 p-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-foreground">{enq.name}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[enq.status] ?? "bg-secondary text-muted-foreground"}`}>{enq.status}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{enq.type}</span>
                </div>
                <p className="text-sm text-muted-foreground">{enq.message}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{enq.mobile}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{enq.email}</span>
                  <span>{enq.createdAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => updateStatus(enq.id, "Responded")} title="Mark Responded" className="p-1.5 rounded hover:bg-green-400/10 text-muted-foreground hover:text-green-400"><MessageSquare className="w-4 h-4" /></button>
                <button onClick={() => updateStatus(enq.id, "Closed")} title="Close" className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Archive className="w-4 h-4" /></button>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">No enquiries found</p>}
      </div>
    </div>
  );
};

export default AdminEnquiries;

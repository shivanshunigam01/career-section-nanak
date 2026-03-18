import { useState } from "react";
import { mockEnquiries, type Enquiry } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Phone, Mail, CheckCircle, MessageSquare, Archive } from "lucide-react";

const statusColors: Record<string, string> = {
  Open: "bg-amber-400/10 text-amber-400",
  Responded: "bg-green-400/10 text-green-400",
  Closed: "bg-muted text-muted-foreground",
};

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(mockEnquiries);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = enquiries.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.mobile.includes(search);
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, status: Enquiry["status"]) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Enquiries</h1>
        <p className="text-muted-foreground text-sm">{enquiries.length} total enquiries</p>
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
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[enq.status]}`}>{enq.status}</span>
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

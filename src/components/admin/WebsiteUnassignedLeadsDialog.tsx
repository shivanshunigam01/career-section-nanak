import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, UserCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { fetchPvCrmLeadStats } from "@/lib/pvLeadCrmApi";
import { getAdminUser, getAdminToken, isCreOrCrmDeskUser } from "@/lib/adminAuth";
import { hasApi } from "@/lib/apiConfig";

const SESSION_KEY = "vf-website-unassigned-popup-v1";

export function WebsiteUnassignedLeadsDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const user = getAdminUser();
    if (!user || !isCreOrCrmDeskUser(user)) return;
    if (!hasApi() || !getAdminToken()) return;
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1") return;

    let cancelled = false;
    void (async () => {
      try {
        const stats = await fetchPvCrmLeadStats({ moduleView: "crm" });
        const n = stats.websiteUnassignedCount ?? 0;
        if (cancelled || n <= 0) return;
        setCount(n);
        setOpen(true);
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore — popup is optional */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const goToQueue = () => {
    setOpen(false);
    navigate("/admin/crm/leads?assigned=unassigned");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-600" />
            Website leads waiting for assignment
          </DialogTitle>
          <DialogDescription className="text-left pt-1">
            {count.toLocaleString("en-IN")} customer{" "}
            {count === 1 ? "submission" : "submissions"} from the website or test-drive forms are still
            unassigned. Open the queue to assign executives — only one CRM/CRE can edit a lead at a time
            while assigning.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Later
          </Button>
          <Button type="button" onClick={goToQueue} className="gap-2">
            <UserCheck className="w-4 h-4" />
            Open unassigned leads
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import AdminCrmLeads from "./AdminCrmLeads";
import { BOOKING_LEADS_BASE } from "@/lib/pvLeadCrmApi";

export default function AdminBookingLeads() {
  return (
    <AdminCrmLeads
      pageConfig={{
        title: "Booking CRM",
        description:
          "Leads with booking done (Yes). Booking + TD done also appear in Test Drive module.",
        moduleKey: "crm_booking_leads",
        apiBase: BOOKING_LEADS_BASE,
        showAddLead: false,
        showImport: false,
      }}
    />
  );
}

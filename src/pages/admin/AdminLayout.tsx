import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Car, FileText, Settings, LogOut, Menu, X,
  TestTube, MessageSquare, Tag, Bell, Home, Image
} from "lucide-react";
import vinLogo from "@/assets/patliputra-vinfast-logo.png";
import { hasApi } from "@/lib/apiConfig";
import { clearAdminSession, getAdminToken, getAdminUser } from "@/lib/adminAuth";

const navItems = [
  { label: "Dashboard",   icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Homepage",    icon: Home,             path: "/admin/homepage" },
  { label: "Leads",       icon: Users,            path: "/admin/leads" },
  { label: "Test Drives", icon: TestTube,         path: "/admin/test-drives" },
  { label: "Products",    icon: Car,              path: "/admin/products" },
  { label: "Enquiries",   icon: MessageSquare,    path: "/admin/enquiries" },
  { label: "Offers",      icon: Tag,              path: "/admin/offers" },
  { label: "Content",     icon: FileText,         path: "/admin/content" },
  { label: "Media",       icon: Image,            path: "/admin/media" },
  { label: "Settings",    icon: Settings,         path: "/admin/settings" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const api = hasApi();
    const tokenOk = api ? Boolean(getAdminToken()) : localStorage.getItem("admin_logged_in") === "true";
    if (!tokenOk) navigate("/admin/login");
  }, [navigate]);

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin/login");
  };

  const adminUser = getAdminUser();
  const avatarLabel = adminUser?.name
    ? adminUser.name
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "PA";

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex overflow-x-hidden">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 bg-black/60 z-40 lg:hidden touch-manipulation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — wider on lg for larger brand lockup; drawer uses most of small screens safely */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 flex h-screen max-h-[100dvh] w-[min(20rem,calc(100vw-2.5rem))] sm:w-72 lg:w-72 xl:w-80 flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 ease-out lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-4 sm:px-5 sm:py-5">
          <Link
            to="/admin/dashboard"
            className="flex min-w-0 flex-1 items-center"
            onClick={() => setSidebarOpen(false)}
          >
            <img
              src={vinLogo}
              alt="Patliputra VinFast"
              className="h-12 w-auto max-h-16 max-w-full object-contain object-left sm:h-14 sm:max-h-[4.5rem] lg:h-16 lg:max-h-[5rem]"
            />
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden touch-manipulation"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden p-3 sm:p-4 overscroll-contain">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors sm:py-2.5 sm:text-[0.9375rem] touch-manipulation ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0 opacity-90" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-border p-3 sm:p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive touch-manipulation sm:py-2.5"
          >
            <LogOut className="h-5 w-5 shrink-0 opacity-90" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex min-h-14 items-center gap-2 border-b border-border bg-card/95 px-3 py-2 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80 sm:min-h-16 sm:gap-4 sm:px-4 sm:py-0 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden touch-manipulation"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="min-w-0 flex-1 lg:block" />
          <button
            type="button"
            className="relative shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground touch-manipulation"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
              3
            </span>
          </button>
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary sm:h-10 sm:w-10"
            title={adminUser?.email ?? ""}
          >
            {avatarLabel}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

import { useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Car, FileText, Settings, LogOut, Menu, X,
  TestTube, MessageSquare, Tag, Bell
} from "lucide-react";
import { useState } from "react";
import vinLogo from "@/assets/patliputra-vinfast-logo.png";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Leads", icon: Users, path: "/admin/leads" },
  { label: "Test Drives", icon: TestTube, path: "/admin/test-drives" },
  { label: "Products", icon: Car, path: "/admin/products" },
  { label: "Enquiries", icon: MessageSquare, path: "/admin/enquiries" },
  { label: "Offers", icon: Tag, path: "/admin/offers" },
  { label: "Content", icon: FileText, path: "/admin/content" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    if (!isLoggedIn) navigate("/admin/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b border-border flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <img src={vinLogo} alt="Patliputra VinFast" className="h-7" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-card/80 backdrop-blur-md border-b border-border flex items-center px-4 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <button className="relative text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full text-[9px] text-primary-foreground flex items-center justify-center font-bold">3</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            PA
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

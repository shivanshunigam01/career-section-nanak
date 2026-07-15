import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MessageCircle, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import vinfastLogo from "@/assets/patliputra-vinfast-logo.png";
import patliputraOutlineLogo from "@/assets/black outline logo patliputra.png";
import { usePublicSite } from "@/context/PublicSiteContext";
import { telHref, waMeUrl } from "@/lib/contactLinks";
import { getCustomerToken } from "@/lib/customerAuth";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "VF 7", href: "/models/vf7" },
  { label: "VF 6", href: "/models/vf6" },
  { label: "VF MPV 7", href: "/models/mpv7" },
  { label: "Limo Green", href: "/models/limo-green" },
  { label: "Compare", href: "/compare" },
  // { label: "Pre-Booking", href: "/book-now" },
  { label: "Test Drive", href: "/test-drive" },
  { label: "EMI Calculator", href: "/emi-calculator" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const { dealer, siteConfig } = usePublicSite();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const tel = telHref(siteConfig.phoneNumber || dealer.phone);
  const wa = waMeUrl(siteConfig.whatsappNumber || dealer.whatsapp);
  const customerLoggedIn = Boolean(getCustomerToken());
  const customerPortalHref = customerLoggedIn ? "/customer/bookings" : "/customer/login";

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white border-b border-gray-200 py-0 shadow-sm"
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between min-h-[4.25rem] h-[4.25rem] xl:h-20 xl:min-h-0">
            {/* Logo lockup */}
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <img
                src={vinfastLogo}
                alt={dealer.dealerName}
                className="h-12 lg:h-[3.25rem] xl:h-16 w-auto object-contain object-left"
              />
              <span className="w-px h-7 self-center bg-border shrink-0" aria-hidden />
              <img
                src={patliputraOutlineLogo}
                alt="Patliputra Group"
                className="h-7 lg:h-8 w-auto object-contain object-left"
              />
            </Link>

            {/* Desktop Nav — visible from lg (1024 px) upwards */}
            <div className="hidden lg:flex items-center gap-0 xl:gap-0.5 min-w-0 flex-1 justify-center overflow-hidden">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-1.5 xl:px-2.5 py-2 text-[0.7rem] xl:text-sm font-medium transition-colors rounded-lg whitespace-nowrap ${
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
              <Link
                to={customerPortalHref}
                className={`hidden xl:inline-flex items-center gap-1.5 text-xs font-medium transition-colors rounded-lg px-2 py-1.5 ${
                  location.pathname.startsWith("/customer")
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                <UserCircle className="w-4 h-4" />
                {customerLoggedIn ? "" : "Login"}
              </Link>
              <a href={tel} className="hidden xl:block transition-colors text-foreground/60 hover:text-foreground" aria-label="Call us">
                <Phone className="w-4 h-4" />
              </a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="hidden xl:block transition-colors text-foreground/60 hover:text-foreground" aria-label="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
              <Button variant="hero" size="sm" asChild className="text-xs xl:text-sm px-3 xl:px-4">
                <Link to="/book-now">Pre-Booking</Link>
              </Button>
            </div>

            {/* Mobile / tablet toggle — hidden at lg+ */}
            <button
              type="button"
              onClick={() => setIsMobileOpen((open) => !open)}
              className="lg:hidden p-2 transition-colors text-foreground"
              aria-expanded={isMobileOpen}
              aria-controls="mobile-nav-panel"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="mobile-nav-panel"
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 flex flex-col bg-background pt-[4.25rem] lg:hidden"
          >
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
              <div className="container mx-auto px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-4 py-3 text-lg font-medium rounded-xl transition-colors ${
                      location.pathname === link.href
                        ? "text-primary bg-primary/10"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to={customerPortalHref}
                  className={`px-4 py-3 text-lg font-medium rounded-xl transition-colors ${
                    location.pathname.startsWith("/customer")
                      ? "text-primary bg-primary/10"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {customerLoggedIn ? "My Bookings" : "Login"}
                </Link>
                <div className="mt-6 flex flex-col gap-3">
                  <Button variant="hero" size="lg" className="w-full" asChild>
                    <Link to="/book-now">Pre-Booking</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <Link to="/test-drive">Book Test Drive</Link>
                  </Button>
                  <Button variant="whatsapp" size="lg" className="w-full" asChild>
                    <a href={wa} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-5 h-5" /> WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

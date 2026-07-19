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
  const loginHref = customerLoggedIn ? "/customer/bookings" : "/login";

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto w-full max-w-[100%] px-3 sm:px-4 lg:px-5 2xl:px-6">
          {/*
            Three-zone header: logos (shrinkable) | nav (2xl only) | actions (never shrink).
            Caps on logo widths stop PNG assets from colliding with Book Now / hamburger.
          */}
          <div className="flex h-16 sm:h-[4.25rem] 2xl:h-20 items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2 overflow-hidden 2xl:flex-none 2xl:max-w-[22rem]"
            >
              <img
                src={vinfastLogo}
                alt={dealer.dealerName}
                className="h-9 w-auto max-w-[9.5rem] shrink object-contain object-left sm:h-11 sm:max-w-[12rem] lg:h-12 lg:max-w-[13.5rem] 2xl:h-14 2xl:max-w-[15rem]"
              />
              <span className="hidden h-6 w-px shrink-0 bg-border md:block 2xl:h-8" aria-hidden />
              <img
                src={patliputraOutlineLogo}
                alt="Patliputra Group"
                className="hidden h-6 w-auto max-w-[7.5rem] shrink object-contain object-left md:block lg:h-7 lg:max-w-[9rem] 2xl:h-8 2xl:max-w-[10.5rem]"
              />
            </Link>

            <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 overflow-hidden 2xl:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`shrink-0 rounded-lg px-2 py-2 text-[0.8125rem] font-medium whitespace-nowrap transition-colors ${
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <Link
                to={loginHref}
                className={`hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors 2xl:inline-flex ${
                  location.pathname === "/login" ||
                  location.pathname.startsWith("/customer") ||
                  location.pathname.startsWith("/admin/login")
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                <UserCircle className="h-4 w-4" />
                {customerLoggedIn ? "My Bookings" : "Login"}
              </Link>
              <a
                href={tel}
                className="hidden text-foreground/60 transition-colors hover:text-foreground 2xl:block"
                aria-label="Call us"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden text-foreground/60 transition-colors hover:text-foreground 2xl:block"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>

              <Button
                variant="hero"
                size="sm"
                asChild
                className="h-8 px-2.5 text-[0.7rem] sm:h-9 sm:px-3 sm:text-xs 2xl:h-9 2xl:px-4 2xl:text-sm"
              >
                <Link to="/book-now">Book Now</Link>
              </Button>

              <button
                type="button"
                onClick={() => setIsMobileOpen((open) => !open)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground touch-manipulation 2xl:hidden"
                aria-expanded={isMobileOpen}
                aria-controls="mobile-nav-panel"
                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              >
                {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

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
            className="fixed inset-0 z-40 flex flex-col bg-background pt-16 sm:pt-[4.25rem] 2xl:hidden"
          >
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="mx-auto flex w-full max-w-lg flex-col gap-1 px-4 py-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`rounded-xl px-4 py-3 text-base font-medium transition-colors sm:text-lg ${
                      location.pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {customerLoggedIn ? (
                  <Link
                    to="/customer/bookings"
                    className={`rounded-xl px-4 py-3 text-base font-medium transition-colors sm:text-lg ${
                      location.pathname.startsWith("/customer")
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    My Bookings
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/customer/login"
                      className={`rounded-xl px-4 py-3 text-base font-medium transition-colors sm:text-lg ${
                        location.pathname === "/customer/login"
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      Login as Customer
                    </Link>
                    <Link
                      to="/admin/login"
                      className={`rounded-xl px-4 py-3 text-base font-medium transition-colors sm:text-lg ${
                        location.pathname === "/admin/login"
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      Login as Admin
                    </Link>
                  </>
                )}
                <div className="mt-5 flex flex-col gap-3">
                  <Button variant="hero" size="lg" className="w-full" asChild>
                    <Link to="/book-now">Book Now</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <Link to="/test-drive">Book Test Drive</Link>
                  </Button>
                  <Button variant="whatsapp" size="lg" className="w-full" asChild>
                    <a href={wa} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-5 w-5" /> WhatsApp
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

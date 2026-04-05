import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import vinfastLogo from "@/assets/patliputra-vinfast-logo.png";
import patliputraOutlineLogo from "@/assets/black outline logo patliputra.png";
import { usePublicSite } from "@/context/PublicSiteContext";
import { telHref, waMeUrl } from "@/lib/contactLinks";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "VF 7", href: "/models/vf7" },
  { label: "VF 6", href: "/models/vf6" },
  { label: "VF MPV 7", href: "/models/mpv7" },
  { label: "Compare", href: "/compare" },
  { label: "Book Now", href: "/book-now" },
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

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white border-b border-gray-200 py-0 shadow-sm"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between min-h-[4.25rem] h-[4.25rem] lg:h-20 lg:min-h-0">
            {/* Logos: VinFast lockup + Patliputra outline (outline slightly smaller); larger on small screens */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0">
              <img
                src={vinfastLogo}
                alt="Patliputra VinFast"
                className="h-[3.25rem] sm:h-14 lg:h-16 w-auto max-h-full object-contain object-left"
              />
              <span className="w-px h-7 sm:h-8 lg:h-8 self-center bg-border shrink-0" aria-hidden />
              <img
                src={patliputraOutlineLogo}
                alt="Patliputra"
                className="h-7 sm:h-8 lg:h-8 w-auto max-h-full object-contain object-left"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
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
            <div className="hidden lg:flex items-center gap-3">
              <a href={tel} className="transition-colors text-foreground/60 hover:text-foreground">
                <Phone className="w-4 h-4" />
              </a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="transition-colors text-foreground/60 hover:text-foreground">
                <MessageCircle className="w-4 h-4" />
              </a>
              <Link to="/book-now">
                <Button variant="hero" size="sm">Book Now</Button>
              </Link>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden p-2 transition-colors text-foreground">
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-background pt-20"
          >
            <div className="container mx-auto px-4 py-8 flex flex-col gap-2">
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
              <div className="mt-6 flex flex-col gap-3">
                <Link to="/book-now">
                  <Button variant="hero" size="lg" className="w-full">Book Now</Button>
                </Link>
                <Link to="/test-drive">
                  <Button variant="outline" size="lg" className="w-full">Book Test Drive</Button>
                </Link>
                <a href={wa} target="_blank" rel="noopener noreferrer">
                  <Button variant="whatsapp" size="lg" className="w-full">
                    <MessageCircle className="w-5 h-5" /> WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

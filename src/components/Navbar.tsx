import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import vinfastLogo from "@/assets/patliputra-vinfast-logo.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "VF 7", href: "/models/vf7" },
  { label: "VF 6", href: "/models/vf6" },
  { label: "Compare", href: "/compare" },
  { label: "Test Drive", href: "/test-drive" },
  { label: "EMI Calculator", href: "/emi-calculator" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white border-b border-gray-200 py-0 shadow-sm"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src={vinfastLogo} alt="Patliputra VinFast" className="h-10 sm:h-12 lg:h-16 w-auto object-contain" />
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
              <a href="tel:+919231445060" className="transition-colors text-foreground/60 hover:text-foreground">
                <Phone className="w-4 h-4" />
              </a>
              <a href="https://wa.me/919231445060" target="_blank" rel="noopener noreferrer" className="transition-colors text-foreground/60 hover:text-foreground">
                <MessageCircle className="w-4 h-4" />
              </a>
              <Link to="/test-drive">
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
                <Link to="/test-drive">
                  <Button variant="hero" size="lg" className="w-full">Book Test Drive</Button>
                </Link>
                <a href="https://wa.me/919231445060" target="_blank" rel="noopener noreferrer">
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

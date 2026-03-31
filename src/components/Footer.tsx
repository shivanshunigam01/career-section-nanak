import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import vinfastLogo from "@/assets/patliputra-vinfast-logo.png";


//this is my footer 
const Footer = () => {
  return (
    <footer className="section-surface border-t border-border/50">
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={vinfastLogo} alt="Patliputra VinFast" className="h-9 opacity-80" />
            </div>
            <p className="text-xs text-primary font-display font-semibold uppercase tracking-[0.15em] mb-3">Authorized Dealer, Bihar</p>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
              Bihar's authorized VinFast dealer. Experience premium electric SUVs — VF 6 & VF 7 — with world-class safety, technology, and support.
            </p>
            <div className="flex gap-4">
              <a href="https://wa.me/919231445060" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="tel:+919231445060" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all">
                <Phone className="w-4 h-4" />
              </a>
              <a href="mailto:info@patliputravinfast.com" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "VF 7", href: "/models/vf7" },
                { label: "VF 6", href: "/models/vf6" },
                { label: "Compare Models", href: "/compare" },
                { label: "Book Test Drive", href: "/test-drive" },
                { label: "EMI Calculator", href: "/emi-calculator" },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4">More</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Offers", href: "/contact" },
                { label: "Exchange Car", href: "/contact" },
                { label: "Finance Options", href: "/emi-calculator" },
                { label: "FAQ", href: "/about" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Plot No. 2421, NH 30, Bypass Road, Paijawa, Patna, Bihar 800009</span>
              </li>
              <li className="flex gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="tel:+919231445060" className="text-muted-foreground hover:text-foreground transition-colors">
                  +91 92314 45060
                </a>
              </li>
              <li className="flex gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="mailto:info@patliputravinfast.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  info@patliputravinfast.com
                </a>
              </li>
              <li className="flex gap-3 text-sm">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">10 AM – 8 PM, Mon–Sat</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/30">
        <div className="container mx-auto px-4 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            © 2026 Patliputra Auto. All rights reserved. Authorized VinFast Dealer, Bihar.
          </p>
          <div className="flex gap-6">
            <Link to="/about" className="text-muted-foreground text-xs hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="text-muted-foreground text-xs hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import vinfastLogo from "@/assets/patliputra-vinfast-logo.png";
import { usePublicSite } from "@/context/PublicSiteContext";
import { telHref, waMeUrl } from "@/lib/contactLinks";

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/6LioDasHnAeh2eus9";
const SHOWROOM_ADDRESS = "Plot No. 2421, NH 30, Bypass Road, Opposite Indian Oil Pump, Paijawa, Patna, Bihar - 800009";

const Footer = () => {
  const { dealer, siteConfig } = usePublicSite();
  const address = dealer.address?.trim() ? dealer.address : SHOWROOM_ADDRESS;
  const phoneDisplay = siteConfig.phoneNumber || dealer.phone;
  const email = dealer.email || "info@patliputravinfast.com";
  const wa = waMeUrl(siteConfig.whatsappNumber || dealer.whatsapp);
  const tel = telHref(phoneDisplay);
  const hours = dealer.showroomHours || "10 AM – 8 PM, Mon–Sat";

  return (
    <footer className="section-surface border-t border-border/50">
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={vinfastLogo} alt="Patliputra VinFast" className="h-9 opacity-80" />
            </div>
            <p className="text-xs text-primary font-display font-semibold uppercase tracking-[0.15em] mb-3">
              {dealer.dealerName} · Authorized Dealer, Bihar
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
              Bihar's authorized VinFast dealer. Experience premium electric SUVs — VF 6 & VF 7 — with world-class safety, technology, and support.
            </p>
            <div className="flex gap-4">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href={tel} className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all">
                <Phone className="w-4 h-4" />
              </a>
              <a href={`mailto:${email}`} className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all">
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
                { label: "Book Now", href: "/book-now" },
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
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 text-muted-foreground hover:text-foreground transition-colors break-words"
                >
                  {address}
                </a>
              </li>
              <li className="flex gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href={tel} className="text-muted-foreground hover:text-foreground transition-colors">
                  {phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href={`mailto:${email}`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {email}
                </a>
              </li>
              <li className="flex gap-3 text-sm">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{hours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/30">
        <div className="container mx-auto px-4 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            © 2026 {dealer.dealerName}. All rights reserved. Authorized VinFast Dealer, Bihar.
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

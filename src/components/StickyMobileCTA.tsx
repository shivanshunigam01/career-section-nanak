import { Link } from "react-router-dom";
import { Phone, MessageCircle, CalendarDays, ShoppingBag } from "lucide-react";

const StickyMobileCTA = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background border-t border-border/50 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <a
            href="tel:+919231445060"
            className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl bg-foreground/5 text-foreground text-xs font-medium"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </a>
          <a
            href="https://wa.me/919231445060"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl bg-[#25D366] text-primary-foreground text-xs font-medium"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/book-now"
            className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl bg-primary text-primary-foreground text-xs font-medium"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Book Now
          </Link>
          <Link
            to="/test-drive"
            className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl bg-foreground/10 text-foreground text-xs font-medium border border-border/60"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Test Drive
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StickyMobileCTA;

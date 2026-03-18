import { Link } from "react-router-dom";
import { Phone, MessageCircle, CalendarDays } from "lucide-react";

const StickyMobileCTA = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/90 backdrop-blur-xl border-t border-border/50 px-4 py-3">
      <div className="flex items-center gap-2">
        <a href="tel:+919876543210" className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-foreground/5 text-foreground text-sm font-medium">
          <Phone className="w-4 h-4" />
          Call
        </a>
        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-[#25D366] text-primary-foreground text-sm font-medium">
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
        <Link to="/test-drive" className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
          <CalendarDays className="w-4 h-4" />
          Test Drive
        </Link>
      </div>
    </div>
  );
};

export default StickyMobileCTA;

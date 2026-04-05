import { Link } from "react-router-dom";
import { Car, Calculator, ArrowLeftRight, MapPin, Phone, MessageCircle, CalendarDays, ShoppingBag } from "lucide-react";

const actions = [
  { icon: ShoppingBag, label: "Book Now", href: "/book-now" },
  { icon: CalendarDays, label: "Test Drive", href: "/test-drive" },
  { icon: Car, label: "Get Price", href: "/contact" },
  { icon: Calculator, label: "EMI Calculator", href: "/emi-calculator" },
  { icon: ArrowLeftRight, label: "Exchange", href: "/contact" },
  { icon: MapPin, label: "Find Showroom", href: "/contact" },
  { icon: Phone, label: "Call", href: "tel:+919231445060", external: true },
  { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/919231445060", external: true },
];

const QuickActionBar = () => {
  return (
    <section className="relative z-10 -mt-12 lg:-mt-16 hidden lg:block">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="rounded-3xl border border-border bg-background px-4 py-4 lg:px-8 lg:py-5 overflow-x-auto sm:overflow-visible">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 lg:gap-4 sm:min-w-max lg:justify-center">
            {actions.map((action) => {
              const Icon = action.icon;
              const content = (
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl hover:bg-foreground/5 cursor-pointer group">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium text-foreground/80 group-hover:text-foreground whitespace-nowrap">
                    {action.label}
                  </span>
                </div>
              );

              if (action.external) {
                return (
                  <a key={action.label} href={action.href} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                );
              }

              return (
                <Link key={action.label} to={action.href}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickActionBar;

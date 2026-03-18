import { Link } from "react-router-dom";
import { Car, Calculator, ArrowLeftRight, MapPin, Phone, MessageCircle, CalendarDays } from "lucide-react";

const actions = [
  { icon: CalendarDays, label: "Test Drive", href: "/test-drive" },
  { icon: Car, label: "Get Price", href: "/contact" },
  { icon: Calculator, label: "EMI Calculator", href: "/emi-calculator" },
  { icon: ArrowLeftRight, label: "Exchange", href: "/contact" },
  { icon: MapPin, label: "Find Showroom", href: "/contact" },
  { icon: Phone, label: "Call", href: "tel:+919876543210", external: true },
  { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/919876543210", external: true },
];

const QuickActionBar = () => {
  return (
    <section className="relative z-10 -mt-12 lg:-mt-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="glass-card px-4 py-4 lg:px-8 lg:py-5 overflow-x-auto">
          <div className="flex items-center gap-2 lg:gap-4 min-w-max lg:justify-center">
            {actions.map((action) => {
              const Icon = action.icon;
              const content = (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-foreground/5 transition-all cursor-pointer group">
                  <Icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground whitespace-nowrap">
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

import { cn } from "@/lib/utils";
import {
  FESTIVE_PRICE_DEFAULTS,
  type FestivePriceSlug,
  isFestivePricingSlug,
  parseIndianVehiclePriceToRupees,
} from "@/lib/festivePricing";

type FestivePriceDisplayProps = {
  /** When set, list + offer always come from campaign constants (homepage-safe). */
  slug?: FestivePriceSlug;
  listPrice?: string;
  offerPrice?: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
  className?: string;
  showBadge?: boolean;
};

const sizeClasses = {
  sm: {
    list: "text-xs",
    offer: "text-base sm:text-lg",
    badge: "text-[9px] px-1.5 py-0.5",
  },
  md: {
    list: "text-sm",
    offer: "text-2xl sm:text-3xl",
    badge: "text-[10px] px-2 py-0.5",
  },
  lg: {
    list: "text-sm sm:text-base",
    offer: "text-3xl sm:text-4xl",
    badge: "text-[10px] px-2 py-0.5",
  },
};

function resolveDisplayPair(
  slug: FestivePriceSlug | undefined,
  listPrice: string,
  offerPrice: string,
): { list: string; offer: string } {
  if (slug && isFestivePricingSlug(slug)) {
    return FESTIVE_PRICE_DEFAULTS[slug];
  }
  const listR = parseIndianVehiclePriceToRupees(listPrice);
  const offerR = parseIndianVehiclePriceToRupees(offerPrice);
  if (listR != null && Math.abs(listR - 2_449_000) < 50_000) {
    return FESTIVE_PRICE_DEFAULTS.mpv7;
  }
  if (listR != null && Math.abs(listR - 2_299_000) < 50_000) {
    return FESTIVE_PRICE_DEFAULTS["limo-green"];
  }
  if (listR != null && offerR != null && offerR >= listR - 15_000) {
    if (Math.abs(listR - 2_449_000) < 80_000) return FESTIVE_PRICE_DEFAULTS.mpv7;
    if (Math.abs(listR - 2_299_000) < 80_000) return FESTIVE_PRICE_DEFAULTS["limo-green"];
  }
  return { list: listPrice, offer: offerPrice };
}

/** Amazon-style: struck-through list price + festive offer price. */
export function FestivePriceDisplay({
  slug,
  listPrice = "",
  offerPrice = "",
  size = "md",
  align = "left",
  className,
  showBadge = true,
}: FestivePriceDisplayProps) {
  const { list, offer } = resolveDisplayPair(slug, listPrice, offerPrice);
  const s = sizeClasses[size];
  const alignClass =
    align === "center" ? "items-center text-center" : align === "right" ? "items-end text-right" : "items-start text-left";

  return (
    <div className={cn("flex flex-col gap-1", alignClass, className)}>
      {showBadge && (
        <span
          className={cn(
            "inline-flex w-fit rounded-full bg-primary/15 font-semibold uppercase tracking-wider text-primary",
            s.badge,
          )}
        >
          Festive offer
        </span>
      )}
      <p className={cn("text-muted-foreground line-through decoration-muted-foreground/70 tabular-nums", s.list)}>
        {list}
      </p>
      <p className={cn("font-display font-bold text-foreground tabular-nums leading-none", s.offer)}>{offer}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Ex-showroom*</p>
    </div>
  );
}

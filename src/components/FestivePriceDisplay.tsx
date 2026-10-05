import { cn } from "@/lib/utils";

type FestivePriceDisplayProps = {
  listPrice: string;
  offerPrice: string;
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

/** Amazon-style: struck-through list price + festive offer price. */
export function FestivePriceDisplay({
  listPrice,
  offerPrice,
  size = "md",
  align = "left",
  className,
  showBadge = true,
}: FestivePriceDisplayProps) {
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
        {listPrice}
      </p>
      <p className={cn("font-display font-bold text-foreground tabular-nums leading-none", s.offer)}>{offerPrice}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Ex-showroom*</p>
    </div>
  );
}

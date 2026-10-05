import type { OfferMediaType } from "@/lib/adminCmsMappers";
import { cn } from "@/lib/utils";

type OfferMediaProps = {
  url: string;
  mediaType: OfferMediaType;
  title: string;
  className?: string;
  autoPlayVideo?: boolean;
};

/** Renders offer image, GIF, or video for public cards. */
export function OfferMedia({ url, mediaType, title, className, autoPlayVideo = true }: OfferMediaProps) {
  if (!url) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-primary/20 via-foreground/5 to-transparent",
          className,
        )}
      >
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Offer</span>
      </div>
    );
  }

  if (mediaType === "video") {
    return (
      <video
        src={url}
        className={cn("h-full w-full object-cover", className)}
        playsInline
        muted
        loop
        controls={!autoPlayVideo}
        autoPlay={autoPlayVideo}
        aria-label={title}
      />
    );
  }

  return <img src={url} alt={title} className={cn("h-full w-full object-cover", className)} loading="lazy" />;
}

export function offerMediaTypeFromApi(raw: unknown): OfferMediaType {
  const v = String(raw ?? "image").toLowerCase();
  if (v === "video" || v === "gif") return v;
  if (typeof raw === "string" && raw.toLowerCase().endsWith(".gif")) return "gif";
  return "image";
}

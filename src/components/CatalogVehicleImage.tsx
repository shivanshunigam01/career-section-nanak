import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  frameClassName?: string;
};

/** Consistent studio-style frame for lineup / compare thumbnails. */
export function CatalogVehicleImage({ src, alt, className, frameClassName }: Props) {
  return (
    <div
      className={cn(
        "flex h-28 w-full max-w-[220px] mx-auto items-center justify-center rounded-xl bg-[#ececea] p-3 sm:h-32 sm:p-4",
        frameClassName,
      )}
    >
      <img
        src={src}
        alt={alt}
        className={cn("max-h-full max-w-full w-auto object-contain object-center", className)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

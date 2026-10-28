type VariantOption = { id: string; name: string; shortLabel: string };

type ModelPageVariantBarProps = {
  productLabel: string;
  selectedVariantName: string;
  variants: VariantOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  selectId: string;
};

/** VF 6 / VF 7 variant picker — always directly under the price band. */
export function ModelPageVariantBar({
  productLabel,
  selectedVariantName,
  variants,
  selectedId,
  onSelect,
  selectId,
}: ModelPageVariantBarProps) {
  return (
    <section className="border-b border-border/60 bg-background/95 py-5 sm:py-6">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.2em] mb-1">Select variant</p>
            <p className="text-sm text-muted-foreground">
              {productLabel} · {selectedVariantName}
            </p>
          </div>
          <div className="hidden sm:flex flex-wrap items-center gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelect(v.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${
                  selectedId === v.id
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground border-border/80 hover:bg-muted"
                }`}
              >
                {v.shortLabel}
              </button>
            ))}
          </div>
          <div className="sm:hidden">
            <label htmlFor={selectId} className="sr-only">
              Select variant
            </label>
            <select
              id={selectId}
              value={selectedId}
              onChange={(e) => onSelect(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"
            >
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

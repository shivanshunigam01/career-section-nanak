import {
  COMPARE_MODEL_ORDER,
  compareModels,
  type CompareModelKey,
  type CatalogVariant,
} from "@/data/compareCatalog";
import {
  FESTIVE_PRICE_DEFAULTS,
  isFestivePricingSlug,
  parseIndianVehiclePriceToRupees,
} from "@/lib/festivePricing";

export type TcoVehicleOption = {
  id: string;
  modelKey: CompareModelKey;
  variantId: string;
  modelName: string;
  variantLabel: string;
  fullLabel: string;
  image: string;
  route: string;
  priceRupees: number;
  priceDisplay: string;
  /** True when price is taken from the dealer compare catalog / festive campaign table. */
  priceFromCatalog: boolean;
  batteryKwh: number | null;
  rangeKm: number | null;
  /** Derived from battery ÷ MIDC range when both parse; otherwise null (user must confirm). */
  efficiencyKwhPer100Km: number | null;
  efficiencyDerived: boolean;
  festiveListPrice?: string;
  festiveOfferPrice?: string;
};

function parseBatteryKwh(raw: string | undefined): number | null {
  if (!raw) return null;
  const m = raw.match(/([\d.]+)\s*kwh/i);
  if (!m) return null;
  const n = Number.parseFloat(m[1]);
  return Number.isFinite(n) ? n : null;
}

function parseRangeKm(raw: string | undefined): number | null {
  if (!raw) return null;
  const m = raw.match(/([\d]+)\s*km/i);
  if (!m) return null;
  const n = Number.parseInt(m[1], 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function deriveEfficiency(batteryKwh: number | null, rangeKm: number | null): number | null {
  if (batteryKwh == null || rangeKm == null || rangeKm <= 0) return null;
  return (batteryKwh / rangeKm) * 100;
}

function resolveVariantPrice(modelKey: CompareModelKey, variant: CatalogVariant): {
  rupees: number;
  display: string;
  fromCatalog: boolean;
} {
  const raw = variant.specs.ex_showroom ?? variant.price;
  let display = raw.trim();
  let rupees = parseIndianVehiclePriceToRupees(display);

  if (isFestivePricingSlug(modelKey)) {
    const festive = FESTIVE_PRICE_DEFAULTS[modelKey];
    display = festive.offer;
    rupees = parseIndianVehiclePriceToRupees(festive.offer) ?? rupees;
    return { rupees: rupees ?? 0, display, fromCatalog: true };
  }

  return {
    rupees: rupees ?? 0,
    display,
    fromCatalog: Boolean(rupees),
  };
}

export function buildTcoVehicleCatalog(): TcoVehicleOption[] {
  const options: TcoVehicleOption[] = [];

  for (const modelKey of COMPARE_MODEL_ORDER) {
    const model = compareModels[modelKey];
    const festive = isFestivePricingSlug(modelKey) ? FESTIVE_PRICE_DEFAULTS[modelKey] : null;

    for (const variant of model.variants) {
      const { rupees, display, fromCatalog } = resolveVariantPrice(modelKey, variant);
      const batteryKwh = parseBatteryKwh(variant.specs.battery);
      const rangeKm = parseRangeKm(variant.specs.range_midc);
      const efficiency = deriveEfficiency(batteryKwh, rangeKm);

      options.push({
        id: `${modelKey}:${variant.id}`,
        modelKey,
        variantId: variant.id,
        modelName: model.name,
        variantLabel: variant.label,
        fullLabel: variant.label ? `${model.name} ${variant.label}` : model.name,
        image: model.image,
        route: model.route,
        priceRupees: rupees,
        priceDisplay: display,
        priceFromCatalog: fromCatalog,
        batteryKwh,
        rangeKm,
        efficiencyKwhPer100Km: efficiency,
        efficiencyDerived: efficiency != null,
        festiveListPrice: festive?.list,
        festiveOfferPrice: festive?.offer,
      });
    }
  }

  return options;
}

export const TCO_VEHICLE_OPTIONS = buildTcoVehicleCatalog();

export function findTcoVehicle(id: string): TcoVehicleOption | undefined {
  return TCO_VEHICLE_OPTIONS.find((v) => v.id === id);
}

export function modelBaseNameFromKey(key: CompareModelKey): string {
  const map: Record<CompareModelKey, string> = {
    vf6: "VF 6",
    vf7: "VF 7",
    mpv7: "VF MPV 7",
    "limo-green": "Limo Green",
  };
  return map[key];
}

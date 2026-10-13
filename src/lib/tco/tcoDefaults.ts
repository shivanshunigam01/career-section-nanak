/**
 * Configurable planning assumptions for the Total Cost of Ownership calculator.
 * All values are estimates — confirm on-road price, tariffs, and insurance with the dealership.
 */

export const TCO_OWNERSHIP_YEAR_OPTIONS = [3, 5, 7, 10] as const;

export const TCO_DEFAULTS = {
  ownershipYears: 5,
  monthlyKm: 1200,
  monthlyKmMin: 200,
  monthlyKmMax: 5000,
  petrolMileageKmPerLitre: 12,
  petrolPricePerLitre: 105,
  homeChargingPercent: 80,
  publicChargingPercent: 20,
  homeTariffPerKwh: 8,
  publicTariffPerKwh: 18,
  /** Used when model efficiency cannot be derived from catalog specs. */
  fallbackEvEfficiencyKwhPer100Km: 18,
  petrolComparisonPrice: 2_000_000,
  evInsuranceAnnual: 28_000,
  petrolInsuranceAnnual: 24_000,
  evMaintenanceAnnual: 15_000,
  petrolMaintenanceAnnual: 28_000,
  /** Residual value as % of indicative ex-showroom at end of ownership (user-adjustable). */
  evResalePercent: 45,
  petrolResalePercent: 38,
  batterySubscriptionMonthly: 0,
  otherEvAnnual: 0,
  otherPetrolAnnual: 0,
} as const;

export const PETROL_COMPARISON_PRESETS = [
  {
    id: "midsize-suv",
    label: "Mid-size petrol SUV (planning assumption)",
    purchasePrice: 2_000_000,
    mileageKmPerLitre: 12,
  },
  {
    id: "compact-suv",
    label: "Compact petrol SUV (planning assumption)",
    purchasePrice: 1_600_000,
    mileageKmPerLitre: 14,
  },
  {
    id: "premium-suv",
    label: "Premium petrol SUV (planning assumption)",
    purchasePrice: 2_800_000,
    mileageKmPerLitre: 11,
  },
] as const;

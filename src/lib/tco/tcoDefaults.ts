/**
 * Configurable planning assumptions for the Total Cost of Ownership calculator.
 * All values are estimates — confirm on-road price, tariffs, and insurance with the dealership.
 */

export const TCO_OWNERSHIP_YEAR_OPTIONS = [3, 5, 7, 10] as const;

export type TcoDefaultsConfig = {
  ownershipYears: number;
  monthlyKm: number;
  monthlyKmMin: number;
  monthlyKmMax: number;
  petrolMileageKmPerLitre: number;
  petrolPricePerLitre: number;
  homeChargingPercent: number;
  publicChargingPercent: number;
  homeTariffPerKwh: number;
  publicTariffPerKwh: number;
  fallbackEvEfficiencyKwhPer100Km: number;
  petrolComparisonPrice: number;
  evInsuranceAnnual: number;
  petrolInsuranceAnnual: number;
  evMaintenanceAnnual: number;
  petrolMaintenanceAnnual: number;
  evResalePercent: number;
  petrolResalePercent: number;
  batterySubscriptionMonthly: number;
  otherEvAnnual: number;
  otherPetrolAnnual: number;
};

/** Plain `number` fields so React state setters are not narrowed to literals. */
export const TCO_DEFAULTS: TcoDefaultsConfig = {
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
  fallbackEvEfficiencyKwhPer100Km: 18,
  petrolComparisonPrice: 2_000_000,
  evInsuranceAnnual: 28_000,
  petrolInsuranceAnnual: 24_000,
  evMaintenanceAnnual: 15_000,
  petrolMaintenanceAnnual: 28_000,
  evResalePercent: 45,
  petrolResalePercent: 38,
  batterySubscriptionMonthly: 0,
  otherEvAnnual: 0,
  otherPetrolAnnual: 0,
};

export type PetrolComparisonPreset = {
  id: string;
  label: string;
  purchasePrice: number;
  mileageKmPerLitre: number;
};

export const PETROL_COMPARISON_PRESETS: PetrolComparisonPreset[] = [
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
];

export interface TcoInputs {
  ownershipYears: number;
  monthlyKm: number;
  petrolMileageKmPerLitre: number;
  petrolPricePerLitre: number;
  homeChargingPercent: number;
  publicChargingPercent: number;
  homeTariffPerKwh: number;
  publicTariffPerKwh: number;
  evEfficiencyKwhPer100Km: number;
  evPurchasePrice: number;
  petrolPurchasePrice: number;
  evInsuranceAnnual: number;
  petrolInsuranceAnnual: number;
  evMaintenanceAnnual: number;
  petrolMaintenanceAnnual: number;
  evResaleValue: number;
  petrolResaleValue: number;
  batterySubscriptionMonthly: number;
  otherEvAnnual: number;
  otherPetrolAnnual: number;
}

export interface VehicleCostBreakdown {
  purchase: number;
  fuelOrEnergy: number;
  homeChargingCost: number;
  publicChargingCost: number;
  insurance: number;
  maintenance: number;
  batterySubscription: number;
  other: number;
  resaleValue: number;
  totalTco: number;
  costPerKmEnergy: number;
  costPerKmAllIn: number;
}

export interface TcoResult {
  totalKm: number;
  petrol: VehicleCostBreakdown;
  ev: VehicleCostBreakdown;
  /** petrol TCO − EV TCO; positive means EV is cheaper under these assumptions. */
  savings: number;
  annualSavings: number;
  petrolLitres: number;
  evEnergyKwh: number;
}

export type TcoFieldError = { field: keyof TcoInputs | "chargingSplit"; message: string };

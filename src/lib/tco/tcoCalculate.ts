/**
 * Total Cost of Ownership (TCO) — planning estimates for VinFast EV vs petrol ICE.
 *
 * Formulas (ownership period):
 *   totalKm = monthlyKm × 12 × ownershipYears
 *
 * Petrol:
 *   petrolLitres = totalKm / petrolMileageKmPerLitre
 *   petrolFuelCost = petrolLitres × petrolPricePerLitre
 *
 * EV (efficiency in kWh/100 km):
 *   evEnergyKwh = totalKm × evEfficiencyKwhPer100Km / 100
 *   homeChargingCost = evEnergyKwh × (homeCharging% / 100) × homeTariffPerKwh
 *   publicChargingCost = evEnergyKwh × (publicCharging% / 100) × publicTariffPerKwh
 *
 * Per vehicle:
 *   totalTCO = purchase + energy/fuel + insurance + maintenance + batterySub + other − resale
 *
 * savings = petrolTCO − evTCO (not clamped — negative means EV costs more under your inputs)
 */

import type { TcoInputs, TcoResult, VehicleCostBreakdown } from "./tcoTypes";
import { validateTcoInputs } from "./tcoValidation";

function buildBreakdown(params: {
  purchase: number;
  fuelOrEnergy: number;
  homeChargingCost: number;
  publicChargingCost: number;
  insuranceAnnual: number;
  maintenanceAnnual: number;
  batterySubscriptionMonthly: number;
  otherAnnual: number;
  resaleValue: number;
  years: number;
  totalKm: number;
}): VehicleCostBreakdown {
  const years = params.years;
  const insurance = params.insuranceAnnual * years;
  const maintenance = params.maintenanceAnnual * years;
  const batterySubscription = params.batterySubscriptionMonthly * 12 * years;
  const other = params.otherAnnual * years;
  const totalTco =
    params.purchase +
    params.fuelOrEnergy +
    insurance +
    maintenance +
    batterySubscription +
    other -
    params.resaleValue;

  const costPerKmEnergy = params.totalKm > 0 ? params.fuelOrEnergy / params.totalKm : 0;
  const runningExPurchase =
    params.fuelOrEnergy + insurance + maintenance + batterySubscription + other;
  const costPerKmAllIn = params.totalKm > 0 ? runningExPurchase / params.totalKm : 0;

  return {
    purchase: params.purchase,
    fuelOrEnergy: params.fuelOrEnergy,
    homeChargingCost: params.homeChargingCost,
    publicChargingCost: params.publicChargingCost,
    insurance,
    maintenance,
    batterySubscription,
    other,
    resaleValue: params.resaleValue,
    totalTco,
    costPerKmEnergy,
    costPerKmAllIn,
  };
}

export function calculateTco(input: TcoInputs): TcoResult | null {
  if (validateTcoInputs(input).length > 0) return null;

  const years = input.ownershipYears;
  const totalKm = input.monthlyKm * 12 * years;

  const petrolLitres = totalKm / input.petrolMileageKmPerLitre;
  const petrolFuelCost = petrolLitres * input.petrolPricePerLitre;

  const evEnergyKwh = (totalKm * input.evEfficiencyKwhPer100Km) / 100;
  const homeChargingCost =
    evEnergyKwh * (input.homeChargingPercent / 100) * input.homeTariffPerKwh;
  const publicChargingCost =
    evEnergyKwh * (input.publicChargingPercent / 100) * input.publicTariffPerKwh;
  const evChargingCost = homeChargingCost + publicChargingCost;

  const petrol = buildBreakdown({
    purchase: input.petrolPurchasePrice,
    fuelOrEnergy: petrolFuelCost,
    homeChargingCost: 0,
    publicChargingCost: 0,
    insuranceAnnual: input.petrolInsuranceAnnual,
    maintenanceAnnual: input.petrolMaintenanceAnnual,
    batterySubscriptionMonthly: 0,
    otherAnnual: input.otherPetrolAnnual,
    resaleValue: input.petrolResaleValue,
    years,
    totalKm,
  });

  const ev = buildBreakdown({
    purchase: input.evPurchasePrice,
    fuelOrEnergy: evChargingCost,
    homeChargingCost,
    publicChargingCost,
    insuranceAnnual: input.evInsuranceAnnual,
    maintenanceAnnual: input.evMaintenanceAnnual,
    batterySubscriptionMonthly: input.batterySubscriptionMonthly,
    otherAnnual: input.otherEvAnnual,
    resaleValue: input.evResaleValue,
    years,
    totalKm,
  });

  const savings = petrol.totalTco - ev.totalTco;
  const annualSavings = years > 0 ? savings / years : 0;

  return {
    totalKm,
    petrol,
    ev,
    savings,
    annualSavings,
    petrolLitres,
    evEnergyKwh,
  };
}

/** Sync public charging % when home % changes (keeps total at 100). */
export function homeChargingPercentToPublic(homePercent: number): number {
  return Math.max(0, Math.min(100, 100 - homePercent));
}

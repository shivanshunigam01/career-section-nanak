import { describe, expect, it } from "vitest";
import { calculateTco, homeChargingPercentToPublic } from "@/lib/tco/tcoCalculate";
import { TCO_DEFAULTS } from "@/lib/tco/tcoDefaults";
import type { TcoInputs } from "@/lib/tco/tcoTypes";
import { validateTcoInputs } from "@/lib/tco/tcoValidation";

function baseInput(overrides: Partial<TcoInputs> = {}): TcoInputs {
  return {
    ownershipYears: TCO_DEFAULTS.ownershipYears,
    monthlyKm: TCO_DEFAULTS.monthlyKm,
    petrolMileageKmPerLitre: TCO_DEFAULTS.petrolMileageKmPerLitre,
    petrolPricePerLitre: TCO_DEFAULTS.petrolPricePerLitre,
    homeChargingPercent: TCO_DEFAULTS.homeChargingPercent,
    publicChargingPercent: TCO_DEFAULTS.publicChargingPercent,
    homeTariffPerKwh: TCO_DEFAULTS.homeTariffPerKwh,
    publicTariffPerKwh: TCO_DEFAULTS.publicTariffPerKwh,
    evEfficiencyKwhPer100Km: 14,
    evPurchasePrice: 2_299_000,
    petrolPurchasePrice: 2_000_000,
    evInsuranceAnnual: TCO_DEFAULTS.evInsuranceAnnual,
    petrolInsuranceAnnual: TCO_DEFAULTS.petrolInsuranceAnnual,
    evMaintenanceAnnual: TCO_DEFAULTS.evMaintenanceAnnual,
    petrolMaintenanceAnnual: TCO_DEFAULTS.petrolMaintenanceAnnual,
    evResaleValue: 1_000_000,
    petrolResaleValue: 760_000,
    batterySubscriptionMonthly: 0,
    otherEvAnnual: 0,
    otherPetrolAnnual: 0,
    ...overrides,
  };
}

describe("calculateTco", () => {
  it("computes distance and petrol fuel cost", () => {
    const result = calculateTco(
      baseInput({
        ownershipYears: 5,
        monthlyKm: 1000,
        petrolMileageKmPerLitre: 10,
        petrolPricePerLitre: 100,
        evEfficiencyKwhPer100Km: 20,
        homeChargingPercent: 100,
        publicChargingPercent: 0,
        homeTariffPerKwh: 10,
        evResaleValue: 0,
        petrolResaleValue: 0,
        evInsuranceAnnual: 0,
        petrolInsuranceAnnual: 0,
        evMaintenanceAnnual: 0,
        petrolMaintenanceAnnual: 0,
      }),
    );
    expect(result).not.toBeNull();
    expect(result!.totalKm).toBe(60_000);
    expect(result!.petrolLitres).toBe(6_000);
    expect(result!.petrol.fuelOrEnergy).toBe(600_000);
    expect(result!.evEnergyKwh).toBe(12_000);
    expect(result!.ev.fuelOrEnergy).toBe(120_000);
  });

  it("splits EV charging between home and public tariffs", () => {
    const result = calculateTco(
      baseInput({
        ownershipYears: 1,
        monthlyKm: 1000,
        evEfficiencyKwhPer100Km: 10,
        homeChargingPercent: 70,
        publicChargingPercent: 30,
        homeTariffPerKwh: 8,
        publicTariffPerKwh: 20,
        evResaleValue: 0,
        petrolResaleValue: 0,
        evInsuranceAnnual: 0,
        petrolInsuranceAnnual: 0,
        evMaintenanceAnnual: 0,
        petrolMaintenanceAnnual: 0,
        petrolPurchasePrice: 1,
        evPurchasePrice: 1,
      }),
    );
    expect(result).not.toBeNull();
    const kwh = 1_200;
    expect(result!.ev.homeChargingCost).toBeCloseTo(kwh * 0.7 * 8, 5);
    expect(result!.ev.publicChargingCost).toBeCloseTo(kwh * 0.3 * 20, 5);
    expect(result!.ev.fuelOrEnergy).toBeCloseTo(result!.ev.homeChargingCost + result!.ev.publicChargingCost, 5);
  });

  it("returns null when charging split is invalid", () => {
    expect(calculateTco(baseInput({ homeChargingPercent: 60, publicChargingPercent: 30 }))).toBeNull();
  });

  it("allows negative savings when EV is more expensive", () => {
    const result = calculateTco(
      baseInput({
        evPurchasePrice: 5_000_000,
        petrolPurchasePrice: 1_000_000,
        evEfficiencyKwhPer100Km: 25,
        publicTariffPerKwh: 30,
        homeChargingPercent: 0,
        publicChargingPercent: 100,
      }),
    );
    expect(result).not.toBeNull();
    expect(result!.savings).toBeLessThan(0);
  });

  it("guards division by zero on mileage", () => {
    expect(validateTcoInputs(baseInput({ petrolMileageKmPerLitre: 0 })).length).toBeGreaterThan(0);
  });
});

describe("homeChargingPercentToPublic", () => {
  it("complements to 100", () => {
    expect(homeChargingPercentToPublic(80)).toBe(20);
    expect(homeChargingPercentToPublic(100)).toBe(0);
  });
});

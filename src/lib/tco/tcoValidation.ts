import type { TcoFieldError, TcoInputs } from "./tcoTypes";

const POSITIVE_FIELDS: (keyof TcoInputs)[] = [
  "ownershipYears",
  "monthlyKm",
  "petrolMileageKmPerLitre",
  "petrolPricePerLitre",
  "homeTariffPerKwh",
  "publicTariffPerKwh",
  "evEfficiencyKwhPer100Km",
  "evPurchasePrice",
  "petrolPurchasePrice",
];

export function validateTcoInputs(input: TcoInputs): TcoFieldError[] {
  const errors: TcoFieldError[] = [];

  for (const key of POSITIVE_FIELDS) {
    const v = input[key];
    if (!Number.isFinite(v) || v <= 0) {
      errors.push({ field: key, message: "Enter a value greater than zero." });
    }
  }

  if (
    !Number.isFinite(input.homeChargingPercent) ||
    !Number.isFinite(input.publicChargingPercent) ||
    input.homeChargingPercent < 0 ||
    input.publicChargingPercent < 0
  ) {
    errors.push({ field: "chargingSplit", message: "Charging split cannot be negative." });
  } else if (Math.round(input.homeChargingPercent + input.publicChargingPercent) !== 100) {
    errors.push({
      field: "chargingSplit",
      message: "Home and public charging must add up to 100%.",
    });
  }

  const nonNegative: (keyof TcoInputs)[] = [
    "evInsuranceAnnual",
    "petrolInsuranceAnnual",
    "evMaintenanceAnnual",
    "petrolMaintenanceAnnual",
    "evResaleValue",
    "petrolResaleValue",
    "batterySubscriptionMonthly",
    "otherEvAnnual",
    "otherPetrolAnnual",
  ];
  for (const key of nonNegative) {
    const v = input[key];
    if (!Number.isFinite(v) || v < 0) {
      errors.push({ field: key, message: "Cannot be negative." });
    }
  }

  return errors;
}

export function isTcoInputValid(input: TcoInputs): boolean {
  return validateTcoInputs(input).length === 0;
}

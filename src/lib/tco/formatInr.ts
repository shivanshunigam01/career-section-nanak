/** Indian locale currency formatting (integer rupees). */
export function formatInr(amount: number): string {
  const n = Math.round(amount);
  return `₹${n.toLocaleString("en-IN")}`;
}

export function formatInrDecimal(amount: number, fractionDigits = 2): string {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

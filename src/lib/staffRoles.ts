export const STAFF_DESIGNATIONS = [
  "sales_executive",
  "sales_manager",
  "branch_manager",
  "gm",
  "ceo",
  "md",
] as const;

export type StaffDesignation = (typeof STAFF_DESIGNATIONS)[number];

export const DESIGNATION_LABELS: Record<StaffDesignation, string> = {
  sales_executive: "Sales Executive",
  sales_manager: "Sales Manager",
  branch_manager: "Branch Manager",
  gm: "GM",
  ceo: "CEO",
  md: "MD",
};

export function designationLabel(designation?: string | null) {
  if (!designation) return "Staff";
  return DESIGNATION_LABELS[designation as StaffDesignation] || designation;
}

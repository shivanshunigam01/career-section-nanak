import { useMemo } from "react";
import {
  VF6_VARIANT_OPTIONS,
  VF7_VARIANT_OPTIONS,
  encodeModelTrim,
  decodeModelTrim,
  MODEL_TRIM_COMBO_BOTH,
} from "@/data/vinfastModels";

type Props = {
  id?: string;
  model: string;
  variant: string;
  onChange: (model: string, variant: string) => void;
  className?: string;
  /** Contact: “Not sure — VF 6 or VF 7” */
  includeNotSureBoth?: boolean;
};

export function ModelTrimSelect({
  id,
  model,
  variant,
  onChange,
  className,
  includeNotSureBoth,
}: Props) {
  const optionValues = useMemo(() => {
    const set = new Set<string>();
    if (includeNotSureBoth) set.add(MODEL_TRIM_COMBO_BOTH);
    VF7_VARIANT_OPTIONS.forEach((l) => set.add(encodeModelTrim("VF 7", l)));
    VF6_VARIANT_OPTIONS.forEach((l) => set.add(encodeModelTrim("VF 6", l)));
    return set;
  }, [includeNotSureBoth]);

  const encoded = encodeModelTrim(model, variant);
  const value = optionValues.has(encoded)
    ? encoded
    : model === "Both"
      ? MODEL_TRIM_COMBO_BOTH
      : model === "VF 6"
        ? encodeModelTrim("VF 6", VF6_VARIANT_OPTIONS[0])
        : encodeModelTrim("VF 7", VF7_VARIANT_OPTIONS[0]);

  return (
    <select
      id={id}
      value={value}
      onChange={(e) => {
        const next = decodeModelTrim(e.target.value);
        onChange(next.model, next.variant);
      }}
      className={className}
    >
      {includeNotSureBoth && (
        <option value={MODEL_TRIM_COMBO_BOTH}>Not sure — VF 6 or VF 7</option>
      )}
      <optgroup label="VinFast VF 7">
        {VF7_VARIANT_OPTIONS.map((label) => (
          <option key={label} value={encodeModelTrim("VF 7", label)}>
            {label}
          </option>
        ))}
      </optgroup>
      <optgroup label="VinFast VF 6">
        {VF6_VARIANT_OPTIONS.map((label) => (
          <option key={label} value={encodeModelTrim("VF 6", label)}>
            {label}
          </option>
        ))}
      </optgroup>
    </select>
  );
}

import { useMemo } from "react";
import {
  VF6_VARIANT_OPTIONS,
  VF7_VARIANT_OPTIONS,
  MPV7_VARIANT_OPTIONS,
  DEFAULT_MPV7_TRIM,
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
  /** Contact: “Not sure — which model” */
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
    MPV7_VARIANT_OPTIONS.forEach((l) => set.add(encodeModelTrim("VF MPV 7", l)));
    return set;
  }, [includeNotSureBoth]);

  const encoded = encodeModelTrim(model, variant);
  const value = optionValues.has(encoded)
    ? encoded
    : model === "Both"
      ? MODEL_TRIM_COMBO_BOTH
      : model === "VF 6"
        ? encodeModelTrim("VF 6", VF6_VARIANT_OPTIONS[0])
        : model === "VF MPV 7"
          ? encodeModelTrim("VF MPV 7", DEFAULT_MPV7_TRIM)
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
        <option value={MODEL_TRIM_COMBO_BOTH}>Not sure — VF 6, VF 7, or VF MPV 7</option>
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
      <optgroup label="VinFast VF MPV 7">
        {MPV7_VARIANT_OPTIONS.map((label) => (
          <option key={label} value={encodeModelTrim("VF MPV 7", label)}>
            {label}
          </option>
        ))}
      </optgroup>
    </select>
  );
}

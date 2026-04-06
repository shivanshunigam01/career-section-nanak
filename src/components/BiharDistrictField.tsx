import { BIHAR_DISTRICTS, DISTRICT_OTHER } from "@/data/biharDistricts";

type Props = {
  id?: string;
  label?: string;
  selectClassName: string;
  otherInputClassName?: string;
  value: string;
  otherValue: string;
  onDistrictChange: (district: string) => void;
  onOtherChange: (detail: string) => void;
  disabled?: boolean;
};

/**
 * District dropdown (all Bihar districts) + optional free text when "Other (outside Bihar)".
 * Stored field names elsewhere remain `city` / `otherCity` for API compatibility.
 */
export function BiharDistrictField({
  id,
  label,
  selectClassName,
  otherInputClassName,
  value,
  otherValue,
  onDistrictChange,
  onOtherChange,
  disabled,
}: Props) {
  const otherClass = otherInputClassName ?? selectClassName;

  return (
    <div className="flex min-w-0 w-full flex-col gap-2">
      {label ? (
        <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
          {label}
        </label>
      ) : null}
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const v = e.target.value;
          onDistrictChange(v);
          if (v !== DISTRICT_OTHER) onOtherChange("");
        }}
        className={selectClassName}
        aria-label={label ? undefined : "District (Bihar)"}
      >
        {BIHAR_DISTRICTS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
        <option value={DISTRICT_OTHER}>Other (outside Bihar)</option>
      </select>
      {value === DISTRICT_OTHER && (
        <input
          type="text"
          placeholder="City / state / district"
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
          className={otherClass}
          autoFocus
        />
      )}
    </div>
  );
}

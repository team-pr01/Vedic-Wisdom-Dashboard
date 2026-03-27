/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface DropdownProps {
  label: string;
  options: {
    label: string;
    value: string;
  }[];
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  isRequired?: boolean;
  selected?: boolean;
  isDisabled?: boolean;
  value?: string;
  onChange?: any;
  onChangeEvent?: any;
}

const SelectDropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  (
    {
      label,
      options,
      error,
      isRequired = true,
      isDisabled,
      value,
      onChange,
      onChangeEvent,
      ...rest
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e);
      onChangeEvent?.(e.target.value);
    };

    return (
      <div className="flex flex-col gap-2 font-Inter w-full cursor-pointer">
        {label && (
          <label className="flex flex-row items-center w-full justify-between text-neutral-65 cursor-pointer">
            <span className="text-neutral-20 leading-[18px] text-[15px] font-medium tracking-[-0.16] ">
              {label}{" "}
              <span className="text-primary-10">{isRequired ? "*" : ""}</span>
            </span>
          </label>
        )}
        <select
          ref={ref}
          disabled={isDisabled}
          value={value}
          required={isRequired}
          onChange={handleChange}
          className={`appearance-none relative block w-full px-4 py-3 border text-neutral-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10 focus:border-transparent font-Roboto transition-all duration-200 cursor-pointer ${
            isDisabled ? "cursor-not-allowed bg-neutral-50/20" : "bg-white"
          } ${error ? "border-red-500" : "border-neutral-50"}`}
          {...rest}
        >
          <option value="" disabled selected>
            Select {label}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option?.value} className="capitalize">
              {option?.label}
            </option>
          ))}
        </select>
        {error && typeof error.message === "string" && (
          <p className="text-xs text-red-500 mt-1">{error.message}</p>
        )}
      </div>
    );
  },
);

SelectDropdown.displayName = "SelectDropdown";

export default SelectDropdown;

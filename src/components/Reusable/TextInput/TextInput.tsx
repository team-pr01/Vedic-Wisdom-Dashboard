/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface TextInputProps {
  label?: string;
  name: string;
  placeholder?: string;
  type?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: any;
  isDisabled?: boolean;
  isRequired?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      name,
      placeholder = "",
      type = "text",
      error,
      defaultValue,
      isDisabled = false,
      isRequired = true,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-2 font-Nunito w-full">
        {label && (
          <label
            htmlFor={name}
            className="flex flex-row items-center w-full justify-between text-neutral-65"
          >
            <span className="text-neutral-20 leading-[18px] text-[15px] font-medium tracking-[-0.16]">
              {label}{" "}
              <span className="text-primary-10">{isRequired ? "*" : ""}</span>
            </span>
          </label>
        )}
        <input
          // required={isRequired}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          ref={ref}
          disabled={isDisabled}
          onKeyDown={onKeyDown}
          className={`appearance-none relative block w-full px-4 py-3 border text-neutral-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10 focus:border-transparent font-Roboto transition-all duration-200 ${
            isDisabled ? "cursor-not-allowed bg-neutral-50/20" : "bg-white"
          } ${error ? "border-red-500" : "border-neutral-50"}`}
          {...rest}
        />
        {error?.message && (
          <span className="text-red-500 text-sm mt-1">
            {String(error.message)}
          </span>
        )}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";

export default TextInput;

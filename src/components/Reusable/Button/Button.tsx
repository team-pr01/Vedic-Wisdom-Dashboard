import { forwardRef, type ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "primary" | "secondary";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      variant = "primary",
      isLoading = false,
      fullWidth = false,
      className = "",
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "relative flex justify-center py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 font-Inter focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed";

    const variants = {
      primary:
        "text-white bg-gradient-primary hover:opacity-90 focus:ring-primary-10 border border-transparent",
      secondary:
        "text-neutral-20 bg-white border border-primary-10 hover:bg-neutral-50/10 focus:ring-primary-10",
    };

    const widthStyles = fullWidth ? "w-full" : "";

    const buttonStyles = twMerge(
      baseStyles,
      variants[variant],
      widthStyles,
      className,
    );

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={buttonStyles}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          label
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;

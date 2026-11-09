import type { ReactNode, RefObject } from "react";
import { useEffect, useRef } from "react";

export type TDropdownItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
};

type TDropdownMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  items: TDropdownItem[];
  align?: "left" | "right";
  width?: string; // e.g., "w-48"
  className?: string;
  dropdownRef?: RefObject<HTMLDivElement | null>;
};

const DropdownMenu = ({
  isOpen,
  onClose,
  items,
  align = "right",
  width = "w-48",
  className = "",
  dropdownRef: externalRef,
}: TDropdownMenuProps) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = externalRef || internalRef;

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, ref]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={`absolute top-full mt-2 ${width} bg-white rounded-xl shadow-xl border border-neutral-50 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 ${
        align === "right" ? "right-0" : "left-0"
      } ${className}`}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            item.onClick();
            onClose(); // Auto-close on click
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
            item.variant === "danger"
              ? "text-red-600 hover:bg-red-50"
              : "text-neutral-70 hover:bg-primary-10/5 hover:text-primary-10"
          }`}
        >
          {item.icon && <span className="shrink-0">{item.icon}</span>}
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default DropdownMenu;
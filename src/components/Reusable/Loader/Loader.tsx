// Loader.tsx
import React from "react";

type LoaderProps = {
  size?: "sm" | "md" | "lg" | number; // preset sizes or custom pixel
  text?: string; // optional loading text
  className?: string; // extra styling if needed
};

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  text = "Loading...",
  className = "",
}) => {
  let dimension = "w-8 h-8"; // default md

  if (size === "sm") dimension = "w-4 h-4";
  else if (size === "lg") dimension = "w-12 h-12";
  else if (typeof size === "number") dimension = `${size}px ${size}px`;

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div
        className={`border-4 border-t-[var(--color-primary-10)] border-gray-200 rounded-full animate-spin ${dimension}`}
      ></div>
      <span className="text-[var(--color-primary-10)] font-semibold">{text}</span>
    </div>
  );
};

export default Loader;

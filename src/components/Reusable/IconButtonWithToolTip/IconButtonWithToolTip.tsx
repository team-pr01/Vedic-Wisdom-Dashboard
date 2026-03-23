import { useState } from "react";

interface IconButtonWithToolTipProps {
  Icon: React.ElementType;
  textColor?: string;
  onClick?: () => void;
  tooltip?: string;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  size?: number;
  className?: string;
}

const IconButtonWithToolTip = ({ 
  Icon, 
  textColor = "text-neutral-45", 
  onClick, 
  tooltip = "",
  tooltipPosition = "bottom",
  size = 16,
  className = ""
}: IconButtonWithToolTipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getTooltipPosition = () => {
    switch (tooltipPosition) {
      case "top":
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-2";
      default:
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
    }
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={onClick}
        className="p-1.5 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
      >
        <Icon size={size} className={`${textColor} transition-colors`} />
      </div>
      
      {showTooltip && tooltip && (
        <>
          <div
            className={`absolute z-50 px-2 py-1 text-xs font-medium text-neutral-10 bg-gray-300 rounded-md whitespace-nowrap ${getTooltipPosition()}`}
          >
            {tooltip}
          </div>
        </>
      )}
    </div>
  );
};

export default IconButtonWithToolTip;
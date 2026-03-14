import { FileX2, Inbox, SearchX, FolderOpen, AlertCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface NoDataProps {
  title?: string;
  message?: string;
  icon?: "file" | "inbox" | "search" | "folder" | "alert";
  iconSize?: number;
  className?: string;
  children?: React.ReactNode;
}

const NoData = ({ 
  title = "No Data Found",
  message = "There are no items to display at the moment.",
  icon = "file",
  iconSize = 48,
  className = "",
  children 
}: NoDataProps) => {
  
  const getIcon = () => {
    switch (icon) {
      case "file":
        return <FileX2 size={iconSize} className="text-primary-10" />;
      case "inbox":
        return <Inbox size={iconSize} className="text-primary-10" />;
      case "search":
        return <SearchX size={iconSize} className="text-primary-10" />;
      case "folder":
        return <FolderOpen size={iconSize} className="text-primary-10" />;
      case "alert":
        return <AlertCircle size={iconSize} className="text-primary-10" />;
      default:
        return <FileX2 size={iconSize} className="text-primary-10" />;
    }
  };

  return (
    <div className={twMerge(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      {/* Icon */}
      <div className="mb-4">
        {getIcon()}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-neutral-10 font-Inter mb-2">
        {title}
      </h3>

      {/* Message */}
      <p className="text-sm text-neutral-45 font-Roboto max-w-sm mb-6">
        {message}
      </p>

      {/* Optional Children (like a button to add new items) */}
      {children && (
        <div className="mt-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default NoData;
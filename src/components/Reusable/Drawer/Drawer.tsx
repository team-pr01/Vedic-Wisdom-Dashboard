import { X } from "lucide-react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

type TDrawerProps = {
  title?: string | ReactNode;
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  width?: string;
  direction?: "right" | "left" | "top" | "bottom"; // ✅ Added direction
};

const Drawer: React.FC<TDrawerProps> = ({
  title,
  isDrawerOpen,
  setIsDrawerOpen,
  children,
  width = "w-full sm:w-[400px] md:w-[450px]", // Default width for right/left
  direction = "right", // Default to right
}) => {
  // ✅ Dynamic classes based on direction
  const getDrawerClasses = () => {
    switch (direction) {
      case "left":
        return {
          panel: `fixed top-0 left-0 h-screen ${width}`,
          translate: isDrawerOpen ? "translate-x-0" : "-translate-x-full",
        };
      case "top":
        return {
          panel: `fixed top-0 left-0 w-full ${width.replace("w-", "h-")}`, // Convert width prop to height
          translate: isDrawerOpen ? "translate-y-0" : "-translate-y-full",
        };
      case "bottom":
        return {
          panel: `fixed bottom-0 left-0 w-full ${width.replace("w-", "h-")}`,
          translate: isDrawerOpen ? "translate-y-0" : "translate-y-full",
        };
      case "right":
      default:
        return {
          panel: `fixed top-0 right-0 h-screen ${width}`,
          translate: isDrawerOpen ? "translate-x-0" : "translate-x-full",
        };
    }
  };

  const styles = getDrawerClasses();

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-neutral-5/60 backdrop-blur-xs z-9998 transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`bg-white z-9999 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${styles.panel} ${styles.translate}`}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-neutral-50 shrink-0">
          <h2 className="text-lg font-semibold text-neutral-90 truncate pr-4">
            {title}
          </h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 rounded-full hover:bg-neutral-50 transition-colors text-neutral-45 hover:text-neutral-90 shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
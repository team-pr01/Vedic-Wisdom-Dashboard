import { X } from "lucide-react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

type TDrawerProps = {
  title?: string | ReactNode;
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  width?: string;
};

const Drawer: React.FC<TDrawerProps> = ({
  title,
  isDrawerOpen,
  setIsDrawerOpen,
  children,
  width = "w-full sm:w-[400px] md:w-[450px]", // Default width for drawer
}) => {
  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-neutral-5/60 backdrop-blur-xs z-[9998] transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-screen bg-white z-[9999] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${width} ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-neutral-50">
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
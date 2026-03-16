import { Play, Pause, Clock, Music, Trash2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface AudioTrackCardProps {
  title?: string;
  duration?: string;
  artist?: string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onDelete?: () => void;
  className?: string;
  variant?: "default" | "compact" | "featured";
}

const AudioTrackCard = ({
  title = "Untitled Track",
  duration = "3:45",
  isPlaying = false,
  onPlayPause,
  onDelete,
  className = "",
  variant = "default",
}: AudioTrackCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "compact":
        return "p-3";
      case "featured":
        return "p-6 flex-row items-center";
      default:
        return "p-4";
    }
  };

  return (
    <div
      className={twMerge(
        "group relative bg-white rounded-lg border border-neutral-50 hover:border-primary-10/30 hover:shadow-lg transition-all duration-300 overflow-hidden",
        getVariantStyles(),
        className,
      )}
    >
      <div className="flex items-center space-x-4">
        {/* Icon */}
        <Music
          size={variant === "compact" ? 20 : variant === "featured" ? 32 : 24}
          className="text-primary-10"
        />

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-neutral-10 font-Inter truncate text-sm">
              {title}
            </h3>

            {/* Duration */}
            <div className="flex items-center space-x-1 text-neutral-45 ml-2">
              <Clock size={variant === "compact" ? 12 : 14} />
              <span
                className={twMerge(
                  "font-Roboto",
                  variant === "compact" ? "text-xs" : "text-sm",
                )}
              >
                {duration}
              </span>
            </div>
          </div>
        </div>

        {/* Play / Pause */}
        <button onClick={onPlayPause}>
          <div
            className={twMerge(
              "w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 cursor-pointer",
              isPlaying
                ? "bg-gradient-primary text-white"
                : "bg-white text-primary-10"
            )}
          >
            {isPlaying ? (
              <Pause size={16} fill="currentColor" />
            ) : (
              <Play size={16} fill="currentColor" className="ml-0.5" />
            )}
          </div>
        </button>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-600 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default AudioTrackCard;
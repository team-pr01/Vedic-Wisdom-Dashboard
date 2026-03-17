import { Play, Pause, Clock, Music, Trash2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import type { TAudioTrack } from "../../../types/audioTrack.types";
import { useDeleteAudioTrackMutation } from "../../../redux/Features/AudioTracks/audioTracksApi";
import toast from "react-hot-toast";

type TAudioTrackCardProps = {
  track: TAudioTrack;
};

const AudioTrackCard = ({ track }: TAudioTrackCardProps) => {
  const { _id, title, duration } = track;

  const isPlaying = false;

  const [deleteAudioTrack, {isLoading}] = useDeleteAudioTrackMutation();

  const handleDeleteAudioTrack = async () => {
    try {
      await toast.promise(deleteAudioTrack(_id).unwrap(), {
        loading: "Loading...",
        success: "Audio track deleted successfully!",
        error: "Failed to delete audio track. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting audio track:", err);
    }
  };

  return (
    <div
      className={twMerge(
        "group relative bg-white rounded-lg border border-neutral-50 hover:border-primary-10/30 hover:shadow-lg transition-all duration-300 overflow-hidden p-3",
      )}
    >
      <div className="flex items-center space-x-4">
        {/* Icon */}
        <Music size={24} className="text-primary-10" />

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-neutral-10 font-Inter truncate text-sm">
              {title}
            </h3>

            {/* Duration */}
            <div className="flex items-center space-x-1 text-neutral-45 ml-2">
              <Clock size={14} />
              <span className={twMerge("font-Roboto text-sm")}>{duration}</span>
            </div>
          </div>
        </div>

        {/* Play / Pause */}
        <button>
          <div
            className={twMerge(
              "w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 cursor-pointer",
              isPlaying
                ? "bg-gradient-primary text-white"
                : "bg-white text-primary-10",
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
          onClick={handleDeleteAudioTrack}
          disabled={isLoading}
          className="text-red-500 hover:text-red-600 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default AudioTrackCard;

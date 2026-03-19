/* eslint-disable react-hooks/set-state-in-effect */
import { Play, Pause, Clock, Music, Trash2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import type { TAudioTrack } from "../../../types/audioTrack.types";
import { useDeleteAudioTrackMutation } from "../../../redux/Features/AudioTracks/audioTracksApi";
import toast from "react-hot-toast";
import { useRef, useState, useEffect } from "react";

type TAudioTrackCardProps = {
  track: TAudioTrack;
  onPlay?: (audioElement: HTMLAudioElement, trackId: string) => void;
  onPause?: () => void;
  isGloballyPlaying?: boolean;
  currentlyPlayingId?: string | null;
};

const AudioTrackCard = ({ 
  track, 
  onPlay,
  onPause,
  isGloballyPlaying = false,
  currentlyPlayingId = null 
}: TAudioTrackCardProps) => {
  const { _id, title, duration, url } = track;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [deleteAudioTrack, {isLoading}] = useDeleteAudioTrackMutation();

  // Check if this track is the one currently playing globally
  const isThisTrackPlaying = currentlyPlayingId === _id && isGloballyPlaying;

  // Update local playing state based on global state
  useEffect(() => {
    if (!isThisTrackPlaying) {
      setIsPlaying(false);
    }
  }, [isThisTrackPlaying]);

  const handlePlayPause = () => {
    if (!audioRef.current) {
      // Create audio element if it doesn't exist
      audioRef.current = new Audio(url);
      
      // Add ended event listener
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        if (onPause) onPause();
      });
    }

    if (isPlaying || isThisTrackPlaying) {
      // Pause current audio
      audioRef.current.pause();
      setIsPlaying(false);
      
      // Notify parent to clear global playing state
      if (onPause) {
        onPause();
      }
    } else {
      // If there's an onPlay callback, use it to handle global playback
      if (onPlay) {
        onPlay(audioRef.current, _id);
        // Don't set isPlaying here - it will be set by the useEffect when isThisTrackPlaying becomes true
      } else {
        // Fallback to local playback
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDeleteAudioTrack = async () => {
    // Stop audio if it's playing before deletion
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // Notify parent to clear global playing state if this track was playing
    if (isThisTrackPlaying && onPause) {
      onPause();
    }
    
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

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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
        <button onClick={handlePlayPause}>
          <div
            className={twMerge(
              "w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 cursor-pointer",
              isPlaying || isThisTrackPlaying
                ? "bg-gradient-primary text-white"
                : "bg-white text-primary-10",
            )}
          >
            {isPlaying || isThisTrackPlaying ? (
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
          className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default AudioTrackCard;
/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "lucide-react";
import { useReactToMessageMutation } from "../../../redux/Features/Chat/messageApi";
import { useSelector } from "react-redux";
import {
  useCurrentUser,
  type TLoggedInUser,
} from "../../../redux/Features/Auth/authSlice";
import { useState, useEffect, useRef } from "react";

type TReaction = {
  emoji: string;
  userId: string | { _id: string; name: string; profilePicture?: string };
  userName: string;
};

interface MessageReactionsProps {
  messageId: string;
  reactions?: TReaction[];
  setActiveEmojiPickerId: React.Dispatch<React.SetStateAction<string | null>>;
}

const MessageReactions = ({
  messageId,
  reactions,
  setActiveEmojiPickerId,
}: MessageReactionsProps) => {
  const currentUser = useSelector(useCurrentUser) as TLoggedInUser;
  const [reactToMessage] = useReactToMessageMutation();

  // State to keep tooltip open on click
  const [activeReactionTooltip, setActiveReactionTooltip] = useState<
    string | null
  >(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close tooltip if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveReactionTooltip(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const groupedReactions = reactions?.reduce((acc: any, curr) => {
    if (!acc[curr.emoji]) {
      acc[curr.emoji] = {
        emoji: curr.emoji,
        count: 0,
        users: [],
      };
    }
    acc[curr.emoji].count += 1;
    acc[curr.emoji].users.push(curr);
    return acc;
  }, {});

  const handleRemoveReaction = async (emoji: string) => {
    try {
      const payload = {
        emoji: emoji,
        method: "remove",
      };
      await reactToMessage({ id: messageId, data: payload }).unwrap();
      setActiveEmojiPickerId(null);
      setActiveReactionTooltip(null); // Close tooltip after removal
    } catch (error) {
      console.error("Failed to remove reaction", error);
    }
  };

  if (!reactions || reactions.length === 0) return null;

  // ✅ Get unique emojis for the single pill display
  const uniqueEmojis = Object.values(groupedReactions).map((g: any) => g.emoji);

  // ✅ Calculate the TOTAL number of reactions
  const totalReactionsCount = reactions.length;

  // ✅ Check if the current user has reacted with ANY emoji to highlight the box
  const hasCurrentUserReacted = reactions.some(
    (r: any) =>
      String(typeof r.userId === "object" ? r.userId._id : r.userId) ===
      String(currentUser?._id),
  );

  return (
    <div className={`relative group/reaction`} ref={containerRef}>
      {/* ✅ SINGLE EMOJI PILL */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setActiveReactionTooltip(
            activeReactionTooltip === "main" ? null : "main",
          );
        }}
        className={`flex items-center justify-center gap-1 border shadow-sm rounded-full px-2 py-0.5 transition-colors cursor-pointer min-w-8.5 ${
          hasCurrentUserReacted
            ? "bg-primary-10/10 border-primary-10/30 hover:bg-primary-10/20"
            : "bg-white border-neutral-50 hover:bg-neutral-50"
        }`}
      >
        {/* Render the unique emojis inline with slight overlap if multiple */}
        <div className="flex items-center -space-x-1">
          {uniqueEmojis.slice(0, 5).map((emoji: any, idx: number) => (
            <span key={idx} className="text-xs">
              {emoji}
            </span>
          ))}
        </div>
        <span className={`text-[10px] font-medium ml-0.5 text-neutral-45`}>
          {totalReactionsCount}
        </span>
      </div>

      {/* ✅ Invisible bridge for hovering */}
      <div className="absolute bottom-full left-0 w-full h-3 bg-transparent group-hover/reaction:block hidden" />

      {/* ✅ Tooltip: Show if HOVERED or CLICKED */}
      <div
        className={`absolute bottom-full mb-2 left-20 -translate-x-1/2 flex-col bg-white border border-neutral-50 shadow-xl rounded-xl p-2 z-50 w-auto min-w-max ${
          activeReactionTooltip === "main"
            ? "flex"
            : "hidden group-hover/reaction:flex"
        }`}
      >
        {/* Flatten all users from all groups into a single list */}
        {Object.values(groupedReactions).flatMap((group: any) =>
          group.users.map((user: any, index: number) => {
            const isOwn =
              String(
                typeof user?.userId === "object"
                  ? user.userId._id
                  : user?.userId,
              ) === String(currentUser?._id);

            return (
              <div
                key={`${group.emoji}-${index}`}
                onClick={(e) => {
                  if (isOwn) {
                    e.stopPropagation();
                    handleRemoveReaction(group.emoji);
                  }
                }}
                className={`flex items-center gap-2 py-1 px-2 rounded-md transition-colors ${
                  isOwn
                    ? "hover:bg-red-50 cursor-pointer group/remove"
                    : "cursor-default"
                }`}
                title={isOwn ? "Click to remove your reaction" : ""}
              >
                {typeof user.userId === "object" &&
                user.userId?.profilePicture ? (
                  <img
                    src={user.userId.profilePicture}
                    alt={user.userName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary-10/10 flex items-center justify-center">
                    <User size={12} className="text-primary-10" />
                  </div>
                )}

                <div className="flex flex-col">
                  <span
                    className={`text-xs font-medium whitespace-nowrap ${
                      isOwn
                        ? "text-neutral-90 group-hover/remove:text-red-600"
                        : "text-neutral-90"
                    }`}
                  >
                    {user.userName}
                  </span>
                  {/* Show instruction only for the current user */}
                  {isOwn && (
                    <span className="text-[10px] text-neutral-40 group-hover/remove:text-red-500">
                      Tap to remove
                    </span>
                  )}
                </div>

                <span className="text-xs ml-3">{user.emoji}</span>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
};

export default MessageReactions;

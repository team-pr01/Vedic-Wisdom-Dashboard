/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCheck, User } from "lucide-react";
import {
  useMemo,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import GroupInfoCard from "./GroupInfoCard";

// --- TYPES ---
type TUser = {
  _id: string;
  name: string;
  profilePicture?: string;
};
type TMessage = {
  _id: string;
  text: string;
  sender: TUser | string;
  createdAt: string;
  readBy?: (string | { _id: string })[];
  isSystemMessage?: boolean;
};

type TSelectedChat = {
  _id: string;
  isGroup: boolean;
  otherUserId?: string | null;
};

type TGroupDetails = {
  groupName: string;
  members: any[];
};

type TMessagesProps = {
  selectedChat: TSelectedChat;
  messages: TMessage[];
  isLoading: boolean;
  currentUser: TUser | null;
  groupDetails: TGroupDetails | null;
  setIsViewMembersModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsAddGroupMemberModalOpen: Dispatch<SetStateAction<boolean>>;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  hasLeftGroup?: boolean;
};

// --- DATE HELPERS ---
const groupMessagesByDate = (messages: TMessage[]) => {
  const grouped: { [key: string]: TMessage[] } = {};

  messages.forEach((msg) => {
    const date = new Date(msg.createdAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let dateString = "";

    if (date.toDateString() === today.toDateString()) {
      dateString = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateString = "Yesterday";
    } else {
      // Format like "Monday, October 12"
      dateString = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }

    if (!grouped[dateString]) {
      grouped[dateString] = [];
    }
    grouped[dateString].push(msg);
  });

  return grouped;
};

const Messages = ({
  selectedChat,
  messages,
  isLoading,
  currentUser,
  groupDetails,
  setIsViewMembersModalOpen,
  setIsAddGroupMemberModalOpen,
  messagesEndRef,
  hasLeftGroup
}: TMessagesProps) => {
  const groupedMessages = useMemo(
    () => groupMessagesByDate(messages),
    [messages],
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-neutral-50/30">
      {selectedChat.isGroup && (
        <GroupInfoCard
          groupName={groupDetails?.groupName || ""}
          membersCount={groupDetails?.members?.length || 0}
          setIsViewMembersModalOpen={setIsViewMembersModalOpen}
          setIsAddGroupMemberModalOpen={setIsAddGroupMemberModalOpen}
          hasLeftGroup={hasLeftGroup}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="animate-pulse flex space-x-2 items-center">
            <div className="h-2 w-2 bg-primary-10/50 rounded-full"></div>
            <div className="h-2 w-2 bg-primary-10/70 rounded-full"></div>
            <div className="h-2 w-2 bg-primary-10 rounded-full"></div>
          </div>
        </div>
      ) : (
        Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
          <div key={dateLabel} className="space-y-4">
            {/* Date Divider */}
            <div className="flex items-center justify-center sticky top-0 z-10 py-2">
              <span className="text-xs font-medium text-neutral-20 bg-white px-3 py-1 rounded-lg border border-neutral-50/70">
                {dateLabel}
              </span>
            </div>

            {/* Messages for this date */}
            <div className="space-y-4">
              {msgs.map((msg: TMessage, idx: number) => {
                const isOwn =
                  msg.sender === currentUser?._id ||
                  (msg.sender as TUser)?._id === currentUser?._id;

                const isSystem =
                  msg.isSystemMessage ||
                  msg.text.includes("left the group") ||
                  msg.text.includes("joined the group");

                if (isSystem) {
                  // Extract the name for a nicer display
                  const senderName =
                    typeof msg.sender === "object" && msg.sender?.name
                      ? msg.sender.name
                      : "A user";

                  return (
                    <div
                      key={msg._id || idx}
                      className="flex justify-center my-4"
                    >
                      <div className="bg-white text-neutral-5/60 text-xs font-medium px-4 py-1.5 rounded-lg border border-[#F2E8D9] shadow-sm text-center">
                        {isOwn
                          ? msg.text.replace("User", "You")
                          : msg.text.replace("User", senderName)}
                      </div>
                    </div>
                  );
                }

                const senderInfo =
                  typeof msg.sender === "string" ? null : msg.sender;

                const isRead = msg.readBy?.some(
                  (id: any) =>
                    id === selectedChat.otherUserId ||
                    id?._id === selectedChat.otherUserId,
                );

                // Check if it's a group and someone else's message
                const showSenderInfo = selectedChat.isGroup && !isOwn;

                return (
                  <div
                    key={msg._id || idx}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"} gap-2`}
                  >
                    {/* Show avatar on the left for group messages from others */}
                    {showSenderInfo && (
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-10/10 shrink-0 mt-auto mb-1">
                        {senderInfo?.profilePicture ? (
                          <img
                            src={senderInfo.profilePicture}
                            alt={senderInfo.name || "User"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User
                            size={16}
                            className="text-primary-10 m-auto mt-2"
                          />
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isOwn
                          ? "bg-[#f2e4c9]/70 text-neutral-5 border border-neutral-5/10"
                          : "bg-white text-neutral-10 border border-neutral-50/60"
                      }`}
                    >
                      {/* Show Sender Name for group messages */}
                      {showSenderInfo && (
                        <p className="text-xs font-semibold text-primary-10 mb-1">
                          {senderInfo?.name || "Unknown User"}
                        </p>
                      )}

                      <p className="text-sm">{msg.text}</p>

                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span
                          className={`text-[10px] ${isOwn ? "text-neutral-5/70" : "text-neutral-45"}`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isOwn && (
                          <CheckCheck
                            size={12}
                            className={`transition-colors duration-300 ${
                              isRead ? "text-orange-500" : "text-neutral-20"
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;

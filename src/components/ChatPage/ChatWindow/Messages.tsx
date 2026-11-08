/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCheck, User } from "lucide-react";
import GroupInfoCard from "./GroupInfoCard";

const Messages = ({selectedChat, messages, isLoading, currentUser, groupDetails, setIsViewMembersModalOpen, setIsAddGroupMemberModalOpen, messagesEndRef}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/30">
      {selectedChat.isGroup && (
        <GroupInfoCard
          groupName={groupDetails?.groupName}
          membersCount={groupDetails?.members?.length || 0}
          setIsViewMembersModalOpen={setIsViewMembersModalOpen}
          setIsAddGroupMemberModalOpen={setIsAddGroupMemberModalOpen}
        />
      )}

      {isLoading ? (
        <p className="text-center text-sm text-neutral-45">
          Loading messages...
        </p>
      ) : (
        messages.map((msg: any, idx: number) => {
          const isOwn =
            msg.sender === currentUser?._id ||
            msg.sender?._id === currentUser?._id;
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
                  {msg.sender?.profilePicture ? (
                    <img
                      src={msg.sender.profilePicture}
                      alt={msg.sender.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={16} className="text-primary-10 m-auto mt-2" />
                  )}
                </div>
              )}

              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  isOwn
                    ? "bg-primary-10 text-white"
                    : "bg-white text-neutral-10 border border-neutral-50 shadow-sm"
                }`}
              >
                {/* Show Sender Name for group messages */}
                {showSenderInfo && (
                  <p className="text-xs font-semibold text-primary-10 mb-1">
                    {msg.sender?.name || "Unknown User"}
                  </p>
                )}

                <p className="text-sm">{msg.text}</p>

                <div className="flex items-center justify-end gap-1 mt-1">
                  <span
                    className={`text-[10px] ${isOwn ? "text-white/70" : "text-neutral-45"}`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isOwn && (
                    <CheckCheck
                      size={12}
                      className={isRead ? "text-blue-400" : "text-white/50"}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;

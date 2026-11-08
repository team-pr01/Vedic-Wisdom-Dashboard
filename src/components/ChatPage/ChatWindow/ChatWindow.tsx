/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { Send, User, CheckCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChat } from "../../../providers/ChatProvider";
import { useGetMessagesByConversationIdQuery } from "../../../redux/Features/Chat/messageApi";
import NoData from "../../Reusable/NoData/NoData";
import GroupInfoCard from "./GroupInfoCard";
import GroupMembersModal from "../GroupMembersModal/GroupMembersModal";

const ChatWindow = () => {
  const currentUser = useSelector((state: any) => state.auth.user);
  const { selectedChat, socket, messages, setMessages, typingUsers } =
    useChat();
  const [isViewMembersModalOpen, setIsViewMembersModalOpen] =
    useState<boolean>(false);

  const [newMessage, setNewMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any | null>(null);

  const { data: historyData, isLoading } = useGetMessagesByConversationIdQuery(
    selectedChat?.conversationId,
    { skip: !selectedChat },
  );

  const groupDetails = historyData?.data?.conversationDetails || {};
  console.log(groupDetails);

  useEffect(() => {
    if (historyData?.data?.messages) {
      setMessages(historyData?.data?.messages);
    }
  }, [historyData, setMessages]);

  useEffect(() => {
    if (socket && selectedChat && messages.length > 0) {
      socket.emit("messageRead", {
        conversationId: selectedChat.conversationId,
        userId: currentUser._id,
      });
    }
  }, [socket, selectedChat, currentUser._id, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!socket || !selectedChat) return;

    // Emit typing event
    socket.emit("typing", {
      conversationId: selectedChat.conversationId,
      userId: currentUser._id,
      userName: currentUser.name,
      isTyping: true,
    });

    // Clear previous timeout if user is still typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        conversationId: selectedChat.conversationId,
        userId: currentUser._id,
        userName: currentUser.name,
        isTyping: false,
      });
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !selectedChat) return;

    socket.emit("sendMessage", {
      conversationId: selectedChat.conversationId,
      senderId: currentUser._id,
      text: newMessage.trim(),
    });

    setNewMessage("");

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit("typing", {
      conversationId: selectedChat.conversationId,
      userId: currentUser._id,
      userName: currentUser.name,
      isTyping: false,
    });
  };

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full bg-neutral-50/30">
        <NoData
          title="No Chat Selected"
          message="Select a chat from the sidebar to start messaging."
        />
      </div>
    );
  }

  // console.log(selectedChat);
  // console.log(historyData);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-neutral-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary-10/10 flex items-center justify-center overflow-hidden">
              {selectedChat.avatar ? (
                <img
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={18} className="text-primary-10" />
              )}
            </div>
            {/* Only show online dot for 1-on-1 */}
            {!selectedChat.isGroup && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <p className="font-medium text-neutral-10">{selectedChat.name}</p>
            {!selectedChat.isGroup && (
              <p className="text-xs text-green-500">Online</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/30">
        {selectedChat.isGroup && (
          <GroupInfoCard
            groupName={groupDetails?.groupName}
            membersCount={groupDetails?.members?.length || 0}
            setIsViewMembersModalOpen={setIsViewMembersModalOpen}
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

            // ✅ Check if it's a group and someone else's message
            const showSenderInfo = selectedChat.isGroup && !isOwn;

            return (
              <div
                key={msg._id || idx}
                className={`flex ${isOwn ? "justify-end" : "justify-start"} gap-2`}
              >
                {/* ✅ Show avatar on the left for group messages from others */}
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
                  {/* ✅ Show Sender Name for group messages */}
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

      {/* Typing Indicator */}
      <div className="px-4 h-6 flex items-center">
        {typingUsers.length > 0 && (
          <>
            {!selectedChat.isGroup ? (
              // 1-on-1: Show Animated Bouncing Dots
              <div className="flex items-center gap-1 bg-neutral-100 px-3 py-1.5 rounded-full w-fit">
                <span className="w-1.5 h-1.5 bg-neutral-45 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-neutral-45 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-neutral-45 rounded-full animate-bounce" />
              </div>
            ) : (
              // Group: Show Text with Names
              <p className="text-xs text-primary-10 font-medium animate-pulse">
                {typingUsers.map((u) => u.userName).join(", ")}{" "}
                {typingUsers.length === 1 ? "is" : "are"} typing...
              </p>
            )}
          </>
        )}
      </div>
      {/* Input Area */}
      <div className="p-4 border-t border-neutral-50 bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message"
            className="flex-1 px-4 py-2 border border-neutral-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10 bg-neutral-50/50"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-primary-10 text-white rounded-lg hover:bg-primary-10/90 transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      <GroupMembersModal
        isModalOpen={isViewMembersModalOpen}
        setIsModalOpen={setIsViewMembersModalOpen}
        members={groupDetails?.members}
        admins={groupDetails?.admins}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatWindow;

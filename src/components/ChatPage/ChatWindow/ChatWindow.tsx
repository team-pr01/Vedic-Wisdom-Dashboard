/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { Send, User, CheckCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChat } from "../../../providers/ChatProvider";
import { useGetMessagesByConversationIdQuery } from "../../../redux/Features/Chat/messageApi";
import NoData from "../../Reusable/NoData/NoData";

const ChatWindow = () => {
  const currentUser = useSelector((state: any) => state.auth.user);
  const { selectedChat, socket, messages, setMessages } = useChat();
  
  const [newMessage, setNewMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: historyData, isLoading } = useGetMessagesByConversationIdQuery(
    selectedChat?.conversationId, 
    { skip: !selectedChat }
  );

  // Set messages when history loads
  useEffect(() => {
    if (historyData?.data) {
      setMessages(historyData.data);
    }
  }, [historyData, setMessages]);

  // ✅ Emit "messageRead" EVERY time the chat opens OR a new message arrives while open
  useEffect(() => {
    if (socket && selectedChat && messages.length > 0) {
      // Tell the other user we read the messages
      socket.emit("messageRead", {
        conversationId: selectedChat.conversationId,
        userId: currentUser._id
      });
    }
  }, [socket, selectedChat, currentUser._id, messages.length]); // Depend on messages.length so it fires on new incoming msgs too

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !selectedChat) return;

    socket.emit("sendMessage", {
      conversationId: selectedChat.conversationId,
      senderId: currentUser._id,
      text: newMessage.trim(),
    });

    setNewMessage("");
  };

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full bg-neutral-50/30">
        <NoData title="No Chat Selected" message="Select a chat from the sidebar to start messaging." />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-neutral-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary-10/10 flex items-center justify-center overflow-hidden">
              {selectedChat.avatar ? (
                <img src={selectedChat.avatar} alt={selectedChat.name} className="w-full h-full object-cover" />
              ) : (
                <User size={18} className="text-primary-10" />
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <p className="font-medium text-neutral-10">{selectedChat.name}</p>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <p className="text-center text-sm text-neutral-45">Loading messages...</p>
        ) : (
          messages.map((msg: any, idx: number) => {
            const isOwn = msg.sender === currentUser?._id || msg.sender?._id === currentUser?._id;
            
            // ✅ Check if the other user's ID is in the readBy array
            const isRead = msg.readBy?.some((id: any) => 
               id === selectedChat.otherUserId || id?._id === selectedChat.otherUserId
            );

            return (
              <div key={msg._id || idx} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  isOwn ? "bg-primary-10 text-white" : "bg-neutral-50/60 text-neutral-10"
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className={`text-xs ${isOwn ? "text-white/70" : "text-neutral-45"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {isOwn && <CheckCheck size={12} className={isRead ? "text-blue-400" : "text-white/50"} />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-neutral-50">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 px-4 py-2 border border-neutral-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10"
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
    </div>
  );
};

export default ChatWindow;
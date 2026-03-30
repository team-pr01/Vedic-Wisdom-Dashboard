import { useState } from "react";
import { Send, User, MoreVertical, CheckCheck } from "lucide-react";

type TChatMessage = {
  id: string;
  message: string;
  time: string;
  isOwn: boolean;
  isRead?: boolean;
};

const ChatWindow = () => {
  const [newMessage, setNewMessage] = useState("");

  const chatMessages: TChatMessage[] = [
    {
      id: "1",
      message: "Hi! your last shot was really good!",
      time: "9:23",
      isOwn: false,
    },
    { id: "2", message: "What tools do you use?", time: "9:23", isOwn: false },
    {
      id: "3",
      message: "Figma for prototype i use principle",
      time: "9:23",
      isOwn: true,
    },
    {
      id: "4",
      message: "Cool! Your design inspire me a lot",
      time: "9:23",
      isOwn: false,
    },
    { id: "5", message: "Thank u so much Antoan", time: "9:23", isOwn: true, isRead: true },
    { id: "6", message: "you're welcome", time: "9:23", isOwn: false },
    {
      id: "1",
      message: "Hi! your last shot was really good!",
      time: "9:23",
      isOwn: false,
    },
    { id: "2", message: "What tools do you use?", time: "9:23", isOwn: false },
    {
      id: "3",
      message: "Figma for prototype i use principle",
      time: "9:23",
      isOwn: true,
    },
    {
      id: "4",
      message: "Cool! Your design inspire me a lot",
      time: "9:23",
      isOwn: false,
    },
    { id: "5", message: "Thank u so much Antoan", time: "9:23", isOwn: true, isRead: true },
    { id: "6", message: "you're welcome", time: "9:23", isOwn: false },
    {
      id: "1",
      message: "Hi! your last shot was really good!",
      time: "9:23",
      isOwn: false,
    },
    { id: "2", message: "What tools do you use?", time: "9:23", isOwn: false },
    {
      id: "3",
      message: "Figma for prototype i use principle",
      time: "9:23",
      isOwn: true,
    },
    {
      id: "4",
      message: "Cool! Your design inspire me a lot",
      time: "9:23",
      isOwn: false,
    },
    { id: "5", message: "Thank u so much Antoan", time: "9:23", isOwn: true, isRead: true },
    { id: "6", message: "you're welcome", time: "9:23", isOwn: false },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-neutral-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary-10/10 flex items-center justify-center">
              <User size={18} className="text-primary-10" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <p className="font-medium text-neutral-10">Bessie Cooper</p>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>

        <button className="p-2 hover:bg-neutral-50 rounded-lg transition-colors">
          <MoreVertical size={18} className="text-neutral-45" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center">
          <span className="text-xs text-neutral-45 bg-neutral-50 px-3 py-1 rounded-full">
            Today
          </span>
        </div>

        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                msg.isOwn
                  ? "bg-primary-10 text-white"
                  : "bg-neutral-50/60 text-neutral-10"
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span
                  className={`text-xs ${msg.isOwn ? "text-white/70" : "text-neutral-45"}`}
                >
                  {msg.time}
                </span>
                {msg.isOwn && (
                  <CheckCheck
                    size={12}
                    className={msg.isRead ? "text-white" : "text-white/50"}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-neutral-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message"
            className="flex-1 px-4 py-2 border border-neutral-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-primary-10 text-white rounded-lg hover:bg-primary-10/90 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

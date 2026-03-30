import { Check, CheckCheck, User } from "lucide-react";

type TMessage = {
  id: string;
  name: string;
  message: string;
  time: string;
  status?: "sent" | "delivered" | "read";
  unreadCount?: number;
  isGroup?: boolean;
  avatar?: string;
};

const MessageCard = ({ message }: { message: TMessage }) => {
  const getStatusIcon = () => {
    switch (message.status) {
      case "sent":
        return <Check size={14} className="text-neutral-45" />;
      case "delivered":
        return <CheckCheck size={14} className="text-neutral-45" />;
      case "read":
        return <CheckCheck size={14} className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-primary-10/10 rounded-lg cursor-pointer transition-colors">
      {/* Avatar Section */}
      <div className="flex items-center gap-3 flex-1">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-primary-10/10 flex items-center justify-center overflow-hidden">
            {message.avatar ? (
              <img
                src={message.avatar}
                alt={message.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={20} className="text-primary-10" />
            )}
          </div>
          {message.unreadCount && message.unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
              {message.unreadCount}
            </span>
          )}
        </div>

        {/* Name and Message */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-neutral-10 truncate">
              {message.name}
            </h3>
            {message.isGroup && (
              <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-45 text-xs rounded">
                Group
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {message.status === "read" && message.message.startsWith("✔") ? (
              <CheckCheck size={14} className="text-blue-500" />
            ) : message.status === "delivered" && message.message.startsWith("✔") ? (
              <CheckCheck size={14} className="text-neutral-45" />
            ) : null}
            <p className="text-sm text-neutral-45 truncate">
              {message.message}
            </p>
          </div>
        </div>
      </div>

      {/* Time and Status */}
      <div className="flex flex-col items-end gap-1 ml-2">
        <span className="text-xs text-neutral-45">{message.time}</span>
        {getStatusIcon()}
      </div>
    </div>
  );
};



export default MessageCard;
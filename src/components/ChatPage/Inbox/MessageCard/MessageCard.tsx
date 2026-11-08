import { User, CheckCheck } from "lucide-react";
import { useSelector } from "react-redux";
import { format, isToday, isYesterday } from "date-fns";
import { useCurrentUser, type TLoggedInUser } from "../../../../redux/Features/Auth/authSlice";

type TMessage = {
  _id: string;
  name: string;
  profilePicture: string;
  lastMessage: string;
  lastMessageTime: string;
  isRead: boolean;
  isGroup?: boolean;
  unreadCount: number;
  senderId?: string;
};

const MessageCard = ({ message }: { message: TMessage }) => {
  const currentUser = useSelector(useCurrentUser) as TLoggedInUser;
  const isOwnMessage = message?.senderId === currentUser?._id;

  // Smart Date Formatter
  const getSmartDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    
    // Check if valid date
    if (isNaN(date.getTime())) return "";

    if (isToday(date)) {
      return format(date, "h:mm a"); // e.g., 2:30 PM
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "dd/MM/yyyy"); // e.g., 25/10/2026
    }
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-primary-10/10 rounded-lg cursor-pointer transition-colors">
      {/* Avatar Section */}
      <div className="flex items-center gap-3 flex-1">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-primary-10/10 flex items-center justify-center overflow-hidden">
            {message?.profilePicture ? (
              <img
                src={message?.profilePicture}
                alt={message?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={20} className="text-primary-10" />
            )}
          </div>
          {message?.unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
              {message?.unreadCount}
            </span>
          )}
        </div>

        {/* Name and Message */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-neutral-10 truncate">
              {message?.name}
            </h3>
            {message?.isGroup && (
              <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-45 text-xs rounded">
                Group
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {/* Show ticks ONLY if the last message was sent by the current user */}
            {isOwnMessage && (
              <CheckCheck 
                size={14} 
                className={message.isRead ? "text-blue-500" : "text-neutral-45"} 
              />
            )}
            <p className={`text-sm truncate ${message?.unreadCount > 0 ? "text-neutral-90 font-medium" : "text-neutral-45"}`}>
              {message?.lastMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Time */}
      <div className="flex flex-col items-end gap-1 ml-2">
        <span className={`text-xs ${message?.unreadCount > 0 ? "text-primary-10 font-medium" : "text-neutral-45"}`}>
          {getSmartDate(message?.lastMessageTime)}
        </span>
      </div>
    </div>
  );
};

export default MessageCard;
import {
  User,
  CheckCheck,
  EllipsisVertical,
  Trash2,
  ShieldBan,
  LogOut,
} from "lucide-react";
import { useSelector } from "react-redux";
import { format, isToday, isYesterday } from "date-fns";
import {
  useCurrentUser,
  type TLoggedInUser,
} from "../../../../redux/Features/Auth/authSlice";
import { useState, useRef } from "react";
import IconButtonWithToolTip from "../../../Reusable/IconButtonWithToolTip/IconButtonWithToolTip";
import DropdownMenu, {
  type TDropdownItem,
} from "../../../Reusable/DropdownMenu/DropdownMenu";
import toast from "react-hot-toast";
import ConfirmationModal from "../../../Reusable/ConfirmationModal/ConfirmationModal";
import { useDeleteChatMutation } from "../../../../redux/Features/Chat/chatApi";

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
  const [deleteChat, { isLoading: isDeletingChat }] = useDeleteChatMutation();
  const currentUser = useSelector(useCurrentUser) as TLoggedInUser;
  const isOwnMessage = message?.senderId === currentUser?._id;

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isDeleteChatModalOpen, setIsDeleteChatModalOpen] =
    useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Smart Date Formatter
  const getSmartDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "";

    if (isToday(date)) {
      return format(date, "h:mm a");
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "dd/MM/yyyy");
    }
  };

  const menuItems: TDropdownItem[] = [
    {
      id: "delete",
      label: "Delete Chat",
      icon: <Trash2 size={16} />,
      onClick: () => setIsDeleteChatModalOpen(true),
      variant: "danger",
    },
  ];

  // Group specific actions
  if (message?.isGroup) {
    menuItems.unshift({
      id: "leave",
      label: "Leave Group",
      icon: <LogOut size={16} />,
      onClick: () => toast.success("Left group"),
      variant: "danger",
    });
  }
  // 1-on-1 specific actions
  else {
    menuItems.push({
      id: "block",
      label: "Block",
      icon: <ShieldBan size={16} />,
      onClick: () => toast.success("User blocked"),
      variant: "danger",
    });
  }

  const handleDeleteChat = async () => {
    try {
      await deleteChat(message?._id).unwrap();
      setIsDeleteChatModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // Added 'group' class to handle hover states for children
    <div
      // onClick={(e) => e.stopPropagation()}
      className="group flex items-center justify-between p-3 hover:bg-neutral-50/30 rounded-lg cursor-pointer transition-colors relative"
    >
      {/* Avatar Section */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative shrink-0">
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
              <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-45 text-xs rounded shrink-0">
                Group
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {isOwnMessage && (
              <CheckCheck
                size={14}
                className={`transition-colors duration-300 ${
                  message?.isRead ? "text-orange-500" : "text-neutral-20"
                }`}
              />
            )}
            <p
              className={`text-sm truncate ${message?.unreadCount > 0 ? "text-neutral-90 font-medium" : "text-neutral-45"}`}
            >
              {message?.lastMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Time & 3-Dots */}
      <div className="flex items-center gap-2 ml-2 shrink-0">
        {/* Time */}
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-xs ${message?.unreadCount > 0 ? "text-primary-10 font-medium" : "text-neutral-45"}`}
          >
            {getSmartDate(message?.lastMessageTime)}
          </span>
        </div>

        {/* 3 Dots Dropdown Container */}
        {/* Visible always on mobile (opacity-100), visible on hover for desktop (md:opacity-0 md:group-hover:opacity-100) */}
        <div
          className={`relative opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 ${isDropdownOpen ? "md:opacity-100" : ""}`}
          ref={dropdownRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`rounded-md transition-colors ${
              isDropdownOpen ? "bg-neutral-50/80" : ""
            }`}
          >
            <IconButtonWithToolTip
              Icon={EllipsisVertical}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              textColor="text-neutral-45"
            />
          </div>

          {/* Reusable Dropdown Menu */}
          <DropdownMenu
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            items={menuItems}
            dropdownRef={dropdownRef}
          />
        </div>
      </div>

      <ConfirmationModal
        isModalOpen={isDeleteChatModalOpen}
        setIsModalOpen={setIsDeleteChatModalOpen}
        onConfirm={handleDeleteChat}
        title="Delete Chat"
        submitLabel="Delete Chat"
        submitVariant="danger"
        description={"Are you sure you want to delete this chat?"}
        isLoading={isDeletingChat}
      />
    </div>
  );
};

export default MessageCard;

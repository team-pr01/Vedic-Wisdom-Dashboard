/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Ban,
  Check,
  CheckCheck,
  Clock,
  Copy,
  Edit,
  EllipsisVertical,
  Reply,
  Smile,
  Trash2,
  User,
} from "lucide-react";
import {
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import GroupInfoCard from "./GroupInfoCard";
import DropdownMenu, {
  type TDropdownItem,
} from "../../Reusable/DropdownMenu/DropdownMenu";
import EmojiPicker, { Theme } from "emoji-picker-react";
import {
  useDeleteForEveryoneMutation,
  useDeleteForMeMutation,
  useReactToMessageMutation,
} from "../../../redux/Features/Chat/messageApi";
import MessageReactions from "./MessageReactions";
import toast from "react-hot-toast";

// --- TYPES ---
type TUser = {
  _id: string;
  name: string;
  profilePicture?: string;
};

type TReaction = {
  emoji: string;
  userId: any;
  userName: string;
};
type TMessage = {
  _id: string;
  text: string;
  sender: TUser | string;
  createdAt: string;
  readBy?: (string | { _id: string })[];
  isSystemMessage?: boolean;
  reactions?: TReaction[];
  isDeletedForEveryone?: boolean;
  isOptimistic?: boolean;
  replyTo: any;
  isEdited: boolean;
};

type TSelectedChat = {
  _id: string;
  isGroup: boolean;
  otherUserId?: string | null;
};

type TGroupDetails = {
  groupName: string;
  groupAvatar?: string;
  members: any[];
};

type TMessagesProps = {
  selectedChat: TSelectedChat;
  messages: TMessage[];
  isLoading: boolean;
  currentUser: TUser | null;
  groupDetails: TGroupDetails | null;
  setIsAddGroupMemberModalOpen: Dispatch<SetStateAction<boolean>>;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  hasLeftGroup?: boolean;
  setReplyTo: Dispatch<SetStateAction<TMessage | null>>;
  setEditingMessage: Dispatch<SetStateAction<TMessage | null>>;
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
  setIsAddGroupMemberModalOpen,
  messagesEndRef,
  hasLeftGroup,
  setReplyTo,
  setEditingMessage,
}: TMessagesProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null); // ✅ Track which message's dropdown is open
  const [activeEmojiPickerId, setActiveEmojiPickerId] = useState<string | null>(
    null,
  );

  const [reactToMessage] = useReactToMessageMutation();
  const [deleteForMe] = useDeleteForMeMutation();
  const [deleteForEveryone] = useDeleteForEveryoneMutation();

  const groupedMessages = useMemo(
    () => groupMessagesByDate(messages),
    [messages],
  );

  const handleReact = async (messageId: string, emojiData: any) => {
    try {
      const payload = { emoji: emojiData.emoji, method: "add" };
      await reactToMessage({ id: messageId, data: payload }).unwrap();
      setActiveEmojiPickerId(null);
    } catch (error) {
      console.error("Failed to react", error);
    }
  };

  const handleDeleteForMe = async (messageId: string) => {
    try {
      await deleteForMe(messageId).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete message");
    }
  };

  const handleDeleteForEveryone = async (messageId: string) => {
    try {
      await deleteForEveryone(messageId).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to unsend message");
    }
  };

  const renderMessageText = (text: string, isOwn: boolean) => {
    // Split text by the @ symbol
    const parts = text.split(/(@\w+(?:\s\w+)?)/g);

    return parts.map((part, i) => {
      if (part.startsWith("@")) {
        return (
          <span
            key={i}
            className={`font-bold ${isOwn ? "text-neutral-5" : "text-primary-10 bg-primary-10/10 px-1 rounded"}`}
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const handleCopyMessage = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Message copied to clipboard");
    } catch (err) {
      console.log(err);
      toast.error("Failed to copy message");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-neutral-50/30">
      {selectedChat.isGroup && (
        <GroupInfoCard
          groupName={groupDetails?.groupName || ""}
          groupAvatar={groupDetails?.groupAvatar || ""}
          membersCount={groupDetails?.members?.length || 0}
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

                // Calculate read status safely
                let isRead = false;

                if (msg.readBy) {
                  // Get an array of string IDs for everyone who read the message
                  const readByIds = msg.readBy.map((id: any) =>
                    (typeof id === "object" ? id._id : id).toString(),
                  );

                  if (selectedChat.isGroup && groupDetails?.members) {
                    // GROUP LOGIC
                    const otherMembers = groupDetails.members.filter(
                      (m: any) => m._id.toString() !== currentUser?._id,
                    );

                    // Check if every other member's ID is inside the readByIds array
                    isRead = otherMembers.every((member: any) =>
                      readByIds.includes(member._id.toString()),
                    );
                  } else if (
                    !selectedChat.isGroup &&
                    selectedChat.otherUserId
                  ) {
                    // ✅ 1-ON-1 LOGIC: Blue ticks if the other person has read it
                    isRead = readByIds.includes(
                      selectedChat.otherUserId.toString(),
                    );
                  }
                }

                const showSenderInfo = selectedChat.isGroup && !isOwn;

                const menuItems: TDropdownItem[] = [
                  {
                    id: `reply-${msg._id}`,
                    label: "Reply",
                    icon: <Reply size={16} />,
                    onClick: () => setReplyTo(msg),
                  },
                  {
                    id: `edit-${msg._id}`,
                    label: "Edit Message",
                    icon: <Edit size={16} />,
                    onClick: () => setEditingMessage(msg),
                  },
                  {
                    id: `copy-${msg._id}`,
                    label: "Copy",
                    icon: <Copy size={16} />,
                    onClick: () => handleCopyMessage(msg.text),
                  },

                  // Delete for me
                  {
                    id: `delete-me-${msg._id}`,
                    label: "Delete for Me",
                    icon: <Trash2 size={16} />,
                    onClick: () => handleDeleteForMe(msg._id),
                    variant: "danger",
                  },

                  // Only show Delete for Everyone if it's my message
                  ...(isOwn && !msg.isDeletedForEveryone
                    ? [
                        {
                          id: `delete-everyone-${msg._id}`,
                          label: "Unsend for Everyone",
                          icon: <Ban size={16} />,
                          onClick: () => handleDeleteForEveryone(msg._id),
                          variant: "danger",
                        } as TDropdownItem,
                      ]
                    : []),
                ];

                return (
                  <div
                    key={msg._id || idx}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"} gap-2 group`}
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

                    {/* Smile button & Picker on the LEFT for own messages */}
                    {isOwn && (
                      <div className="relative self-center flex items-center">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveEmojiPickerId(
                              activeEmojiPickerId === msg._id ? null : msg._id,
                            )
                          }
                          disabled={isLoading}
                          className={`p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed invisible group-hover:visible ${
                            activeEmojiPickerId === msg._id
                              ? "text-primary-10 bg-primary-10/10"
                              : "text-neutral-40 hover:text-primary-10 hover:bg-primary-10/5"
                          }`}
                        >
                          <Smile size={20} />
                        </button>

                        {activeEmojiPickerId === msg._id && (
                          <div className="absolute bottom-full mb-3 right-0 z-50 shadow-xl rounded-xl overflow-hidden border border-neutral-20">
                            <EmojiPicker
                              onEmojiClick={(emojiData) =>
                                handleReact(msg._id, emojiData)
                              }
                              theme={Theme.LIGHT}
                              lazyLoadEmojis={true}
                              height={350}
                              width={300}
                              searchDisabled={false}
                              skinTonesDisabled={true}
                              previewConfig={{ showPreview: false }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 relative group ${
                        isOwn
                          ? "bg-[#f2e4c9]/70 text-neutral-5 border border-neutral-5/10"
                          : "bg-white text-neutral-10 border border-neutral-50/60"
                      }`}
                    >
                      <button
                        onClick={() =>
                          setActiveDropdownId(
                            activeDropdownId === msg._id ? null : msg._id,
                          )
                        }
                        className="absolute top-2.5 right-2 invisible group-hover:visible text-neutral-5"
                      >
                        <EllipsisVertical size={16} />
                      </button>

                      <DropdownMenu
                        isOpen={activeDropdownId === msg._id}
                        onClose={() => setActiveDropdownId(null)}
                        items={menuItems}
                        dropdownRef={dropdownRef}
                      />

                      {showSenderInfo && (
                        <p className="text-xs font-semibold text-primary-10 mb-1 pr-4">
                          {senderInfo?.name || "Unknown User"}
                        </p>
                      )}

                      {msg.replyTo && (
                        <div className="bg-black/5 rounded-md p-2 mb-2 border-l-2 border-primary-10 flex flex-col cursor-pointer">
                          <span className="text-xs font-bold text-primary-10">
                            {typeof msg.replyTo.sender === "object"
                              ? msg.replyTo.sender.name
                              : "User"}
                          </span>
                          <span className="text-xs text-neutral-45 line-clamp-2">
                            {msg.replyTo.isDeletedForEveryone
                              ? "🚫 This message was deleted"
                              : msg.replyTo.text}
                          </span>
                        </div>
                      )}

                      {/* ✅ Render Deleted Message State */}
                      {msg.isDeletedForEveryone ? (
                        <div className="flex items-center gap-2 text-neutral-45 italic text-sm py-1">
                          <Ban size={14} /> This message was deleted
                        </div>
                      ) : (
                        <p className="text-sm pr-4">
                          {renderMessageText(msg.text, isOwn)}
                        </p>
                      )}

                      <div className="flex items-center justify-end gap-1 mt-1">
                        {msg.isEdited && !msg.isDeletedForEveryone && (
                          <span
                            className={`text-[10px] ${isOwn ? "text-neutral-5/70" : "text-neutral-45"} italic`}
                          >
                            (edited)
                          </span>
                        )}
                        <span
                          className={`text-[10px] ${isOwn ? "text-neutral-5/70" : "text-neutral-45"}`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        {/* ✅ WhatsApp-style Ticks */}
                        {!msg.isDeletedForEveryone && isOwn && (
                          <>
                            {msg.isOptimistic ? (
                              // 1. Pending (Not saved in DB yet)
                              <Clock size={12} className="text-neutral-400" />
                            ) : isRead ? (
                              // 2. Read (Blue ticks)
                              <CheckCheck
                                size={14}
                                className="text-orange-500"
                              />
                            ) : (
                              // 3. Sent/Delivered (Single Gray tick)
                              <Check size={14} className="text-neutral-400" />
                            )}
                          </>
                        )}
                      </div>

                      {/* Render the Reactions Component */}
                      <div
                        className={`absolute -bottom-3 z-10 ${
                          isOwn ? "-left-2" : "-right-2"
                        }`}
                      >
                        <MessageReactions
                          messageId={msg._id}
                          reactions={msg.reactions}
                          setActiveEmojiPickerId={setActiveEmojiPickerId}
                        />
                      </div>
                    </div>

                    {/* Smile button & Picker on the RIGHT for other users' messages */}
                    {!isOwn && (
                      <div className="relative self-center flex items-center z-50">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveEmojiPickerId(
                              activeEmojiPickerId === msg._id ? null : msg._id,
                            )
                          }
                          disabled={isLoading}
                          className={`p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed invisible group-hover:visible ${
                            activeEmojiPickerId === msg._id
                              ? "text-primary-10 bg-primary-10/10"
                              : "text-neutral-40 hover:text-primary-10 hover:bg-primary-10/5"
                          }`}
                        >
                          <Smile size={20} />
                        </button>

                        {activeEmojiPickerId === msg._id && (
                          <div className="absolute bottom-full mb-3 left-0 shadow-xl rounded-xl overflow-hidden border border-neutral-20">
                            <EmojiPicker
                              onEmojiClick={(emojiData) =>
                                handleReact(msg._id, emojiData)
                              }
                              theme={Theme.LIGHT}
                              lazyLoadEmojis={true}
                              height={350}
                              width={300}
                              searchDisabled={false}
                              skinTonesDisabled={true}
                              previewConfig={{ showPreview: false }}
                            />
                          </div>
                        )}
                      </div>
                    )}
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

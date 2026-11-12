/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CheckCheck,
  EllipsisVertical,
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
import { useReactToMessageMutation } from "../../../redux/Features/Chat/messageApi";
import MessageReactions from "./MessageReactions";

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
  hasLeftGroup,
}: TMessagesProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [activeEmojiPickerId, setActiveEmojiPickerId] = useState<string | null>(
    null,
  );

  const [reactToMessage] = useReactToMessageMutation();

  const groupedMessages = useMemo(
    () => groupMessagesByDate(messages),
    [messages],
  );

  //Extract the actual emoji string from the emojiData object
  const handleReact = async (messageId: string, emojiData: any) => {
    try {
      const payload = {
        emoji: emojiData.emoji,
        method: "add",
      };
      await reactToMessage({ id: messageId, data: payload }).unwrap();
      setActiveEmojiPickerId(null); // Close picker
    } catch (error) {
      console.error("Failed to react", error);
    }
  };

  const menuItems: TDropdownItem[] = [
    {
      id: "delete",
      label: "Delete Chat",
      icon: <Trash2 size={16} />,
      onClick: () => {},
      variant: "danger",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-neutral-50/30">
      {selectedChat.isGroup && (
        <GroupInfoCard
          groupName={groupDetails?.groupName || ""}
          groupAvatar={groupDetails?.groupAvatar || ""}
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

                const showSenderInfo = selectedChat.isGroup && !isOwn;

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

                    {/* ✅ Smile button & Picker on the LEFT for own messages */}
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
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="absolute top-2.5 right-2 invisible group-hover:visible text-neutral-5"
                      >
                        <EllipsisVertical size={16} />
                      </button>

                      <DropdownMenu
                        isOpen={isDropdownOpen}
                        onClose={() => setIsDropdownOpen(false)}
                        items={menuItems}
                        dropdownRef={dropdownRef}
                      />

                      {showSenderInfo && (
                        <p className="text-xs font-semibold text-primary-10 mb-1">
                          {senderInfo?.name || "Unknown User"}
                        </p>
                      )}

                      <p className="text-sm pr-4">{msg.text}</p>

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

                      {/* Render the Reactions Component */}
                      {/* ✅ FIXED REACTION POSITIONING */}
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

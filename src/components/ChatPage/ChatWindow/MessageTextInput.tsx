/* eslint-disable @typescript-eslint/no-explicit-any */
import { Send, Smile, Users, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useChat } from "../../../providers/ChatProvider";
import { useGetGroupMembersQuery } from "../../../redux/Features/Chat/chatApi";
import { getUserNameInitials } from "../../../utils/getUserNameInitials";
import { useSelector } from "react-redux";
import {
  useCurrentUser,
  type TLoggedInUser,
} from "../../../redux/Features/Auth/authSlice";

type TMessageTextInputProps = {
  handleSendMessage: (e: React.FormEvent, taggedUsers: string[], replyToId?: string) => void;
  handleTyping: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newMessage: string;
  isLoading: boolean;
  isPending: boolean;
  replyTo: any;
  setReplyTo: (msg: any) => void;
};

const MessageTextInput = ({
  handleSendMessage,
  handleTyping,
  newMessage,
  isLoading,
  isPending,
  replyTo,
  setReplyTo,
}: TMessageTextInputProps) => {
  const currentUser = useSelector(useCurrentUser) as TLoggedInUser;
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [mentionSearch, setMentionSearch] = useState<string | null>(null);
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mentionRef = useRef<HTMLDivElement>(null);

  const { selectedChat } = useChat();

  const { data: membersData } = useGetGroupMembersQuery(
    selectedChat?.conversationId,
    {
      skip: !selectedChat?.isGroup,
    },
  );

  const allMembers = [
    ...(membersData?.data?.admins || []),
    ...(membersData?.data?.members || []),
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        mentionRef.current &&
        !mentionRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target
      ) {
        setMentionSearch(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEmojiClick = (emojiData: any) => {
    const syntheticEvent = {
      target: { value: newMessage + emojiData.emoji },
    } as React.ChangeEvent<HTMLInputElement>;

    handleTyping(syntheticEvent);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleTyping(e);
    const value = e.target.value;
    const lastAtPos = value.lastIndexOf("@");

    if (lastAtPos !== -1) {
      const textAfterAt = value.slice(lastAtPos + 1);

      if (textAfterAt.includes(" ")) {
        setMentionSearch(null);
      } else {
        setMentionSearch(textAfterAt.toLowerCase());
      }
    } else {
      setMentionSearch(null);
    }
  };

  const handleSelectMention = (user: any) => {
    const lastAtPos = newMessage.lastIndexOf("@");
    const textBeforeAt = newMessage.slice(0, lastAtPos);
    const newText = `${textBeforeAt}@${user.name} `;

    const syntheticEvent = {
      target: { value: newText },
    } as React.ChangeEvent<HTMLInputElement>;
    handleTyping(syntheticEvent);

    setTaggedUsers((prev) => [...new Set([...prev, user._id])]);
    setMentionSearch(null);
    inputRef.current?.focus();
  };

  const handleSelectAll = () => {
    const lastAtPos = newMessage.lastIndexOf("@");
    const textBeforeAt = newMessage.slice(0, lastAtPos);
    const newText = `${textBeforeAt}@all `;

    const syntheticEvent = {
      target: { value: newText },
    } as React.ChangeEvent<HTMLInputElement>;
    handleTyping(syntheticEvent);

    // Add all member IDs to taggedUsers
    const allMemberIds = allMembers.map((m: any) => m._id);
    setTaggedUsers((prev) => [...new Set([...prev, ...allMemberIds])]);

    setMentionSearch(null);
    inputRef.current?.focus();
  };

  const onSubmit = (e: React.FormEvent) => {
    handleSendMessage(e, taggedUsers, replyTo?._id);
    setTaggedUsers([]);
    setMentionSearch(null);
    setReplyTo(null);
  };

  // Filter members based on search
  const filteredMembers =
    mentionSearch !== null
      ? allMembers.filter(
          (m: any) =>
            m.name.toLowerCase().includes(mentionSearch) &&
            String(m._id) !== String(selectedChat?.otherUserId) &&
            String(m._id) !== String(currentUser?._id), // Exclude current user
        )
      : [];

  // Check if "@all" matches the current search
  const showAllOption = mentionSearch !== null && "all".includes(mentionSearch);

  return (
    <div className="p-4 border-t border-neutral-50 bg-white">
      {replyTo && (
        <div className="flex items-center justify-between bg-neutral-50 mx-4 mt-3 p-2 rounded-lg border-l-4 border-primary-10">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-primary-10">
              Replying to{" "}
              {typeof replyTo.sender === "object"
                ? replyTo.sender.name
                : "User"}
            </span>
            <span className="text-sm text-neutral-45 truncate max-w-sm">
              {replyTo.text}
            </span>
          </div>
          <button
            onClick={() => setReplyTo(null)}
            className="p-1 hover:bg-neutral-200 rounded-full text-neutral-45"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <form onSubmit={onSubmit} className="flex gap-2 items-center">
        <div className="relative flex-1 flex items-center bg-white border border-neutral-50 rounded-lg focus-within:ring-1 focus-within:ring-primary-10 focus-within:border-transparent transition-all duration-200">
          <div className="relative flex items-center pl-2" ref={emojiPickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={isLoading || isPending}
              className={`p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                showEmojiPicker
                  ? "text-primary-10 bg-primary-10/10"
                  : "text-neutral-40 hover:text-primary-10 hover:bg-primary-10/5"
              }`}
            >
              <Smile size={20} />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-full mb-3 left-0 z-50 shadow-xl rounded-xl overflow-hidden border border-neutral-20">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
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

          <input
            ref={inputRef}
            type="text"
            disabled={isLoading || isPending}
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message"
            className="w-full py-3 pr-4 bg-transparent text-neutral-10 focus:outline-none font-Roboto disabled:cursor-not-allowed disabled:opacity-50"
          />

          {/* Mention Dropdown */}
          {mentionSearch !== null &&
            selectedChat?.isGroup &&
            (filteredMembers.length > 0 || showAllOption) && (
              <div
                ref={mentionRef}
                className="absolute bottom-full left-10 mb-2 w-64 bg-white border border-neutral-50 shadow-xl rounded-xl max-h-48 overflow-y-auto z-50"
              >
                {/* @all Option */}
                {showAllOption && (
                  <div
                    onClick={handleSelectAll}
                    className="flex items-center gap-2 p-2 hover:bg-neutral-50 cursor-pointer border-b border-neutral-50"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary-10 text-white flex items-center justify-center">
                      <Users size={12} />
                    </div>
                    <span className="text-sm font-medium text-neutral-90">
                      all
                    </span>
                  </div>
                )}

                {/* Member Options */}
                {filteredMembers.map((user: any) => (
                  <div
                    key={user._id}
                    onClick={() => handleSelectMention(user)}
                    className="flex items-center gap-2 p-2 hover:bg-neutral-50 cursor-pointer"
                  >
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary-10/10 flex items-center justify-center text-[10px] font-bold text-primary-10">
                        {getUserNameInitials(user.name)}
                      </div>
                    )}
                    <span className="text-sm">{user.name}</span>
                  </div>
                ))}
              </div>
            )}
        </div>

        <button
          type="submit"
          disabled={!newMessage.trim() || isLoading || isPending}
          className="px-4 py-3.5 bg-primary-10 text-white rounded-lg hover:bg-primary-10/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageTextInput;

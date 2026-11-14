/* eslint-disable @typescript-eslint/no-explicit-any */
import MessageCard from "../MessageCard/MessageCard";
import LogoLoader from "../../../Shared/LogoLoader/LogoLoader";
import { useChat } from "../../../../providers/ChatProvider";
import { Search, MessageSquareDashed, SearchX } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "../../../../hooks/useDebounce";

const ChatList = () => {
  const [keyword, setKeyword] = useState<string>("");
  const debouncedKeyword = useDebounce(keyword, 500);

  const { inbox, isLoadingInbox, setSelectedChat, selectedChat } = useChat();

  // Filter inbox based on search
  const searchedInbox = inbox?.filter((chat: any) => 
    chat.name.toLowerCase().includes(debouncedKeyword.toLowerCase())
  ) || [];

  // console.log(searchedInbox);

  const isSearching = keyword.trim().length > 0;
  const hasNoResults = isSearching && searchedInbox.length === 0;
  const isInboxEmpty = !isSearching && searchedInbox.length === 0;

  if (isLoadingInbox) {
    return <LogoLoader />;
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-40 size-4" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search chats..."
          className="w-full pl-9 pr-4 py-2.5 bg-neutral-10/5 border border-transparent focus:bg-white focus:border-primary-10 focus:ring-2 focus:ring-primary-10/20 transition-all duration-200 rounded-xl text-sm outline-none placeholder:text-neutral-40"
        />
      </div>

      {/* INBOX LIST */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* 1. Empty Inbox State */}
        {isInboxEmpty && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="size-16 rounded-full bg-primary-10/5 flex items-center justify-center mb-4">
              <MessageSquareDashed size={28} className="text-primary-10" />
            </div>
            <p className="text-neutral-90 font-semibold">No chats yet</p>
            <p className="text-sm text-neutral-45 mt-1">
              Start a conversation by searching for a user in the top menu.
            </p>
          </div>
        )}

        {/* 2. No Search Results State */}
        {hasNoResults && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="size-16 rounded-full bg-neutral-10/5 flex items-center justify-center mb-4">
              <SearchX size={28} className="text-neutral-40" />
            </div>
            <p className="text-neutral-90 font-semibold">No chat found</p>
            <p className="text-sm text-neutral-45 mt-1">
              We couldn't find any results for "{keyword}". Try searching a different name.
            </p>
          </div>
        )}

        {/* 3. Chats List */}
        {searchedInbox.length > 0 && (
          <div className="divide-y divide-neutral-50 space-y-1">
            {searchedInbox?.map((chat: any) => (
              <div
                key={chat.conversationId}
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer rounded-lg transition-colors ${
                  selectedChat?.conversationId === chat.conversationId
                    ? "bg-primary-10/5"
                    : "hover:bg-neutral-50"
                }`}
              >
                <MessageCard
                  message={{
                    _id: chat.conversationId,
                    name: chat.name,
                    profilePicture: chat.avatar,
                    lastMessage: chat.lastMessage?.text || "No messages yet",
                    lastMessageTime: chat.lastMessage?.createdAt,
                    isRead: chat.lastMessage?.isRead,
                    isGroup: chat.isGroup,
                    unreadCount: chat.unreadCount || 0,
                    senderId: chat.lastMessage?.sender,
                    isDeletedForEveryone: chat?.lastMessage?.isDeletedForEveryone,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
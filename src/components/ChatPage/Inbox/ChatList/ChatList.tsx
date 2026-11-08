/* eslint-disable @typescript-eslint/no-explicit-any */
import MessageCard from "../MessageCard/MessageCard";
import LogoLoader from "../../../Shared/LogoLoader/LogoLoader";
import { useChat } from "../../../../providers/ChatProvider";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "../../../../hooks/useDebounce";

const ChatList = () => {
  const [keyword, setKeyword] = useState<string>("");
  const debouncedKeyword = useDebounce(keyword, 500);

  const { inbox, isLoadingInbox, setSelectedChat, selectedChat } = useChat();

  const searchedInbox = inbox?.filter((chat: any) => chat.name.toLowerCase().includes(debouncedKeyword.toLowerCase())) || [];

  if (isLoadingInbox) {
    return <LogoLoader />;
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          placeholder="Search users to chat..."
          className="w-full px-3 py-2 pr-10 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-10 size-4" />
      </div>

      {/* SEARCH DROPDOWN */}
      {/* {showDropdown && keyword.length >= 2 && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)} 
          />
          
          <div className="absolute top-12 left-0 w-full bg-white border border-neutral-50 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            {isFetching ? (
              <div className="p-4 text-center text-sm text-neutral-45">Searching...</div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-sm text-neutral-45">No users found</div>
            ) : (
              searchResults.map((user: any) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className="flex items-center gap-3 p-3 hover:bg-neutral-50 cursor-pointer border-b border-neutral-50 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-10/10 flex items-center justify-center overflow-hidden">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={14} className="text-primary-10" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-90">{user.name}</p>
                    <p className="text-xs text-neutral-45">{user.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )} */}

      {/* INBOX LIST */}
      <div className="flex-1 overflow-y-auto">
        {searchedInbox?.length === 0 ? (
          <div className="flex items-center justify-center h-full mt-10">
            <p className="text-neutral-45 text-sm">
              No chats yet. Search to start chatting!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50 space-y-2">
            {searchedInbox?.map((chat: any) => (
              <div
                key={chat.conversationId}
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer transition-colors ${
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
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loading overlay when creating a chat */}
      {/* {isCreatingChat && (
        <div className="absolute inset-0 bg-white/50 z-30 flex items-center justify-center">
          <LogoLoader />
        </div>
      )} */}
    </div>
  );
};

export default ChatList;

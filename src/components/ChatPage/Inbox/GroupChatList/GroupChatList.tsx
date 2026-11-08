/* eslint-disable @typescript-eslint/no-explicit-any */
import MessageCard from "../MessageCard/MessageCard";
import LogoLoader from "../../../Shared/LogoLoader/LogoLoader";
import { useChat } from "../../../../providers/ChatProvider";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import CreateGroupModal from "../../CreateGroupModal/CreateGroupModal";

const GroupChatList = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { inbox, isLoadingInbox, setSelectedChat, selectedChat } = useChat();

  // ✅ Filter ONLY groups
  const groupChats = inbox?.filter((chat: any) => chat.isGroup) || [];
  
  // Filter by search keyword
  const filteredGroups = groupChats.filter((chat: any) => 
    chat.name.toLowerCase().includes(keyword.toLowerCase())
  );

  if (isLoadingInbox) return <LogoLoader />;

  return (
    <div className="relative h-full flex flex-col">
      {/* Search and Create Button */}
      <div className="relative mb-4 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search groups..."
            className="w-full px-3 py-2 pr-10 border border-neutral-55/60 rounded-md text-sm"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-10 size-4" />
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3 py-2 bg-primary-10 text-white rounded-md flex items-center justify-center hover:bg-primary-10/90"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Group List */}
      <div className="flex-1 overflow-y-auto">
        {filteredGroups.length === 0 ? (
          <div className="flex items-center justify-center h-full mt-10">
            <p className="text-neutral-45 text-sm">No groups yet. Create one!</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50 space-y-2">
            {filteredGroups.map((chat: any) => (
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
                    lastMessage: chat.lastMessage?.text || "Group created",
                    lastMessageTime: chat.lastMessage?.createdAt,
                    isRead: chat.lastMessage?.isRead,
                    senderId: chat.lastMessage?.sender,
                    isGroup: true,
                    unreadCount: chat.unreadCount || 0,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
};

export default GroupChatList;
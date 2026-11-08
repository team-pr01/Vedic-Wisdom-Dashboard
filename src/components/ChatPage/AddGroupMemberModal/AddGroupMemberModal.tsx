/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search, User, UserPlus, Send } from "lucide-react";
import Modal from "../../Reusable/Modal/Modal";
import { useState } from "react";
import { useGetAllUsersForChatQuery } from "../../../redux/Features/User/userApi";
import { useGetMyInboxQuery } from "../../../redux/Features/Chat/chatApi";
import {
  useCurrentUser,
  type TLoggedInUser,
} from "../../../redux/Features/Auth/authSlice";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useChat } from "../../../providers/ChatProvider";
import { useDebounce } from "../../../hooks/useDebounce";

const AddGroupMemberModal = ({ isModalOpen, setIsModalOpen }) => {
  const currentUser = useSelector(useCurrentUser) as TLoggedInUser;
  const { selectedChat } = useChat();
  const [keyword, setKeyword] = useState<string>("");

  // Debounce the keyword (500ms delay)
  const debouncedKeyword = useDebounce(keyword, 500);

  // 1. Fetch search results with debounced keyword
  // If no keyword, it fetches all users by default
  const { data, isFetching } = useGetAllUsersForChatQuery({
    keyword: debouncedKeyword,
    conversationId: selectedChat?.conversationId,
  });

  // 2. Fetch user's inbox to check existing connections
  const { data: inboxData } = useGetMyInboxQuery(undefined);

  // Connected user IDs
  const connectedUserIds =
    inboxData?.data
      ?.filter((chat: any) => !chat.isGroup)
      .map((chat: any) => chat.otherUserId) || [];

  // Filter out current user from results
  const searchResults =
    data?.data?.data?.filter((user: any) => user._id !== currentUser?._id) ||
    [];

  // 3. Actions
  const handleAddMember = (userId: string, name: string) => {
    toast.success(`${name} added to the group!`);
  };

  const handleSendRequest = (userId: string, name: string) => {
    toast.success(`Connection request sent to ${name}!`);
  };

  // Determine UI state
  const isTyping = keyword !== debouncedKeyword;
  const isSearchLoading = isFetching || isTyping;

  return (
    <Modal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      heading="Add Member"
    >
      <div className="relative font-Inter">
        {/* Search Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full px-3 py-2 pr-10 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-10 size-4" />
        </div>

        {/* Search Results */}
        <div className="flex flex-col max-h-80 overflow-y-auto">
          {isSearchLoading ? (
            <p className="text-center text-sm text-neutral-45 py-4">
              Searching...
            </p>
          ) : searchResults.length === 0 ? (
            <p className="text-center text-sm text-neutral-45 py-4">
              No users found.
            </p>
          ) : (
            searchResults?.map((user: any) => {
              const isConnected = connectedUserIds.includes(user._id);

              return (
                <div
                  key={user?._id}
                  className="flex items-center justify-between border-b border-primary-10/20 py-3 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {user?.profilePicture ? (
                      <img
                        src={user?.profilePicture}
                        alt={user?.name}
                        className="size-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-primary-10/10 flex items-center justify-center">
                        <User size={18} className="text-primary-10" />
                      </div>
                    )}
                    <div>
                      <p className="text-neutral-90 text-sm font-medium">
                        {user?.name}
                      </p>
                      <p className="text-neutral-45 text-xs">{user?.email}</p>
                    </div>
                  </div>

                  {isConnected ? (
                    <button
                      onClick={() => handleAddMember(user._id, user.name)}
                      className="flex items-center gap-1.5 bg-primary-10/10 hover:bg-primary-10/20 text-primary-10 px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold"
                    >
                      <UserPlus size={14} />
                      Add
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(user._id, user.name)}
                      className="flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-60 px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold"
                    >
                      <Send size={14} />
                      Request
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddGroupMemberModal;

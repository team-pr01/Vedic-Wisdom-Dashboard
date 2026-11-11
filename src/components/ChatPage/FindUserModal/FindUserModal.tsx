/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search, Send, User, Loader2, MessageCircle } from "lucide-react";
import Modal from "../../Reusable/Modal/Modal";
import { useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import { useGetAllUsersForChatQuery } from "../../../redux/Features/User/userApi";
import { useChat } from "../../../providers/ChatProvider";
import { useAccessChatMutation } from "../../../redux/Features/Chat/chatApi";
import { useSelector } from "react-redux";
import {
  useCurrentUser,
  type TLoggedInUser,
} from "../../../redux/Features/Auth/authSlice";
import toast from "react-hot-toast";
import { getUserNameInitials } from "../../../utils/getUserNameInitials";

type TFindUserModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};


const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-teal-100 text-teal-700",
];

const FindUserModal: React.FC<TFindUserModalProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const currentUser = useSelector(useCurrentUser) as TLoggedInUser;
  const [keyword, setKeyword] = useState<string>("");
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const { setSelectedChat } = useChat();

  const debouncedKeyword = useDebounce(keyword, 500);

  const { data, isLoading, isFetching } = useGetAllUsersForChatQuery({
    keyword: debouncedKeyword,
  });

  const users = data?.data?.data || [];
  const isSearching = isLoading || isFetching || keyword !== debouncedKeyword;

  const [accessChat] = useAccessChatMutation();

  const handleUserClick = async (targetUserId: string) => {
    setLoadingUserId(targetUserId);
    try {
      const response = await accessChat(targetUserId).unwrap();

      const chatData = response.data;
      const otherUser = chatData.members.find(
        (member: any) => member._id !== currentUser?._id,
      );

      setSelectedChat({
        conversationId: chatData._id,
        isGroup: false,
        name: otherUser?.name || "Unknown User",
        avatar: otherUser?.profilePicture || "",
        otherUserId: otherUser?._id || null,
        lastMessage: chatData.lastMessage
          ? {
              text: chatData.lastMessage.text,
              createdAt: chatData.lastMessage.createdAt,
              isRead: true,
            }
          : null,
        messageRequestStatus: chatData?.messageRequestStatus,
        requestedBy: chatData.requestedBy,
      });

      setKeyword("");
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to start chat");
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <Modal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      heading="Find User"
      width="w-[95%] sm:w-[70%] md:w-[50%] lg:w-[45%] xl:w-[35%]"
    >
      <div className="flex flex-col font-Inter">
        {/* Search Input */}
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-40 size-4" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 bg-neutral-10/5 border border-transparent focus:bg-white focus:border-primary-10 focus:ring-2 focus:ring-primary-10/20 transition-all duration-200 rounded-xl text-sm outline-none placeholder:text-neutral-40"
          />
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto mt-2 -mx-2 px-2 pb-4 space-y-1">
          {isSearching ? (
            // Skeleton Loading State
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-neutral-50/50" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-32 bg-neutral-50/50 rounded" />
                    <div className="h-3 w-24 bg-neutral-50/50 rounded" />
                  </div>
                </div>
                <div className="h-8 w-24 bg-neutral-50/50 rounded-lg" />
              </div>
            ))
          ) : users.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="size-16 rounded-full bg-neutral-10/5 flex items-center justify-center mb-3">
                <User size={24} className="text-neutral-40" />
              </div>
              <p className="text-neutral-90 font-medium">No users found</p>
              <p className="text-sm text-neutral-45 mt-1">
                Try searching with a different name or email.
              </p>
            </div>
          ) : (
            // User Rows
            users.map((user: any, index: number) => {
              const isSending = loadingUserId === user?._id;
              const colorClass = avatarColors[index % avatarColors.length];

              return (
                <div
                  key={user?._id}
                  className="flex items-center justify-between group transition-colors py-3 border-b border-neutral-50/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    {user?.profilePicture ? (
                      <img
                        src={user?.profilePicture}
                        alt={user?.name}
                        className="size-10 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div
                        className={`size-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${colorClass}`}
                      >
                        {getUserNameInitials(user?.name)}
                      </div>
                    )}

                    {/* User Info */}
                    <div className="min-w-0">
                      <p className="text-neutral-90 text-sm font-semibold truncate">
                        {user?.name}
                      </p>
                      <p className="text-neutral-45 text-xs truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleUserClick(user?._id)}
                    disabled={isSending}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shrink-0 ${
                      isSending
                        ? "bg-neutral-100 text-neutral-40 cursor-wait"
                        : user?.isConnected
                          ? "bg-primary-10 text-white hover:bg-primary-10/80" // ✅ Connected Button Style
                          : "bg-primary-10/10 text-primary-10 hover:bg-primary-10 hover:text-white" // Request Button Style
                    }`}
                  >
                    {isSending ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        {user?.isConnected ? "Starting..." : "Sending..."}
                      </>
                    ) : user?.isConnected ? (
                      <>
                        <MessageCircle size={14} /> {/* ✅ Message Icon */}
                        Message
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Send Request
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};

export default FindUserModal;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search, User, Loader2, Check, Send, X } from "lucide-react";
import Modal from "../../Reusable/Modal/Modal";
import { useState } from "react";
import { useGetAllUsersForChatQuery } from "../../../redux/Features/User/userApi";
import { useDebounce } from "../../../hooks/useDebounce";
import { getUserNameInitials } from "../../../utils/getUserNameInitials";
import {
  useAccessChatMutation,
  useAddMembersToGroupMutation,
} from "../../../redux/Features/Chat/chatApi";
import toast from "react-hot-toast";

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-teal-100 text-teal-700",
];

type TAddGroupMemberModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  conversationId: string;
};

const AddGroupMemberModal: React.FC<TAddGroupMemberModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  conversationId,
}) => {
  const [addMembersToGroup, { isLoading: isAdding }] =
    useAddMembersToGroupMutation();
  const [accessChat] = useAccessChatMutation();

  const [keyword, setKeyword] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  // ✅ Tab State
  const [activeTab, setActiveTab] = useState<"connected" | "others">(
    "connected",
  );

  const debouncedKeyword = useDebounce(keyword, 500);

  const { data, isLoading, isFetching } = useGetAllUsersForChatQuery({
    keyword: debouncedKeyword,
    conversationId,
  });

  const allUsers = data?.data?.data || [];

  const connectedUsers = allUsers.filter((u: any) => u.isConnected === true);
  const otherUsers = allUsers.filter((u: any) => u.isConnected === false);

  const isSearching = isLoading || isFetching || keyword !== debouncedKeyword;

  // ✅ The list to display based on the active tab
  const displayedUsers =
    activeTab === "connected" ? connectedUsers : otherUsers;

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return;
    try {
      const payload = {
        members: selectedUsers,
      };
      await addMembersToGroup({ id: conversationId, data: payload }).unwrap();
      toast.success("Members added successfully");
      setIsModalOpen(false);
      setSelectedUsers([]);
      setKeyword("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add members");
    }
  };

  const handleSendRequest = async (targetUserId: string) => {
    setLoadingUserId(targetUserId);
    try {
      await accessChat(targetUserId).unwrap();
      toast.success("Request sent! You can now message them once accepted.");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send request");
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <Modal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      heading="Add Members"
      width="w-[95%] sm:w-[70%] md:w-[50%] lg:w-[45%] xl:w-[35%]"
    >
      <div className="flex flex-col font-Inter h-[60vh]">
        {/* Search Input */}
        <div className="relative mb-4 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-40 size-4" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 bg-neutral-10/5 border border-transparent focus:bg-white focus:border-primary-10 focus:ring-2 focus:ring-primary-10/20 transition-all duration-200 rounded-xl text-sm outline-none placeholder:text-neutral-40"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center bg-neutral-10/5 p-1 rounded-xl mb-4 shrink-0">
          <button
            onClick={() => setActiveTab("connected")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "connected"
                ? "bg-white text-primary-10 shadow-sm"
                : "text-neutral-45 hover:text-neutral-90"
            }`}
          >
            Connections - Not in Groups ({connectedUsers.length})
          </button>
          <button
            onClick={() => setActiveTab("others")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "others"
                ? "bg-white text-primary-10 shadow-sm"
                : "text-neutral-45 hover:text-neutral-90"
            }`}
          >
            Non-Connections ({otherUsers.length})
          </button>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto -mx-2 px-2 pb-4 space-y-1">
          {isSearching ? (
            <div className="space-y-2 mt-2">
              {Array.from({ length: 4 }).map((_, i) => (
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
                </div>
              ))}
            </div>
          ) : displayedUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="size-16 rounded-full bg-neutral-10/5 flex items-center justify-center mb-3">
                <User size={24} className="text-neutral-40" />
              </div>
              <p className="text-neutral-90 font-medium">No users found</p>
              <p className="text-sm text-neutral-45 mt-1">
                {activeTab === "connected"
                  ? "You don't have any connections to add."
                  : "Try searching with a different name or email."}
              </p>
            </div>
          ) : (
            displayedUsers.map((user: any, index: number) => {
              const isSelected = selectedUsers.includes(user?._id);
              const isSending = loadingUserId === user?._id;
              const isPending = user.connectionStatus === "pending";
              const isRejected = user.connectionStatus === "rejected";
              const colorClass = avatarColors[index % avatarColors.length];

              return (
                <div
                  key={user?._id}
                  onClick={() =>
                    activeTab === "connected" && toggleUserSelection(user?._id)
                  }
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors border ${
                    activeTab === "connected"
                      ? isSelected
                        ? "bg-primary-10/5 border-primary-10/30 cursor-pointer"
                        : "border-transparent hover:bg-neutral-50 cursor-pointer"
                      : "border-transparent hover:bg-neutral-50" // No click action for other users
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
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
                    <div className="min-w-0">
                      <p className="text-neutral-90 text-sm font-semibold truncate">
                        {user?.name}
                      </p>
                      <p className="text-neutral-45 text-xs truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Conditional Action by Tab */}
                  {activeTab === "connected" ? (
                    <div
                      className={`size-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-primary-10 border-primary-10 text-white"
                          : "border-neutral-30"
                      }`}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        handleSendRequest(user?._id);
                      }}
                      disabled={isSending || isPending}
                      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shrink-0 ${
                        isPending
                          ? "bg-neutral-100 text-neutral-45 cursor-not-allowed"
                          : "bg-primary-10/10 text-primary-10 hover:bg-primary-10 hover:text-white disabled:bg-neutral-100"
                      }`}
                    >
                      {isSending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : isPending ? (
                        <>
                          <Check size={14} />
                          Sent
                        </>
                      ) : isRejected ? (
                        <>
                          <X size={14} />
                          Rejected
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          Request
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Sticky Footer for Bulk Action */}
        {selectedUsers.length > 0 && (
          <div className="pt-4 border-t border-neutral-50 mt-auto shrink-0 flex justify-between items-center bg-white">
            <p className="text-sm text-neutral-45 font-medium">
              {selectedUsers.length} user(s) selected
            </p>
            <button
              onClick={handleAddMembers}
              disabled={isAdding}
              className="bg-primary-10 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-10/90 transition-colors flex items-center gap-2"
            >
              {isAdding ? <Loader2 size={16} className="animate-spin" /> : null}
              Add to Group
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddGroupMemberModal;

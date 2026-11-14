import { Flag, Trash2, User } from "lucide-react";
import { useState } from "react";
import { useChat } from "../../../providers/ChatProvider";
import Drawer from "../../Reusable/Drawer/Drawer";
import ReportSpamModal from "./ReportSpamModal";
import ConfirmationModal from "../../Reusable/ConfirmationModal/ConfirmationModal";
import { useDeleteChatMutation } from "../../../redux/Features/Chat/chatApi";

type TProfileDetailsDrawerProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileDetailsDrawer = ({
  isOpen,
  setIsOpen,
}: TProfileDetailsDrawerProps) => {
  const [deleteChat, { isLoading: isDeletingChat }] = useDeleteChatMutation();
  const { selectedChat, setSelectedChat } = useChat();

  const [isReportSpamModalOpen, setIsReportSpamModalOpen] = useState(false);
  const [isDeleteChatModalOpen, setIsDeleteChatModalOpen] = useState(false);

  const handleDeleteChat = async () => {
    try {
      await deleteChat(selectedChat?.conversationId).unwrap();
      setIsDeleteChatModalOpen(false);
      setSelectedChat(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Drawer
        title="Profile Info"
        isDrawerOpen={isOpen}
        setIsDrawerOpen={setIsOpen}
      >
        <div className="flex flex-col h-full bg-neutral-50/30">
          {/* --- Profile Header --- */}
          <div className="bg-white p-6 flex flex-col items-center border-b border-neutral-50 shrink-0">
            {/* Avatar / Initials */}
            <div className="relative mb-4">
              {selectedChat?.avatar ? (
                <img
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary-10/20 shadow-sm"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary-10/10 flex items-center justify-center text-primary-10 font-bold text-3xl border-4 border-primary-10/20 shadow-sm">
                  {selectedChat?.name?.charAt(0) || <User size={40} />}
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-neutral-90 text-center">
              {selectedChat?.name || "User Name"}
            </h2>
          </div>

          {/* --- Actions (Bottom) --- */}
          <div className="bg-white p-4 border-t border-neutral-50 space-y-2 mt-2 pb-8">
            <button
              onClick={() => setIsReportSpamModalOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-70 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              <Flag size={18} className="text-neutral-45" />
              Report Spam
            </button>
            <button
              onClick={() => setIsDeleteChatModalOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
            >
              <Trash2 size={18} />
              Delete Chat
            </button>
          </div>
        </div>
      </Drawer>

      {/* Modals */}
      <ReportSpamModal
        isModalOpen={isReportSpamModalOpen}
        setIsModalOpen={setIsReportSpamModalOpen}
        targetId={selectedChat?.otherUserId}
        reportType="user"
      />

      <ConfirmationModal
        isModalOpen={isDeleteChatModalOpen}
        setIsModalOpen={setIsDeleteChatModalOpen}
        onConfirm={handleDeleteChat}
        title="Delete Chat"
        submitLabel="Delete"
        submitVariant="danger"
        description="Are you sure you want to delete this chat? This action cannot be undone."
        isLoading={isDeletingChat}
      />
    </>
  );
};

export default ProfileDetailsDrawer;

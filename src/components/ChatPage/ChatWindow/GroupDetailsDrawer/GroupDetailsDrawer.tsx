import { Flag, LogOut } from "lucide-react";
import Drawer from "../../../Reusable/Drawer/Drawer";
import { useChat } from "../../../../providers/ChatProvider";
import {
  useGetGroupMembersQuery,
  useLeaveGroupMutation,
} from "../../../../redux/Features/Chat/chatApi";
import { useState } from "react";
import ReportSpamModal from "../ReportSpamModal";
import ConfirmationModal from "../../../Reusable/ConfirmationModal/ConfirmationModal";
import GroupDetailsHeader from "./GroupDetailsHeader";
import GroupMembers from "./GroupMembers";

type TGroupDetailsDrawerProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const GroupDetailsDrawer = ({
  isOpen,
  setIsOpen,
}: TGroupDetailsDrawerProps) => {
  const { selectedChat, setSelectedChat } = useChat();

  const { data } = useGetGroupMembersQuery(selectedChat?.conversationId);
  const groupData = data?.data || {};

  const [leaveGroup, { isLoading: isLeavingGroup }] = useLeaveGroupMutation();

  const [isReportSpamModalOpen, setIsReportSpamModalOpen] =
    useState<boolean>(false);
  const [isLeaveGroupModalOpen, setIsLeaveGroupModalOpen] =
    useState<boolean>(false);

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(selectedChat.conversationId).unwrap();
      setSelectedChat({
        ...selectedChat,
        hasLeft: true,
      });
      setIsLeaveGroupModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Drawer
        title="Group Info"
        isDrawerOpen={isOpen}
        setIsDrawerOpen={setIsOpen}
      >
        <div className="flex flex-col h-full bg-neutral-50/30">
          {/* --- Group Banner --- */}
          <GroupDetailsHeader groupData={groupData} />

          {/* --- Members & Admins List --- */}
          <GroupMembers groupData={groupData} />

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
              onClick={() => setIsLeaveGroupModalOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Exit Group
            </button>
          </div>
        </div>
      </Drawer>

      <ReportSpamModal
        isModalOpen={isReportSpamModalOpen}
        setIsModalOpen={setIsReportSpamModalOpen}
        targetId={
          selectedChat.isGroup
            ? selectedChat.conversationId
            : selectedChat.otherUserId!
        }
        reportType={selectedChat.isGroup ? "group" : "user"}
      />

      <ConfirmationModal
        isModalOpen={isLeaveGroupModalOpen}
        setIsModalOpen={setIsLeaveGroupModalOpen}
        onConfirm={handleLeaveGroup}
        title="Leave Group"
        submitLabel="Leave Group"
        submitVariant="danger"
        description={"Are you sure you want to leave this group?"}
        isLoading={isLeavingGroup}
      />
    </>
  );
};

export default GroupDetailsDrawer;

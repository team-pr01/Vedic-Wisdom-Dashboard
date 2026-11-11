/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import {
  EllipsisVertical,
  Flag,
  LogOut,
  ShieldBan,
  Trash2,
  User,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChat } from "../../../providers/ChatProvider";
import { useGetMessagesByConversationIdQuery } from "../../../redux/Features/Chat/messageApi";
import NoData from "../../Reusable/NoData/NoData";
import GroupMembersModal from "../GroupMembersModal/GroupMembersModal";
import AddGroupMemberModal from "../AddGroupMemberModal/AddGroupMemberModal";
import {
  useChangeMessageRequestStatusMutation,
  useDeleteChatMutation,
  useLeaveGroupMutation,
} from "../../../redux/Features/Chat/chatApi";
import toast from "react-hot-toast";
import TypingIndicator from "./TypingIndicator";
import MessageTextInput from "./MessageTextInput";
import Messages from "./Messages";
import IconButtonWithToolTip from "../../Reusable/IconButtonWithToolTip/IconButtonWithToolTip";
import DropdownMenu, {
  type TDropdownItem,
} from "../../Reusable/DropdownMenu/DropdownMenu";
import ReportSpamModal from "./ReportSpamModal";
import ConfirmationModal from "../../Reusable/ConfirmationModal/ConfirmationModal";

const ChatWindow = () => {
  const [leaveGroup, { isLoading: isLeavingGroup }] = useLeaveGroupMutation();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLeaveGroupModalOpen, setIsLeaveGroupModalOpen] =
    useState<boolean>(false);
  const [isDeleteChatModalOpen, setIsDeleteChatModalOpen] =
    useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentUser = useSelector((state: any) => state.auth.user);
  const {
    selectedChat,
    setSelectedChat,
    socket,
    messages,
    setMessages,
    typingUsers,
  } = useChat();
  const [isViewMembersModalOpen, setIsViewMembersModalOpen] =
    useState<boolean>(false);
  const [isAddGroupMemberModalOpen, setIsAddGroupMemberModalOpen] =
    useState<boolean>(false);
  const [isReportSpamModalOpen, setIsReportSpamModalOpen] =
    useState<boolean>(false);

  const [newMessage, setNewMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any | null>(null);

  const [changeMessageRequestStatus, { isLoading: isChangingStatus }] =
    useChangeMessageRequestStatusMutation();
  const [deleteChat, { isLoading: isDeletingChat }] = useDeleteChatMutation();

  const handleChangeMessageRequestStatus = async (
    action: "accepted" | "rejected",
  ) => {
    try {
      const payload = { action };

      // 1. Update Database
      await changeMessageRequestStatus({
        id: selectedChat.conversationId,
        data: payload,
      }).unwrap();

      // 2. Update Local State instantly
      setSelectedChat({
        ...selectedChat,
        messageRequestStatus: action,
      });

      // 3. Tell the other user via Socket
      if (socket && selectedChat) {
        socket.emit("requestStatusChanged", {
          targetUserId: selectedChat.otherUserId, // The person who sent the request
          conversationId: selectedChat.conversationId,
          status: action,
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong.");
    }
  };

  const { data: historyData, isLoading } = useGetMessagesByConversationIdQuery(
    selectedChat?.conversationId,
    { skip: !selectedChat },
  );

  const groupDetails = historyData?.data?.conversationDetails || {};
  const isPending = selectedChat?.messageRequestStatus === "pending";
  const isReceiver = selectedChat?.requestedBy !== currentUser?._id;
  const hasLeftGroup = selectedChat?.isGroup && selectedChat?.hasLeft;

  useEffect(() => {
    if (historyData?.data?.messages) {
      setMessages(historyData?.data?.messages);
    }
  }, [historyData, setMessages]);

  useEffect(() => {
    if (socket && selectedChat && messages.length > 0) {
      socket.emit("messageRead", {
        conversationId: selectedChat.conversationId,
        userId: currentUser._id,
      });
    }
  }, [socket, selectedChat, currentUser?._id, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (socket && selectedChat?.conversationId) {
      socket.emit("joinRoom", selectedChat.conversationId);
    }
  }, [socket, selectedChat?.conversationId]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!socket || !selectedChat) return;

    // Emit typing event
    socket.emit("typing", {
      conversationId: selectedChat.conversationId,
      userId: currentUser._id,
      userName: currentUser.name,
      isTyping: true,
    });

    // Clear previous timeout if user is still typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        conversationId: selectedChat.conversationId,
        userId: currentUser._id,
        userName: currentUser.name,
        isTyping: false,
      });
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !selectedChat) return;

    socket.emit("sendMessage", {
      conversationId: selectedChat.conversationId,
      senderId: currentUser._id,
      text: newMessage.trim(),
    });

    setNewMessage("");

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit("typing", {
      conversationId: selectedChat.conversationId,
      userId: currentUser._id,
      userName: currentUser.name,
      isTyping: false,
    });
  };

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full bg-neutral-50/30">
        <NoData
          title="No Chat Selected"
          message="Select a chat from the sidebar to start messaging."
        />
      </div>
    );
  }

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

  const handleDeleteChat = async () => {
    try {
      await deleteChat(selectedChat?.conversationId).unwrap();
      setIsDeleteChatModalOpen(false);
      setSelectedChat(null);
    } catch (error) {
      console.error(error);
    }
  };

  // 1. Build the dynamic menu items based on chat type
  let menuItems: TDropdownItem[] = [
    {
      id: "report-spam",
      label: "Report Spam",
      icon: <Flag size={16} />,
      onClick: () => {
        setIsReportSpamModalOpen(true);
      },
    },
  ];

  if (selectedChat?.isGroup) {
    // Group specific actions
    menuItems.push({
      id: "exit-group",
      label: "Exit Group",
      icon: <LogOut size={16} />,
      onClick: () => {
        setIsLeaveGroupModalOpen(true);
      },
      variant: "danger" as const,
    });
  } else {
    // 1-on-1 specific actions
    menuItems.push(
      {
        id: "block",
        label: "Block",
        icon: <ShieldBan size={16} />,
        onClick: () => {
          // setIsBlockModalOpen(true);
          toast.success("User blocked");
        },
        variant: "danger" as const,
      },
      {
        id: "delete",
        label: "Delete Chat",
        icon: <Trash2 size={16} />,
        onClick: () => setIsDeleteChatModalOpen(true),
        variant: "danger" as const,
      },
    );
  }

  if (hasLeftGroup) {
    menuItems = menuItems.filter((item) => item.id !== "exit-group");
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-5 border-b border-neutral-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary-10/10 flex items-center justify-center overflow-hidden">
              {selectedChat.avatar ? (
                <img
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={18} className="text-primary-10" />
              )}
            </div>
            {/* Only show online dot for 1-on-1 */}
            {!selectedChat.isGroup && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <p className="font-medium text-neutral-10">{selectedChat.name}</p>
            {!selectedChat.isGroup && (
              <p className="text-xs text-green-500">Online</p>
            )}
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <div
            className={`rounded-md transition-colors ${
              isDropdownOpen ? "bg-neutral-50/80" : ""
            }`}
          >
            <IconButtonWithToolTip
              Icon={EllipsisVertical}
              tooltip="Menu"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              textColor="text-neutral-5"
            />
          </div>

          {/* Reusable Dropdown Menu */}
          <DropdownMenu
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            items={menuItems}
            dropdownRef={dropdownRef}
          />
        </div>
      </div>

      {/* Request Banners */}
      {isPending && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200 text-center">
          {isReceiver ? (
            <div>
              <p className="text-sm text-yellow-800 mb-3">
                This user wants to message you.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleChangeMessageRequestStatus("accepted")}
                  className="bg-green-500 text-white px-4 py-1 rounded"
                >
                  {isChangingStatus ? "Loading..." : "Accept"}
                </button>
                <button
                  onClick={() => handleChangeMessageRequestStatus("rejected")}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  {isChangingStatus ? "Loading..." : "Decline"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-yellow-800">
              Message request sent. Waiting for them to accept.
            </p>
          )}
        </div>
      )}

      {/* Messages Area */}
      <Messages
        selectedChat={selectedChat}
        messages={messages}
        isLoading={isLoading}
        groupDetails={groupDetails}
        messagesEndRef={messagesEndRef}
        setIsViewMembersModalOpen={setIsViewMembersModalOpen}
        setIsAddGroupMemberModalOpen={setIsAddGroupMemberModalOpen}
        currentUser={currentUser}
        hasLeftGroup={hasLeftGroup}
      />

      {/* Typing Indicator */}
      {!hasLeftGroup && (
        <TypingIndicator
          typingUsers={typingUsers}
          selectedChat={selectedChat}
        />
      )}

      {/* Input Area */}
      {hasLeftGroup ? (
        <div className="p-4 border-t border-neutral-50 bg-neutral-50 text-center">
          <p className="text-sm text-neutral-45">
            You can no longer send messages to this group.
          </p>
        </div>
      ) : (
        <MessageTextInput
          handleSendMessage={handleSendMessage}
          handleTyping={handleTyping}
          newMessage={newMessage}
          isLoading={isLoading}
          isPending={isPending}
        />
      )}

      <GroupMembersModal
        isModalOpen={isViewMembersModalOpen}
        setIsModalOpen={setIsViewMembersModalOpen}
        members={groupDetails?.members}
        admins={groupDetails?.admins}
        isLoading={isLoading}
      />

      <AddGroupMemberModal
        isModalOpen={isAddGroupMemberModalOpen}
        setIsModalOpen={setIsAddGroupMemberModalOpen}
        conversationId={selectedChat?.conversationId}
      />

      <ReportSpamModal
        isModalOpen={isReportSpamModalOpen}
        setIsModalOpen={setIsReportSpamModalOpen}
        targetId={
          selectedChat.isGroup
            ? selectedChat.conversationId
            : selectedChat.otherUserId
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

      <ConfirmationModal
        isModalOpen={isDeleteChatModalOpen}
        setIsModalOpen={setIsDeleteChatModalOpen}
        onConfirm={handleDeleteChat}
        title="Delete Chat"
        submitLabel="Delete Chat"
        submitVariant="danger"
        description={"Are you sure you want to delete this chat?"}
        isLoading={isDeletingChat}
      />
    </div>
  );
};

export default ChatWindow;

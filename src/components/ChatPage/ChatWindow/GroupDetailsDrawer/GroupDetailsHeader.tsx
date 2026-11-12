import { useEffect, useRef, useState } from "react";
import { useUpdateGroupInfoMutation } from "../../../../redux/Features/Chat/chatApi";
import { Users, Camera, Pen, Check, X } from "lucide-react";
import { useChat } from "../../../../providers/ChatProvider";
import toast from "react-hot-toast";

/* eslint-disable @typescript-eslint/no-explicit-any */
const GroupDetailsHeader = ({ groupData }: any) => {
  const { selectedChat, setSelectedChat } = useChat();
  const [updateGroupInfo] = useUpdateGroupInfoMutation();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (groupData.groupName) setNewGroupName(groupData.groupName);
  }, [groupData.groupName]);

  // Handle Group Name Update
  const handleUpdateName = async () => {
    if (!newGroupName.trim() || newGroupName === groupData.groupName) {
      setIsEditingName(false);
      return;
    }

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("groupName", newGroupName);

      const response = await updateGroupInfo({
        conversationId: selectedChat?.conversationId,
        data: formData,
      }).unwrap();
      setIsEditingName(false);
      setSelectedChat({
        ...selectedChat,
        name: response?.data?.groupName || groupData.groupName || newGroupName,
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update group name");
    } finally {
      setIsUpdating(false);
    }
  };

  //  Handle Group Image Update
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("groupName", groupData.groupName || newGroupName);

      const response = await updateGroupInfo({
        conversationId: selectedChat?.conversationId,
        data: formData,
      }).unwrap();

      setSelectedChat({
        ...selectedChat,
        avatar:
          response?.data?.groupAvatar ||
          response?.data?.avatar ||
          selectedChat.avatar,
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update group image");
    } finally {
      setIsUpdating(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white p-6 flex flex-col items-center border-b border-neutral-50 shrink-0">
      {/* Group Avatar Container */}
      <div className="relative mb-4 group/avatar">
        {/* Condition 1: If avatar exists, show the image */}
        {groupData.groupAvatar ? (
          <img
            src={groupData.groupAvatar}
            alt={groupData.groupName}
            onClick={() => {
              window.open(
                groupData.groupAvatar,
                "_blank",
                "noopener,noreferrer",
              );
            }}
            className={`w-24 h-24 rounded-full object-cover border-4 border-primary-10/20 shadow-sm transition-all duration-300 cursor-pointer hover:opacity-90 hover:scale-105 ${
              isUpdating ? "opacity-50" : ""
            }`}
          />
        ) : (
          /* Condition 2: If no avatar, show the placeholder circle with Users icon */
          <div
            className={`w-24 h-24 rounded-full bg-[#f2e4c9] border-4 border-primary-10/20 shadow-sm flex items-center justify-center transition-all duration-300 ${
              isUpdating ? "opacity-50" : ""
            }`}
          >
            <Users size={40} className="text-[#8A6349]" />
          </div>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />

        {/* Camera Icon Overlay for Editing */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUpdating}
          className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-neutral-100 text-neutral-5 hover:bg-neutral-50 transition-colors disabled:opacity-50"
          title="Change group photo"
        >
          <Camera size={16} />
        </button>
      </div>

      {/* ✅ Editable Group Name Section */}
      {isEditingName ? (
        <div className="flex items-center gap-2 mt-1">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            disabled={isUpdating}
            className="text-lg font-bold text-neutral-90 text-center border-b-2 border-primary-10 focus:outline-none bg-transparent w-48"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUpdateName();
              if (e.key === "Escape") {
                setIsEditingName(false);
                setNewGroupName(groupData.groupName);
              }
            }}
          />
          <button
            onClick={handleUpdateName}
            disabled={isUpdating}
            className="text-green-500 hover:bg-green-50 p-1 rounded-md transition-colors disabled:opacity-50"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => {
              setIsEditingName(false);
              setNewGroupName(groupData.groupName);
            }}
            disabled={isUpdating}
            className="text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-1 group/name">
          <h2 className="text-xl font-bold text-neutral-90 text-center">
            {groupData.groupName || "Group Name"}
          </h2>
          <button
            onClick={() => setIsEditingName(true)}
            className="p-1 text-neutral-40 hover:text-primary-10 hover:bg-primary-10/5 rounded-md transition-colors"
            title="Edit group name"
          >
            <Pen size={14} />
          </button>
        </div>
      )}

      <p className="text-sm text-neutral-45 mt-1">
        Group · {groupData?.totalMembers || 0} members
      </p>
    </div>
  );
};

export default GroupDetailsHeader;

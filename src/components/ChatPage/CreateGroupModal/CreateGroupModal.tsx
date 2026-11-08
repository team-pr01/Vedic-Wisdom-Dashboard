/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
// import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { User } from "lucide-react";
import { useCreateGroupChatMutation, useGetMyInboxQuery } from "../../../redux/Features/Chat/chatApi";

const CreateGroupModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
//   const currentUser = useSelector((state: any) => state.auth.user);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  
  // We fetch the inbox to get the list of people the user has chatted with
  const { data: inboxData } = useGetMyInboxQuery(undefined);
  const [createGroupChat, { isLoading }] = useCreateGroupChatMutation();

  // Get unique users from the 1-on-1 inbox
  const connections = inboxData?.data
    ?.filter((chat: any) => !chat.isGroup)
    .map((chat: any) => ({
      _id: chat.otherUserId,
      name: chat.name,
      avatar: chat.avatar,
    })) || [];

  const handleToggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!groupName || selectedMembers.length < 2) {
      toast.error("Please provide a group name and select at least 2 members.");
      return;
    }

    try {
      await createGroupChat({ groupName, members: selectedMembers }).unwrap();
      toast.success("Group created successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create group");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Group</h2>
        
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />

        <p className="text-sm font-semibold mb-2">Select Members (Min 2)</p>
        <div className="max-h-60 overflow-y-auto space-y-2 mb-4 border p-2 rounded-lg">
          {connections.map((user: any) => (
            <div
              key={user._id}
              onClick={() => handleToggleMember(user._id)}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                selectedMembers.includes(user._id) ? "bg-primary-10/10" : "hover:bg-neutral-50"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedMembers.includes(user._id)}
                readOnly
                className="w-4 h-4"
              />
              <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200">
                {user.avatar ? <img src={user.avatar} alt="" /> : <User size={16} />}
              </div>
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={handleCreate} disabled={isLoading} className="px-4 py-2 bg-primary-10 text-white rounded-lg">
            {isLoading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
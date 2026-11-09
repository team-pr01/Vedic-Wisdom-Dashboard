/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { User, Check, Camera, X } from "lucide-react";
import {
  useCreateGroupChatMutation,
  useGetMyInboxQuery,
} from "../../../redux/Features/Chat/chatApi";
import Modal from "../../Reusable/Modal/Modal";
import Button from "../../Reusable/Button/Button";
import TextInput from "../../Reusable/TextInput/TextInput";
import { useForm } from "react-hook-form";

type TFormData = {
  groupName: string;
  members: any;
  file?: any;
};

const CreateGroupModal = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormData>();

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupAvatar, setGroupAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // We fetch the inbox to get the list of people the user has chatted with
  const { data: inboxData } = useGetMyInboxQuery(undefined);
  const [createGroupChat, { isLoading }] = useCreateGroupChatMutation();

  // Get unique users from the 1-on-1 inbox
  const connections =
    inboxData?.data
      ?.filter((chat: any) => !chat.isGroup)
      .map((chat: any) => ({
        _id: chat.otherUserId,
        name: chat.name,
        avatar: chat.avatar,
      })) || [];

  const handleToggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGroupAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the file input
    setGroupAvatar(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreateGroup = async (data: TFormData) => {
    if (selectedMembers.length < 2) {
      toast.error("Please select at least 2 members");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("groupName", data.groupName);
      selectedMembers.forEach((id) => {
        formData.append("members", id);
      });

      // Append the avatar file if selected
      if (groupAvatar) {
        formData.append("file", groupAvatar);
      }

      await createGroupChat(formData).unwrap();
      toast.success("Group created successfully!");

      // Reset state on success
      setSelectedMembers([]);
      setGroupAvatar(null);
      setAvatarPreview(null);
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create group");
    }
  };

  return (
    <Modal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      heading="Create New Group"
    >
      {/* Fixed the typo in className here */}
      <form onSubmit={handleSubmit(handleCreateGroup)} className="space-y-5">
        {/* Group Avatar Upload */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-24 h-24 rounded-full bg-neutral-10/5 border-2 border-dashed border-neutral-30 hover:border-primary-10 hover:bg-primary-10/5 flex items-center justify-center cursor-pointer transition-all duration-200 group overflow-hidden"
          >
            {avatarPreview ? (
              <>
                <img
                  src={avatarPreview}
                  alt="Group Avatar"
                  className="w-full h-full object-cover"
                />
                {/* Remove button overlay */}
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={20} className="text-white" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center text-neutral-40 group-hover:text-primary-10 transition-colors">
                <Camera size={24} className="mb-1" />
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  Add Photo
                </span>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAvatarChange}
          />
        </div>

        <TextInput
          label="Group Name"
          placeholder="Enter group name"
          error={errors.groupName}
          {...register("groupName", { required: "Group name is required" })}
        />

        <div>
          <label className="flex flex-row items-center w-full justify-between text-neutral-65 mb-2">
            <span className="text-neutral-20 leading-4.5 text-[15px] font-medium tracking-[-0.16]">
              Select Members (Min 2) <span className="text-primary-10">*</span>
            </span>
            <span className="text-xs text-primary-10 font-medium bg-primary-10/10 px-2 py-0.5 rounded-full">
              {selectedMembers.length} selected
            </span>
          </label>

          <div className="max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {connections.length === 0 && (
              <p className="text-sm text-neutral-45 text-center py-4">
                No connections found. Start a chat first!
              </p>
            )}

            {connections.map((user: any) => {
              const isSelected = selectedMembers.includes(user._id);

              return (
                <div
                  key={user._id}
                  onClick={() => handleToggleMember(user._id)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition-all duration-200`}
                >
                  {/* Left Side: Avatar & Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center shrink-0">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={18} className="text-neutral-40" />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-neutral-80">
                      {user.name}
                    </span>
                  </div>

                  {/* Right Side: Circular Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                      isSelected
                        ? "bg-primary-10 border-primary-10"
                        : "border-neutral-30"
                    }`}
                  >
                    {isSelected && (
                      <Check size={12} className="text-white" strokeWidth={3} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-50">
          <Button
            type="button"
            onClick={() => setIsModalOpen(false)}
            variant="secondary"
            label="Cancel"
          />
          <Button
            type="submit"
            label="Create Group"
            isLoading={isLoading}
            isDisabled={selectedMembers.length < 2}
          />
        </div>
      </form>
    </Modal>
  );
};

export default CreateGroupModal;

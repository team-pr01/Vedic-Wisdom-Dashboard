/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../Reusable/Modal/Modal";
import Button from "../../Reusable/Button/Button";
import toast from "react-hot-toast";
import Textarea from "../../Reusable/TextArea/TextArea";
import { useEditMessageMutation } from "../../../redux/Features/Chat/messageApi";
import { useGetGroupMembersQuery } from "../../../redux/Features/Chat/chatApi";
import { useChat } from "../../../providers/ChatProvider";
import { getUserNameInitials } from "../../../utils/getUserNameInitials";
import { Users } from "lucide-react";

interface EditMessageModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: any;
}

type TEditForm = {
  text: string;
};

const EditMessageModal = ({
  isModalOpen,
  setIsModalOpen,
  message,
}: EditMessageModalProps) => {
  const [editMessage, { isLoading }] = useEditMessageMutation();
  const { selectedChat } = useChat();

  const [mentionSearch, setMentionSearch] = useState<string | null>(null);
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mentionRef = useRef<HTMLDivElement>(null);

  // Fetch members if it's a group
  const { data: membersData } = useGetGroupMembersQuery(
    selectedChat?.conversationId,
    {
      skip: !selectedChat?.isGroup || !isModalOpen,
    },
  );

  const allMembers = [
    ...(membersData?.data?.admins || []),
    ...(membersData?.data?.members || []),
  ];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TEditForm>();

  // Watch the text to detect mentions
  const currentText = watch("text", "");

  useEffect(() => {
    if (message && isModalOpen) {
      setValue("text", message.text);
      setTaggedUsers(message.mentions || []); // Pre-fill existing mentions
    }
  }, [message, isModalOpen, setValue]);

  // Close mention dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mentionRef.current &&
        !mentionRef.current.contains(event.target as Node)
      ) {
        setMentionSearch(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const lastAtPos = value.lastIndexOf("@");

    if (lastAtPos !== -1) {
      const textAfterAt = value.slice(lastAtPos + 1);
      if (textAfterAt.includes(" ")) {
        setMentionSearch(null);
      } else {
        setMentionSearch(textAfterAt.toLowerCase());
      }
    } else {
      setMentionSearch(null);
    }
  };

  const handleSelectMention = (user: any) => {
    const lastAtPos = currentText.lastIndexOf("@");
    const textBeforeAt = currentText.slice(0, lastAtPos);
    const newText = `${textBeforeAt}@${user.name} `;

    setValue("text", newText);
    setTaggedUsers((prev) => [...new Set([...prev, user._id])]);
    setMentionSearch(null);
    textareaRef.current?.focus();
  };

  const handleSelectAll = () => {
    const lastAtPos = currentText.lastIndexOf("@");
    const textBeforeAt = currentText.slice(0, lastAtPos);
    const newText = `${textBeforeAt}@all `;

    setValue("text", newText);
    const allMemberIds = allMembers.map((m: any) => m._id);
    setTaggedUsers((prev) => [...new Set([...prev, ...allMemberIds])]);
    setMentionSearch(null);
    textareaRef.current?.focus();
  };

  const handleEditMessage = async (data: TEditForm) => {
    try {
      if (!data.text.trim()) {
        toast.error("Message cannot be empty.");
        return;
      }

      const payload = {
        text: data.text.trim(),
        mentions: taggedUsers,
      };

      await editMessage({
        messageId: message._id,
        data: payload,
      }).unwrap();
      setIsModalOpen(false);
      reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to edit message.");
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
    setMentionSearch(null);
  };

  const filteredMembers =
    mentionSearch !== null
      ? allMembers.filter((m: any) =>
          m.name.toLowerCase().includes(mentionSearch),
        )
      : [];

  const showAllOption = mentionSearch !== null && "all".includes(mentionSearch);

  return (
    <Modal
      isModalOpen={isModalOpen}
      setIsModalOpen={handleClose}
      heading="Edit Message"
    >
      <form
        onSubmit={handleSubmit(handleEditMessage)}
        className="p-2 space-y-5 relative"
      >
        <div className="relative">
          <Textarea
            label="Message"
            placeholder="Edit your message..."
            error={errors.text}
            rows={4}
            {...register("text", {
              required: "Message text is required",
              onChange: handleTextChange, // ✅ Detect mentions while typing
            })}
            isRequired={true}
          />

          {/* ✅ Mention Dropdown */}
          {mentionSearch !== null &&
            selectedChat?.isGroup &&
            (filteredMembers.length > 0 || showAllOption) && (
              <div
                ref={mentionRef}
                className="absolute top-full left-0 mt-1 w-full bg-white border border-neutral-50 shadow-xl rounded-xl max-h-48 overflow-y-auto z-50"
              >
                {showAllOption && (
                  <div
                    onClick={handleSelectAll}
                    className="flex items-center gap-2 p-2 hover:bg-neutral-50 cursor-pointer border-b border-neutral-50"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary-10 text-white flex items-center justify-center">
                      <Users size={12} />
                    </div>
                    <span className="text-sm font-medium text-neutral-90">
                      all
                    </span>
                  </div>
                )}

                {filteredMembers.map((user: any) => (
                  <div
                    key={user._id}
                    onClick={() => handleSelectMention(user)}
                    className="flex items-center gap-2 p-2 hover:bg-neutral-50 cursor-pointer"
                  >
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary-10/10 flex items-center justify-center text-[10px] font-bold text-primary-10">
                        {getUserNameInitials(user.name)}
                      </div>
                    )}
                    <span className="text-sm">{user.name}</span>
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            label="Cancel"
            variant="secondary"
            onClick={handleClose}
            className="px-6"
          />
          <Button
            type="submit"
            label="Save Changes"
            variant="primary"
            isLoading={isLoading}
            className="px-6"
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditMessageModal;

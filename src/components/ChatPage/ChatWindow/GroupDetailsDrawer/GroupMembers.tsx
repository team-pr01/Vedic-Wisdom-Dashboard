/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Users,
  Shield,
  MoreVertical,
  Crown,
  ShieldCheck,
  UserMinus,
  ShieldOff,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useMakeGroupAdminMutation,
  useRemoveFromAdminMutation,
  useRemoveFromGroupMutation,
} from "../../../../redux/Features/Chat/chatApi";
import { useChat } from "../../../../providers/ChatProvider";
import type { TDropdownItem } from "../../../Reusable/DropdownMenu/DropdownMenu";
import { useEffect, useRef, useState } from "react";
import DropdownMenu from "../../../Reusable/DropdownMenu/DropdownMenu";

type TMembers = {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  isMe: boolean;
};

const GroupMembers = ({ groupData }: any) => {
  const { selectedChat } = useChat();
  const [makeGroupAdmin] = useMakeGroupAdminMutation();
  const [removeFromAdmin] = useRemoveFromAdminMutation();
  const [removeFromGroup] = useRemoveFromGroupMutation();

  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMakeAdmin = async (targetUserId: string) => {
    try {
      const payload = { targetUserId };
      await makeGroupAdmin({
        conversationId: selectedChat?.conversationId,
        data: payload,
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleRemoveFromAdmin = async (targetUserId: string) => {
    try {
      const payload = { targetUserId };
      await removeFromAdmin({
        conversationId: selectedChat?.conversationId,
        data: payload,
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleRemoveMember = async (targetUserId: string) => {
    try {
      const payload = { targetUserId };
      await removeFromGroup({
        conversationId: selectedChat?.conversationId,
        data: payload,
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  // Generate Menu Items for a specific member
  const getMemberMenuItems = (
    member: any,
    isAdminRow: boolean,
  ): TDropdownItem[] => {
    const items: TDropdownItem[] = [];

    if (member.isMe) return items;

    if (isAdminRow) {
      items.push({
        id: "dismiss-admin",
        label: "Dismiss As Admin",
        icon: <ShieldOff size={16} />,
        onClick: () => handleRemoveFromAdmin(member?._id),
        variant: "danger",
      });
    } else {
      items.push({
        id: "make-admin",
        label: "Make Group Admin",
        icon: <ShieldCheck size={16} />,
        onClick: () => handleMakeAdmin(member?._id),
      });
    }

    items.push({
      id: "remove",
      label: "Remove",
      icon: <UserMinus size={16} />,
      onClick: () => handleRemoveMember(member?._id),
      variant: "danger",
    });

    return items;
  };
  return (
    <div className="flex-1 bg-white mt-2 p-4">
      {/* Admins Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-xs font-semibold text-neutral-45 uppercase tracking-wider flex items-center gap-1.5">
            <Shield size={14} className="text-primary-10" />
            Group Admins
          </h3>
          <span className="text-xs text-neutral-40">
            {groupData.admins?.length || 0}
          </span>
        </div>
        <div className="space-y-3">
          {groupData?.admins?.map((admin: TMembers) => (
            <div key={admin._id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {admin.profilePicture ? (
                  <img
                    src={admin.profilePicture}
                    alt={admin.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-10/10 flex items-center justify-center text-primary-10 font-semibold">
                    {admin.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-neutral-90">
                    {admin.name}{" "}
                    {admin.isMe && (
                      <span className="text-neutral-40">(You)</span>
                    )}
                  </p>
                  <p className="text-xs text-neutral-45 flex items-center gap-1">
                    <Crown size={10} className="text-amber-500" /> Admin
                  </p>
                </div>
              </div>

              {!admin.isMe && (
                <div
                  className="relative"
                  ref={activeDropdownId === admin._id ? dropdownRef : null}
                >
                  <button
                    onClick={() =>
                      setActiveDropdownId(
                        activeDropdownId === admin._id ? null : admin._id,
                      )
                    }
                    className="hover:text-primary-10 text-neutral-40 transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                  <DropdownMenu
                    isOpen={activeDropdownId === admin._id}
                    onClose={() => setActiveDropdownId(null)}
                    items={getMemberMenuItems(admin, true)}
                    dropdownRef={dropdownRef}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Members Section */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-xs font-semibold text-neutral-45 uppercase tracking-wider flex items-center gap-1.5">
            <Users size={14} className="text-neutral-40" />
            Members
          </h3>
          <span className="text-xs text-neutral-40">
            {groupData.members?.length || 0}
          </span>
        </div>
        <div className="space-y-3">
          {groupData.members?.map((member: TMembers) => (
            <div key={member._id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {member.profilePicture ? (
                  <img
                    src={member.profilePicture}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-50 font-semibold">
                    {member.name.charAt(0)}
                  </div>
                )}
                <p className="text-sm font-medium text-neutral-90">
                  {member.name}{" "}
                  {member.isMe && (
                    <span className="text-neutral-40">(You)</span>
                  )}
                </p>
              </div>

              {!member.isMe && (
                <div
                  className="relative"
                  ref={activeDropdownId === member._id ? dropdownRef : null}
                >
                  <button
                    onClick={() =>
                      setActiveDropdownId(
                        activeDropdownId === member._id ? null : member._id,
                      )
                    }
                    className="hover:text-primary-10 text-neutral-40 transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                  <DropdownMenu
                    isOpen={activeDropdownId === member._id}
                    onClose={() => setActiveDropdownId(null)}
                    items={getMemberMenuItems(member, false)}
                    dropdownRef={dropdownRef}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupMembers;

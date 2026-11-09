import { useState, useRef, useEffect } from "react";
import ChatList from "./ChatList/ChatList";
import GroupChatList from "./GroupChatList/GroupChatList";
import {
  EllipsisVertical,
  Search,
  ShieldAlert,
  PlusCircle,
} from "lucide-react";
import IconButtonWithToolTip from "../../Reusable/IconButtonWithToolTip/IconButtonWithToolTip";
import FindUserModal from "../FindUserModal/FindUserModal";
import CreateGroupModal from "../CreateGroupModal/CreateGroupModal";
import type { TDropdownItem } from "../../Reusable/DropdownMenu/DropdownMenu";
import DropdownMenu from "../../Reusable/DropdownMenu/DropdownMenu";

const Inbox = () => {
  const [isFindUserModalOpen, setIsFindUserModalOpen] =
    useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"general" | "groups">("general");

  // Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tabButtons = [
    { label: "General", value: "general" },
    { label: "Groups", value: "groups" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems: TDropdownItem[] = [
    {
      id: "new-group",
      label: "New Group",
      icon: <PlusCircle size={16} />,
      onClick: () => {
        setIsCreateModalOpen(true);
      },
    },
    {
      id: "blocked-list",
      label: "Blocked List",
      icon: <ShieldAlert size={16} />,
      onClick: () => {
        // handleBlockedList();
        console.log("Blocked List clicked");
      },
      variant: "danger", // Optional: makes it red
    },
  ];

  return (
    <div className="w-[30%] border-r border-neutral-55 flex flex-col h-full bg-white relative p-6">
      <div className="flex flex-col gap-5 mb-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-neutral-5">Messages</h2>

          <div className="flex gap-1">
            <IconButtonWithToolTip
              Icon={Search}
              tooltip="Search Users"
              onClick={() => setIsFindUserModalOpen(true)}
              textColor="text-neutral-5"
            />

            {/* Three Dots Dropdown Wrapper */}
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
        </div>

        {/* Tab */}
        <div className="flex items-center w-full bg-neutral-50/50 rounded-3xl p-1">
          {tabButtons.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveTab(item.value as "general" | "groups")}
              className={`flex-1 py-2.5 rounded-3xl text-sm font-medium cursor-pointer transition-all duration-300 ${
                activeTab === item.value
                  ? "bg-primary-10 text-white shadow-sm hover:bg-primary-10/90"
                  : "text-neutral-5/70 hover:text-neutral-90"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "general" ? <ChatList /> : <GroupChatList />}
      </div>

      <FindUserModal
        isModalOpen={isFindUserModalOpen}
        setIsModalOpen={setIsFindUserModalOpen}
      />

      {/* Create Group Modal */}
      <CreateGroupModal
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
      />
    </div>
  );
};

export default Inbox;

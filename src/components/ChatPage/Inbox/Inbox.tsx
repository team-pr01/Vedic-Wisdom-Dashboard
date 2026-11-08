import { useState } from "react";
import ChatList from "./ChatList/ChatList";
import GroupChatList from "./GroupChatList/GroupChatList";

const Inbox = () => {
  const [activeTab, setActiveTab] = useState<"general" | "group">("general");
  const tabButtons = [
    { label: "General", value: "general" },
    { label: "Group", value: "group" },
  ];

  return (
    <div className="w-[30%] border-r border-neutral-55 flex flex-col h-full">
      <div className="flex flex-col gap-5 pb-6 pr-6">
        <h2 className="text-2xl font-semibold">Messages</h2>

        {/* Tab */}
        <div className="flex items-center w-full bg-neutral-50/50 rounded-3xl">
          {tabButtons.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveTab(item.value as "general" | "group")}
              className={`flex-1 py-3 rounded-3xl text-sm font-medium cursor-pointer transition-all duration-200 ${
                activeTab === item.value
                  ? "bg-primary-10 text-white shadow-md hover:bg-primary-10/90"
                  : ""
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
    </div>
  );
};

export default Inbox;

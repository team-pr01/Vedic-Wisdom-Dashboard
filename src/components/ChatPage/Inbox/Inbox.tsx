import { Search } from "lucide-react";
import { useState } from "react";
import ChatList from "./ChatList/ChatList";

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

        {/* Search */}
        <div className="relative">
          <input
            placeholder="Search..."
            className="w-full px-3 py-2 pr-10 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm"
            aria-label="Search table"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-10 size-4" />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <ChatList />
      </div>
    </div>
  );
};

export default Inbox;

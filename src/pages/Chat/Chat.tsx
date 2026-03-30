import ChatWindow from "../../components/ChatPage/ChatWindow/ChatWindow";
import Inbox from "../../components/ChatPage/Inbox/Inbox";

const Chat = () => {
  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Panel - Chat List */}
      <Inbox />
      
      {/* Right Panel - Chat Window */}
      <div className="w-[70%] h-full">
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageCard from "../MessageCard/MessageCard";
import { useSocket } from "../../../../contexts/SocketContext";
import { selectChatList, setChatList, setSelectedChatData, setSelectedChatType } from "../../../../redux/Features/Chat/chatSlice";

const ChatList = () => {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const chatList = useSelector(selectChatList);

  // Listen for chat list updates from socket
  useEffect(() => {
    if (!socket) return;

    const handleUpdateChatList = (updatedChatList: any[]) => {
      console.log("📋 Chat list updated:", updatedChatList);
      dispatch(setChatList(updatedChatList));
    };

    socket.on("updateChatList", handleUpdateChatList);

    return () => {
      socket.off("updateChatList", handleUpdateChatList);
    };
  }, [socket, dispatch]);

  const handleSelectChat = (user: any) => {
    dispatch(setSelectedChatType("contact"));
    dispatch(setSelectedChatData(user));
  };

  if (chatList.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-neutral-45 text-sm">No chats yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="divide-y divide-neutral-50 space-y-2">
        {chatList.map((user: any) => (
          <div key={user._id} onClick={() => handleSelectChat(user)}>
            <MessageCard
              message={user}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
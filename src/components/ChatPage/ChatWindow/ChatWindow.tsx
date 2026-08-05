/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Send, User, MoreVertical, CheckCheck } from "lucide-react";
import { useSocket } from "../../../contexts/SocketContext";
import {
  addMessage,
  updateMessageId,
  selectSelectedChatData,
  selectSelectedChatMessages,
  setSelectedChatMessages,
} from "../../../redux/Features/Chat/chatSlice";
import {
  useGetMyMessagesWithOtherSingleUserQuery,
  useMarkMessageAsReadMutation,
} from "../../../redux/Features/Chat/messageApi";

const ChatWindow = () => {
  const [newMessage, setNewMessage] = useState("");
  const dispatch = useDispatch();
  const { socket, isConnected } = useSocket();
  const selectedChatData = useSelector(selectSelectedChatData);
  const selectedChatMessages = useSelector(selectSelectedChatMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const processedMessageIds = useRef<Set<string>>(new Set());

  const currentUser = useSelector((state: any) => state.auth.user);

  // ✅ API to mark messages as read
  const [markMessageAsRead] = useMarkMessageAsReadMutation();

  // ✅ Fetch messages when chat is selected
  const { data, refetch } = useGetMyMessagesWithOtherSingleUserQuery(
    selectedChatData?._id,
    { skip: !selectedChatData?._id },
  );

  // ✅ Set messages to Redux when fetched from API (only once per chat)
  useEffect(() => {
    if (data?.data && !hasInitialized.current) {
      dispatch(setSelectedChatMessages(data.data));
      hasInitialized.current = true;
      processedMessageIds.current = new Set();
      data.data.forEach((msg: any) => {
        if (msg._id) processedMessageIds.current.add(msg._id);
      });
    }
  }, [data, dispatch]);

  // ✅ Reset initialization when chat changes
  useEffect(() => {
    hasInitialized.current = false;
    processedMessageIds.current = new Set();
    if (selectedChatData?._id) {
      refetch();
    }
  }, [selectedChatData?._id, refetch]);

  // ✅ Mark messages as read when chat window is opened
  useEffect(() => {
    if (selectedChatData?._id && currentUser?._id) {
      // Mark all messages as read
      markMessageAsRead(selectedChatData._id)
        .unwrap()
        .then(() => {
          console.log("✅ Messages marked as read");

          // ✅ Update the chat list to reflect 0 unread count
          // This will be handled by the socket event
        })
        .catch((error) => {
          console.error("❌ Failed to mark messages as read:", error);
        });
    }
  }, [selectedChatData?._id, currentUser?._id, markMessageAsRead]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChatMessages]);

  // ✅ Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: any) => {
      console.log("📩 Received message in ChatWindow:", message);

      const messageId = message._id;
      const tempId = message.tempId;

      // Skip if already processed
      if (
        processedMessageIds.current.has(messageId) ||
        (tempId && processedMessageIds.current.has(tempId))
      ) {
        return;
      }

      // Check if message belongs to current chat
      const senderId = message.sender?._id || message.sender;
      const receiverId = message.receiver?._id || message.receiver;

      if (
        selectedChatData?._id === senderId ||
        selectedChatData?._id === receiverId
      ) {
        // Mark as processed
        if (messageId) processedMessageIds.current.add(messageId);
        if (tempId) processedMessageIds.current.add(tempId);

        // Add message to Redux
        dispatch(addMessage(message));

        // ✅ Auto-mark as read if current user is receiver
        if (receiverId === currentUser?._id && selectedChatData?._id) {
          markMessageAsRead(selectedChatData._id).catch(console.error);
        }
      }
    };

    const handleMessageSent = (message: any) => {
      console.log("✅ Message sent confirmation:", message);

      const messageId = message._id;
      const tempId = message.tempId;

      if (messageId && processedMessageIds.current.has(messageId)) {
        return;
      }

      if (tempId) {
        const tempExists = selectedChatMessages.some(
          (m: any) => m._id === tempId || m.tempId === tempId,
        );

        if (tempExists) {
          if (messageId) processedMessageIds.current.add(messageId);
          dispatch(
            updateMessageId({
              tempId: tempId,
              realId: messageId,
              createdAt: message.createdAt,
            }),
          );
        } else {
          if (messageId && !processedMessageIds.current.has(messageId)) {
            processedMessageIds.current.add(messageId);
            dispatch(addMessage(message));
          }
        }
      } else {
        if (messageId && !processedMessageIds.current.has(messageId)) {
          processedMessageIds.current.add(messageId);
          dispatch(addMessage(message));
        }
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageSent", handleMessageSent);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageSent", handleMessageSent);
    };
  }, [
    socket,
    selectedChatData,
    selectedChatMessages,
    dispatch,
    currentUser,
    markMessageAsRead,
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChatData && socket) {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      const messageData = {
        sender: currentUser?._id,
        receiver: selectedChatData._id,
        content: newMessage.trim(),
        messageType: "text",
        tempId,
      };

      // Add optimistically to UI
      const optimisticMessage = {
        _id: tempId,
        tempId: tempId,
        sender: {
          _id: currentUser?._id,
          name: currentUser?.name,
          profilePicture: currentUser?.profilePicture,
        },
        receiver: {
          _id: selectedChatData._id,
          name: selectedChatData.name,
        },
        content: newMessage.trim(),
        messageType: "text",
        createdAt: new Date().toISOString(),
        isTemp: true,
        isRead: false,
        status: "sent",
      };

      processedMessageIds.current.add(tempId);
      dispatch(addMessage(optimisticMessage));

      socket.emit("sendMessage", messageData);
      setNewMessage("");
    }
  };

  if (!selectedChatData) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center">
          <User size={48} className="text-neutral-30 mx-auto mb-4" />
          <p className="text-neutral-45">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-neutral-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary-10/10 flex items-center justify-center overflow-hidden">
              {selectedChatData.profilePicture ? (
                <img
                  src={selectedChatData.profilePicture}
                  alt={selectedChatData.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={18} className="text-primary-10" />
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <p className="font-medium text-neutral-10">
              {selectedChatData.name}
            </p>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>

        <button className="p-2 hover:bg-neutral-50 rounded-lg transition-colors">
          <MoreVertical size={18} className="text-neutral-45" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center">
          <span className="text-xs text-neutral-45 bg-neutral-50 px-3 py-1 rounded-full">
            Today
          </span>
        </div>

        {selectedChatMessages.map((msg: any, idx: number) => {
          const isOwn =
            msg.sender?._id === currentUser?._id ||
            msg.sender === currentUser?._id;
          const isTemp = msg.isTemp;
          const isRead = msg.isRead || false;

          return (
            <div
              key={msg._id || msg.tempId || idx}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  isOwn
                    ? "bg-primary-10 text-white"
                    : "bg-neutral-50/60 text-neutral-10"
                } ${isTemp ? "opacity-80" : ""}`}
              >
                <p className="text-sm">{msg.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span
                    className={`text-xs ${
                      isOwn ? "text-white/70" : "text-neutral-45"
                    }`}
                  >
                    {isTemp
                      ? "Sending..."
                      : msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                  </span>
                  {isOwn && isTemp && (
                    <span className="text-xs text-white/50">⌛</span>
                  )}
                  {isOwn && !isTemp && (
                    <CheckCheck
                      size={12}
                      className={isRead ? "text-white" : "text-white/50"}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-neutral-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={isConnected ? "Type a message" : "Connecting..."}
            className="flex-1 px-4 py-2 border border-neutral-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10 disabled:opacity-50"
            disabled={!isConnected}
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected}
            className="px-4 py-2 bg-primary-10 text-white rounded-lg hover:bg-primary-10/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

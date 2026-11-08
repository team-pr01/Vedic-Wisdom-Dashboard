/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { useGetMyInboxQuery } from "../redux/Features/Chat/chatApi";

interface ChatContextType {
  socket: Socket | null;
  inbox: any[];
  isLoadingInbox: boolean;
  selectedChat: any | null;
  setSelectedChat: (chat: any) => void;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  typingUsers: any[];
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useSelector((state: any) => state.auth.user);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<any[]>([]);

  const {
    data: inboxData,
    isLoading: isLoadingInbox,
    refetch: refetchInbox,
  } = useGetMyInboxQuery(undefined);

  const inbox = inboxData?.data || [];

  useEffect(() => {
    if (!currentUser?._id) return;

    const newSocket = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
      {
        query: { userId: currentUser._id },
      },
    );

    setSocket(newSocket);
    newSocket.emit("addUser", currentUser._id);

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser?._id]);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessageRequest", (newChat) => {
      console.log(newChat);
      // Refresh the inbox so the new request appears in the sidebar
      refetchInbox();

      // Optional: Show a notification toast
      // toast.success("You have a new message request!");
    });

    return () => {
      socket.off("newMessageRequest");
    };
  }, [socket, refetchInbox]);

  useEffect(() => {
    if (!socket) return;

    socket.on("requestAcceptedJoinRoom", (conversationId) => {
      socket.emit("joinRoom", conversationId);
      console.log(`Joined new room after acceptance: ${conversationId}`);
    });

    return () => {
      socket.off("requestAcceptedJoinRoom");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("requestUpdated", ({ conversationId, status }) => {
      // If the active chat is the one that was accepted, update the UI instantly
      if (selectedChat?.conversationId === conversationId) {
        setSelectedChat((prev: any) => ({
          ...prev,
          messageRequestStatus: status,
        }));
      }

      // Refresh the sidebar
      refetchInbox();
    });

    return () => {
      socket.off("requestUpdated");
    };
  }, [socket, selectedChat, refetchInbox]);

  // Listen for incoming messages (Both ChatWindow and Inbox)
  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (message) => {
      // 1. Update the ChatWindow
      setMessages((prev) => [...prev, message]);

      // 2. Update the Inbox Sidebar
      refetchInbox();
    });

    socket.on("userTyping", ({ userId, userName, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          // Add user to typing list if not already there
          if (!prev.find((u) => u.userId === userId)) {
            return [...prev, { userId, userName }];
          }
          return prev;
        } else {
          // Remove user from typing list
          return prev.filter((u) => u.userId !== userId);
        }
      });
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
    };
  }, [socket, refetchInbox]);

  // Listen for Mark as Read (Real-time blue ticks)
  useEffect(() => {
    if (!socket) return;

    socket.on("messagesMarkedAsRead", ({ conversationId, userId }) => {
      // 1. Update the ChatWindow messages
      if (selectedChat?.conversationId === conversationId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (
              msg.sender === currentUser?._id ||
              msg.sender?._id === currentUser?._id
            ) {
              return {
                ...msg,
                readBy: [...(msg.readBy || []), userId],
              };
            }
            return msg;
          }),
        );
      }

      // 2. Update the Inbox Sidebar so the blue tick shows up in the ChatList
      refetchInbox();
    });

    return () => {
      socket.off("messagesMarkedAsRead");
    };
  }, [socket, selectedChat, currentUser?._id, refetchInbox]);

  useEffect(() => {
    if (selectedChat) {
      refetchInbox();
    }
  }, [selectedChat, refetchInbox]);

  return (
    <ChatContext.Provider
      value={{
        socket,
        inbox,
        isLoadingInbox,
        selectedChat,
        setSelectedChat,
        messages,
        setMessages,
        typingUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};

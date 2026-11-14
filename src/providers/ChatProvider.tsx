/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { useGetMyInboxQuery } from "../redux/Features/Chat/chatApi";
import { backendBaseUrl } from "../redux/API/baseApi";

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

    const newSocket = io(backendBaseUrl, {
      query: { userId: currentUser._id },
    });

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
      // 1. Update the ChatWindow with Optimistic UI Logic
      setMessages((prev) => {
        // ✅ Check if this message replaces an optimistic one
        const tempIndex = prev.findIndex((m) => m.tempId === message.tempId);

        if (tempIndex !== -1) {
          // Replace the temporary message with the real one
          const newMessages = [...prev];
          newMessages[tempIndex] = message;
          return newMessages;
        }

        // Prevent duplicates if it's a normal message
        if (prev.some((m) => m._id === message._id)) return prev;

        // Append new message from other users
        return [...prev, message];
      });

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
    if (!socket) return;

    // Listen for the leave event from backend
    socket.on("leaveSocketRoom", (conversationId) => {
      socket.emit("leaveRoom", conversationId);
      console.log(`Left socket room: ${conversationId}`);
    });

    return () => {
      socket.off("leaveSocketRoom");
    };
  }, [socket]);

  useEffect(() => {
    if (selectedChat) {
      refetchInbox();
    }
  }, [selectedChat, refetchInbox]);

  useEffect(() => {
    if (!socket) return;

    // Listen for reaction updates
    socket.on("messageReactionUpdated", ({ messageId, reactions }) => {
      // Update the messages state with the new reactions
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, reactions } : msg,
        ),
      );
    });

    return () => {
      socket.off("messageReactionUpdated");
    };
  }, [socket, setMessages]);

  useEffect(() => {
    if (!socket) return;

    socket.on("groupMembersUpdated", (updatedConversation) => {
      if (selectedChat?.conversationId === updatedConversation._id) {
        setSelectedChat((prev: any) => ({
          ...prev,
        }));
        refetchInbox();
      }
    });

    return () => {
      socket.off("groupMembersUpdated");
    };
  }, [socket, selectedChat]);

  useEffect(() => {
    if (!socket) return;

    socket.on("blockStatusChanged", ({ conversationId, blockedBy, action }) => {
      // Update selectedChat if it's the active chat
      if (selectedChat?.conversationId === conversationId) {
        setSelectedChat((prev: any) => {
          const newBlockedBy =
            action === "block"
              ? [...(prev.blockedBy || []), blockedBy]
              : (prev.blockedBy || []).filter(
                  (id: any) => id.toString() !== blockedBy.toString(),
                );

          return { ...prev, blockedBy: newBlockedBy };
        });
      }
      refetchInbox();
    });

    return () => {
      socket.off("blockStatusChanged");
    };
  }, [socket, selectedChat, refetchInbox]);

  useEffect(() => {
    if (!socket) return;

    // Listen for individual status changes
    socket.on("userStatusChanged", ({ userId, isOnline, lastActiveAt }) => {
      // 1. Update selected chat if it's the person we are talking to
      if (selectedChat?.otherUserId === userId) {
        setSelectedChat((prev: any) => ({
          ...prev,
          isOnline,
          lastActiveAt: lastActiveAt || prev.lastActiveAt,
        }));
      }

      // ✅ 2. Update the inbox sidebar by refetching the data from the backend
      refetchInbox();
    });

    return () => {
      socket.off("getOnlineUsers");
      socket.off("userStatusChanged");
    };
  }, [socket, selectedChat, refetchInbox]);

  useEffect(() => {
    if (!socket) return;

    socket.on("messageDeletedForMe", ({ messageId }) => {
      // Remove the message from the current chat window instantly
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));

      // Refetch inbox to update the last message preview (if this was the last message)
      refetchInbox();
    });

    return () => {
      socket.off("messageDeletedForMe");
    };
  }, [socket, refetchInbox]);

  useEffect(() => {
    if (!socket) return;

    socket.on("messageDeletedForEveryone", (updatedMessage) => {
      // Replace the old message with the updated "This message was deleted" message
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg,
        ),
      );
      refetchInbox();
    });

    return () => {
      socket.off("messageDeletedForEveryone");
    };
  }, [socket, refetchInbox]);

  useEffect(() => {
    if (!socket) return;

    socket.on("chatDeleted", ({ conversationId }) => {
      if (selectedChat?.conversationId === conversationId) {
        setSelectedChat(null);
      }

      // ✅ Force refetch with a tiny delay to ensure DB is updated
      setTimeout(() => {
        refetchInbox();
      }, 100);
    });

    return () => {
      socket.off("chatDeleted");
    };
  }, [socket, selectedChat, refetchInbox]);


  useEffect(() => {
    if (!socket) return;

    socket.on("messageEdited", (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
      );
      refetchInbox(); // Update sidebar if it was the last message
    });

    return () => {
      socket.off("messageEdited");
    };
  }, [socket, refetchInbox]);

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

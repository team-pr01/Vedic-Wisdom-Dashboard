/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { backendBaseUrl } from "../redux/API/baseApi";
import { useSelector, useDispatch } from "react-redux";
import {
  useCurrentUser,
  type TLoggedInUser,
} from "../redux/Features/Auth/authSlice";
import {
  addMessage,
  addToChatList,
  addOnlineUser,
  removeOnlineUser,
  setOnlineUsers,
  setChatList,
  type Message,
  selectSelectedChatData,
  selectSelectedChatType,
} from "../redux/Features/Chat/chatSlice";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    console.warn("useSocket must be used within a SocketProvider");
    return { socket: null, isConnected: false };
  }
  return context;
};

export const SocketProvider = ({ children }: any) => {
  const socket = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser) as TLoggedInUser;

  // ✅ Store selected chat data in refs to avoid selector issues in socket callbacks
  const selectedChatDataRef = useRef<any>(null);
  const selectedChatTypeRef = useRef<any>(null);

  // ✅ Update refs when selected chat changes
  const selectedChatData = useSelector(selectSelectedChatData);
  const selectedChatType = useSelector(selectSelectedChatType);

  useEffect(() => {
    selectedChatDataRef.current = selectedChatData;
    selectedChatTypeRef.current = selectedChatType;
  }, [selectedChatData, selectedChatType]);

  useEffect(() => {
    if (!user?._id) {
      console.log("No user, skipping socket connection");
      return;
    }

    // console.log("Initializing socket connection for user:", user._id);

    // Close existing connection if any
    if (socket.current) {
      socket.current.disconnect();
      socket.current = null;
    }

    socket.current = io(backendBaseUrl, {
      withCredentials: true,
      query: { userId: user._id },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.current.on("connect", () => {
      console.log("✅ Connected to socket server");
      setIsConnected(true);
    });

    socket.current.on("disconnect", () => {
      console.log("❌ Disconnected from socket server");
      setIsConnected(false);
    });

    socket.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    // Handle receiving message - ALWAYS add message
    socket.current.on("receiveMessage", (message: Message) => {
      // console.log("Received message in SocketProvider:", message);

      // Add to chat list if it's a new contact
      if (message.sender && typeof message.sender === "object") {
        dispatch(addToChatList(message.sender as any));
      }
      if (message.recipient && typeof message.recipient === "object") {
        dispatch(addToChatList(message.recipient as any));
      }

      // ALWAYS add message to store (ChatWindow will filter by selected chat)
      dispatch(addMessage(message));
    });

    // Handle message sent confirmation - ALWAYS add message
    socket.current.on("messageSent", (message: Message) => {
      // console.log("Message sent confirmation in SocketProvider:", message);

      // ALWAYS add message to store
      dispatch(addMessage(message));
    });

    // Handle chat list update
    socket.current.on("updateChatList", (chatList: any[]) => {
      // console.log("📋 Chat list updated in SocketProvider:", chatList);
      dispatch(setChatList(chatList));
    });

    // Handle online users
    socket.current.on("onlineUsers", (users: string[]) => {
      // console.log("👥 Online users:", users);
      dispatch(setOnlineUsers(users));
    });

    socket.current.on("userOnline", (userId: string) => {
      // console.log("🟢 User online:", userId);
      dispatch(addOnlineUser(userId));
    });

    socket.current.on("userOffline", (userId: string) => {
      // console.log("🔴 User offline:", userId);
      dispatch(removeOnlineUser(userId));
    });

    return () => {
      console.log("Cleaning up socket connection");
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [user?._id, dispatch]);

  return (
    <SocketContext.Provider value={{ socket: socket.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  _id?: string;
  sender?: string | { _id: string; name?: string; profilePicture?: string };
  receiver?: string | { _id: string; name?: string; profilePicture?: string };
  content?: string;
  attachments?: string[];
  createdAt?: string;
  [key: string]: unknown;
}

export interface ChatUser {
  _id: string;
  name?: string;
  email?: string;
  profilePicture?: string;
  [key: string]: unknown;
}

interface ChatState {
  selectedChatType: "group" | "contact" | undefined;
  selectedChatData: ChatUser | null;
  selectedChatMessages: Message[];
  chatList: ChatUser[];
  onlineUsers: string[];
}

const initialState: ChatState = {
  selectedChatType: undefined,
  selectedChatData: null,
  selectedChatMessages: [],
  chatList: [],
  onlineUsers: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChatType: (state, action: PayloadAction<"group" | "contact" | undefined>) => {
      state.selectedChatType = action.payload;
    },
    setSelectedChatData: (state, action: PayloadAction<ChatUser | null>) => {
      state.selectedChatData = action.payload;
    },
    setSelectedChatMessages: (state, action: PayloadAction<Message[]>) => {
      state.selectedChatMessages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;

      // Prevent duplicates
      const exists = state.selectedChatMessages.some(
        (m: any) =>
          (message._id && m._id === message._id) ||
          (message.tempId && m.tempId === message.tempId) ||
          (message.tempId && m._id === message.tempId)
      );

      if (exists) return;

      state.selectedChatMessages.push(message);
    },

    updateMessageId: (
      state,
      action: PayloadAction<{
        tempId: string;
        realId: string;
        createdAt?: string;
      }>
    ) => {
      const { tempId, realId, createdAt } = action.payload;

      const message = state.selectedChatMessages.find(
        (m: any) => m._id === tempId || m.tempId === tempId
      );

      if (!message) return;

      // If real message already exists remove it
      state.selectedChatMessages = state.selectedChatMessages.filter(
        (m: any) => m._id !== realId
      );

      message._id = realId;
      message.isTemp = false;

      if (createdAt) {
        message.createdAt = createdAt;
      }
    },
    setChatList: (state, action: PayloadAction<ChatUser[]>) => {
      state.chatList = action.payload;
    },
    addToChatList: (state, action: PayloadAction<ChatUser>) => {
      const exists = state.chatList.some(user => user._id === action.payload._id);
      if (!exists) {
        state.chatList.push(action.payload);
      }
    },
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action: PayloadAction<string>) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload);
    },
    clearChat: (state) => {
      state.selectedChatData = null;
      state.selectedChatType = undefined;
      state.selectedChatMessages = [];
    },
  },
});

// Export actions
export const {
  setSelectedChatType,
  setSelectedChatData,
  setSelectedChatMessages,
  addMessage,
  setChatList,
  addToChatList,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  clearChat,
  updateMessageId
} = chatSlice.actions;

// Export selectors
export const selectSelectedChatType = (state: { chat: ChatState }) => state.chat.selectedChatType;
export const selectSelectedChatData = (state: { chat: ChatState }) => state.chat.selectedChatData;
export const selectSelectedChatMessages = (state: { chat: ChatState }) => state.chat.selectedChatMessages;
export const selectChatList = (state: { chat: ChatState }) => state.chat.chatList;
export const selectOnlineUsers = (state: { chat: ChatState }) => state.chat.onlineUsers;
export const selectChat = (state: { chat: ChatState }) => state.chat;

export default chatSlice.reducer;
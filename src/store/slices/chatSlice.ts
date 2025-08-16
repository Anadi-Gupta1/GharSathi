import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, ChatMessage } from '../../types';

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  loading: boolean;
  error: string | null;
  typingUsers: string[];
}

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  loading: false,
  error: null,
  typingUsers: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    setActiveChat: (state, action: PayloadAction<Chat | null>) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ chatId: string; message: ChatMessage }>) => {
      const { chatId, message } = action.payload;
      
      // Add to active chat
      if (state.activeChat && state.activeChat.id === chatId) {
        state.activeChat.messages.push(message);
        state.activeChat.updatedAt = message.timestamp;
      }
      
      // Add to chats list
      const chatIndex = state.chats.findIndex(chat => chat.id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].messages.push(message);
        state.chats[chatIndex].updatedAt = message.timestamp;
        
        // Move to top of list
        const chat = state.chats[chatIndex];
        state.chats.splice(chatIndex, 1);
        state.chats.unshift(chat);
      }
    },
    markMessagesAsRead: (state, action: PayloadAction<{ chatId: string; messageIds: string[] }>) => {
      const { chatId, messageIds } = action.payload;
      
      // Update active chat
      if (state.activeChat && state.activeChat.id === chatId) {
        state.activeChat.messages.forEach(message => {
          if (messageIds.includes(message.id)) {
            message.isRead = true;
          }
        });
      }
      
      // Update chats list
      const chatIndex = state.chats.findIndex(chat => chat.id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].messages.forEach(message => {
          if (messageIds.includes(message.id)) {
            message.isRead = true;
          }
        });
      }
    },
    setTypingUsers: (state, action: PayloadAction<string[]>) => {
      state.typingUsers = action.payload;
    },
    addTypingUser: (state, action: PayloadAction<string>) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action: PayloadAction<string>) => {
      state.typingUsers = state.typingUsers.filter(userId => userId !== action.payload);
    },
    setChatLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setChatError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearChatError: (state) => {
      state.error = null;
    },
    clearChats: (state) => {
      state.chats = [];
      state.activeChat = null;
      state.typingUsers = [];
    },
  },
});

export const {
  setChats,
  setActiveChat,
  addMessage,
  markMessagesAsRead,
  setTypingUsers,
  addTypingUser,
  removeTypingUser,
  setChatLoading,
  setChatError,
  clearChatError,
  clearChats,
} = chatSlice.actions;

export default chatSlice.reducer;

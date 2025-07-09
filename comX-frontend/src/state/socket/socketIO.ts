import { Message } from "@/types/Chat";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  isConnected: boolean;
  messages: Message[];
}

const initialState: SocketState = {
  isConnected: false,
  messages: [],
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { setConnected, addMessage, clearMessages } = socketSlice.actions;
export default socketSlice.reducer;

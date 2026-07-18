import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { readPersisted, writePersisted } from "@/lib/persistedState";

const ACTIVE_CHANNEL_KEY = "active-channel";

const initialState: number = readPersisted(ACTIVE_CHANNEL_KEY, 17, (raw) => parseInt(raw, 10));

const activeChannelSlice = createSlice({
  name: "active-channel",
  initialState,
  reducers: {
    setActiveChannel(_state, action: PayloadAction<number>) {
      writePersisted(ACTIVE_CHANNEL_KEY, action.payload);
      return action.payload;
    },
  },
});

export const { setActiveChannel } = activeChannelSlice.actions;
export default activeChannelSlice.reducer;

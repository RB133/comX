import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { readPersisted, writePersisted } from "@/lib/persistedState";

const ACTIVE_SERVER_KEY = "active-server";

const initialState: number = readPersisted(ACTIVE_SERVER_KEY, 2, (raw) => parseInt(raw, 10));

const activeServerSlice = createSlice({
  name: "active-Server",
  initialState,
  reducers: {
    setActiveServer(_state, action: PayloadAction<number>) {
      writePersisted(ACTIVE_SERVER_KEY, action.payload);
      return action.payload;
    },
  },
});

export const { setActiveServer } = activeServerSlice.actions;
export default activeServerSlice.reducer;

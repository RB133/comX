import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { readPersisted, writePersisted } from "@/lib/persistedState";

const TAB_KEY = "tab";

const initialState: string = readPersisted(TAB_KEY, "Home", (raw) => raw);

const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setTab(_state, action: PayloadAction<string>) {
      writePersisted(TAB_KEY, action.payload);
      return action.payload;
    },
  },
});

export const { setTab } = tabSlice.actions;
export default tabSlice.reducer;

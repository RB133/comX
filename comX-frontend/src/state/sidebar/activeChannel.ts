import { createSlice } from "@reduxjs/toolkit";

function checkLocalStorageForActiveChannel(): number {
  const item = window.localStorage.getItem("active-channel");
  return typeof item === "number" ? item : 17;
}

const initialState: number = checkLocalStorageForActiveChannel();

const activeChannelSlice = createSlice({
  name: "active-channel",
  initialState,
  reducers: {
    setActiveChannel(state: number, payload) {
      window.localStorage.setItem("active-channel", payload.payload);
      return payload.payload;
    },
  },
});

export const { setActiveChannel } = activeChannelSlice.actions;
export default activeChannelSlice.reducer;

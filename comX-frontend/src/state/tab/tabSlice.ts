import { createSlice } from "@reduxjs/toolkit";

function checkLocalStorageForTab(): string {
  const item = window.localStorage.getItem("tab");
  return typeof item === "string" ? item : "Home";
}

const initialState: string = checkLocalStorageForTab();

const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setTab(state , payload) {
      window.localStorage.setItem("tab", payload.payload);
      return payload.payload;
    },
  },
});

export const { setTab } = tabSlice.actions;
export default tabSlice.reducer;

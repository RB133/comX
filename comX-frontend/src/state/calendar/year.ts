import { createSlice } from "@reduxjs/toolkit";
import { DateTime } from "luxon";

function checkLocalStorageForYear(): string {
  const item = window.localStorage.getItem("calendar-year");
  return typeof item === "string" ? item : DateTime.now().year.toString();
}

const initialState: string = checkLocalStorageForYear();

const yearSlice = createSlice({
  name: "year",
  initialState,
  reducers: {
    setYear(state: string, payload) {
      window.localStorage.setItem("calendar-year", payload.payload);
      return payload.payload;
    },
  },
});

export const { setYear } = yearSlice.actions;
export default yearSlice.reducer;

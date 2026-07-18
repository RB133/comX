import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateTime } from "luxon";
import { readPersisted, writePersisted } from "@/lib/persistedState";

const YEAR_KEY = "calendar-year";

const initialState: string = readPersisted(YEAR_KEY, DateTime.now().year.toString(), (raw) => raw);

const yearSlice = createSlice({
  name: "year",
  initialState,
  reducers: {
    setYear(_state, action: PayloadAction<string>) {
      writePersisted(YEAR_KEY, action.payload);
      return action.payload;
    },
  },
});

export const { setYear } = yearSlice.actions;
export default yearSlice.reducer;

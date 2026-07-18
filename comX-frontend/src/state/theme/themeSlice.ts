import { Theme } from "@/types/Theme";
import { createSlice } from "@reduxjs/toolkit";
import { readPersisted, writePersisted } from "@/lib/persistedState";

const THEME_KEY = "theme";

const initialState: Theme = readPersisted(THEME_KEY, "light", (raw) =>
  raw === "dark" ? "dark" : "light"
);

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setDark: (_state: Theme): Theme => {
      writePersisted(THEME_KEY, "dark");
      return "dark";
    },
    setLight: (_state: Theme): Theme => {
      writePersisted(THEME_KEY, "light");
      return "light";
    },
  },
});

export const { setDark, setLight } = themeSlice.actions;

export default themeSlice.reducer;

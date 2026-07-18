import { LoginDetails } from "@/types/UserProfile";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { readPersisted } from "@/lib/persistedState";

const USER_KEY = "user";

const persistedUser = readPersisted<LoginDetails | null>(USER_KEY, null, (raw) => JSON.parse(raw));

const initialState: {
  user: LoginDetails | null;
  isLoggedIn: boolean;
} = {
  user: persistedUser,
  isLoggedIn: persistedUser !== null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<LoginDetails>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem(USER_KEY);
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

import { LoginDetails } from '@/types/UserProfile';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const loadUserFromLocalStorage = (): LoginDetails | null => {
  const userFromLocalStorage = localStorage.getItem('user');
  return userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null;
};

const initialState: {
  user: LoginDetails | null;  
  isLoggedIn: boolean; 
} = {
  user: loadUserFromLocalStorage(),
  isLoggedIn: !!loadUserFromLocalStorage(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<LoginDetails>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;   
      state.isLoggedIn = false;   
      localStorage.removeItem('user'); 
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

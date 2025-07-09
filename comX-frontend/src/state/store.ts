import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./theme/themeSlice";
import tabSlice from "./tab/tabSlice";
import userSlice from "./userDetails/userDetails";
import activeChannelSlice from "./sidebar/activeChannel";
import activeServerSlice from "./sidebar/activeServer";
import yearSlice from "./calendar/year";
import socketSlice from "./socket/socketIO"

export const store = configureStore({
  reducer: {
    theme: themeSlice,
    tab: tabSlice,
    userDetails: userSlice,
    activeChannel: activeChannelSlice,
    activeServer: activeServerSlice,
    year: yearSlice,
    socket: socketSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

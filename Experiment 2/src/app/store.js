import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/postsSlice";
import platformsReducer from "../features/platformsSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer,
  },
});
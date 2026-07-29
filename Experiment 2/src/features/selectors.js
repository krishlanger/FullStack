import { createSelector } from "@reduxjs/toolkit";

const selectPosts = (state) => state.posts.posts;

export const totalPosts = createSelector(
  [selectPosts],
  (posts) => posts.length
);
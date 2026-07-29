import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [
    "Instagram",
    "LinkedIn",
    "Twitter (X)",
    "Facebook",
    "YouTube",
  ],
};

const platformsSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {},
});

export default platformsSlice.reducer;
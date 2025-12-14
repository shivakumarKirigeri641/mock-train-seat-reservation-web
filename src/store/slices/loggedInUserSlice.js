import { createSlice } from "@reduxjs/toolkit";

const loggedInUserSlice = createSlice({
  name: "loggedInUser",
  initialState: null,
  reducers: {
    addloggedInUser: (state, action) => {
      return action.payload;
    },
    removeloggedInUser: (state, action) => {
      return null;
    },
  },
});
export const { addloggedInUser, removeloggedInUser } =
  loggedInUserSlice.actions;
export default loggedInUserSlice.reducer;

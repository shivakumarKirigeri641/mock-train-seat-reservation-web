import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "loggeduser",
  initialState: null,
  reducers: {
    addloggeduser: (state, action) => {
      return action.payload;
    },
    removeloggeduser: (state, action) => {
      return null;
    },
  },
});
export const { addloggeduser, removeloggeduser } = userSlice.actions;
export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const apiendpointsSlice = createSlice({
  name: "apiendpoints",
  initialState: [],
  reducers: {
    addapiendpointsSlice: (state, action) => {
      return action.payload;
    },
    removeapiendpointsSlice: (state, action) => {
      return [];
    },
  },
});
export const { addapiendpointsSlice, removeapiendpointsSlice } =
  apiendpointsSlice.actions;
export default apiendpointsSlice.reducer;

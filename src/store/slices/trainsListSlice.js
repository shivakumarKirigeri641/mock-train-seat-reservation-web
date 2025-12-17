import { createSlice } from "@reduxjs/toolkit";

const trainsListSlice = createSlice({
  name: "trainsList",
  initialState: [],
  reducers: {
    update_trainslist: (state, action) => {
      return action.payload;
    },
    remove_trainslist: (state, action) => {
      return null;
    },
  },
});
export const { update_trainslist, remove_trainslist } = trainsListSlice.actions;
export default trainsListSlice.reducer;

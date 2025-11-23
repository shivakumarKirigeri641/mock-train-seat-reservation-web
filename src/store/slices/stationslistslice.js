import { createSlice } from "@reduxjs/toolkit";

const stationslistslice = createSlice({
  name: "stationslist",
  initialState: [],
  reducers: {
    addstations: (state, action) => {
      console.log("inside redux:", action.payload);
      return action.payload;
    },
    removestations: (state, action) => {
      return null;
    },
  },
});
export const { addstations, removestations } = stationslistslice.actions;
export default stationslistslice.reducer;

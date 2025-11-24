import { createSlice } from "@reduxjs/toolkit";

const trainScheduleSlice = createSlice({
  name: "trainSchedule",
  initialState: [],
  reducers: {
    update_trainSchedule: (state, action) => {
      console.log("schedule:", action.payload);
      return action.payload;
    },
    remove_trainSchedule: (state, action) => {
      return null;
    },
  },
});
export const { update_trainSchedule, remove_trainSchedule } =
  trainScheduleSlice.actions;
export default trainScheduleSlice.reducer;

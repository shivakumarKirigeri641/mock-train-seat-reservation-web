import { createSlice } from "@reduxjs/toolkit";

const sourcedestinationdojSlice = createSlice({
  name: "stationslistslicsourcedestinationdoj",
  initialState: {
    selected_source: {},
    selected_destination: {},
    date_of_journey: new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    }),
  },
  reducers: {
    update_source: (state, action) => {
      state.selected_source = action.payload;
    },
    update_destination: (state, action) => {
      state.selected_destination = action.payload;
    },
    update_date_of_journey: (state, action) => {
      state.date_of_journey = action.payload;
    },
  },
});
export const { update_source, update_destination, update_date_of_journey } =
  sourcedestinationdojSlice.actions;
export default sourcedestinationdojSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import stationslistReducer from "./slices/stationslistslice";
import stationslistslicsourcedestinationdojReducer from "./slices/sourcedestinationdojSlice";
import trainsListReducer from "./slices/trainsListSlice";
import trainScheduleReducer from "./slices/trainScheduleSlice";
const appStore = configureStore({
  reducer: {
    stationslist: stationslistReducer,
    stationslistslicsourcedestinationdoj:
      stationslistslicsourcedestinationdojReducer,
    trainsList: trainsListReducer,
    trainSchedule: trainScheduleReducer,
  },
});
export default appStore;

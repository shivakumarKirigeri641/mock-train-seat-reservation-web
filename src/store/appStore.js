import { configureStore } from "@reduxjs/toolkit";
import stationslistReducer from "./slices/stationslistslice";
import stationslistslicsourcedestinationdojReducer from "./slices/sourcedestinationdojSlice";
import trainsListReducer from "./slices/trainsListSlice";
import loggeduserReducer from "./slices/userSlice";
import trainScheduleReducer from "./slices/trainScheduleSlice";
const appStore = configureStore({
  reducer: {
    stationslist: stationslistReducer,
    stationslistslicsourcedestinationdoj:
      stationslistslicsourcedestinationdojReducer,
    trainsList: trainsListReducer,
    trainSchedule: trainScheduleReducer,
    loggeduser: loggeduserReducer,
  },
});
export default appStore;

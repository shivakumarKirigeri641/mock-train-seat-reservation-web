import { configureStore } from "@reduxjs/toolkit";
import stationslistReducer from "./slices/stationslistslice";
import stationslistslicsourcedestinationdojReducer from "./slices/sourcedestinationdojSlice";
import trainsListReducer from "./slices/trainsListSlice";
import loggeduserReducer from "./slices/userSlice";
import trainScheduleReducer from "./slices/trainScheduleSlice";
import apiendpointsReducer from "./slices/apiendpointsSlice";
const appStore = configureStore({
  reducer: {
    stationslist: stationslistReducer,
    stationslistslicsourcedestinationdoj:
      stationslistslicsourcedestinationdojReducer,
    trainsList: trainsListReducer,
    trainSchedule: trainScheduleReducer,
    loggeduser: loggeduserReducer,
    apiendpoints: apiendpointsReducer,
  },
});
export default appStore;

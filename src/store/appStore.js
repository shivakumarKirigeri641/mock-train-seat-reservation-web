import { configureStore } from "@reduxjs/toolkit";
import stationslistReducer from "./slices/stationslistslice";
import stationslistslicsourcedestinationdojReducer from "./slices/sourcedestinationdojSlice";
import trainsListReducer from "./slices/trainsListSlice";
const appStore = configureStore({
  reducer: {
    stationslist: stationslistReducer,
    stationslistslicsourcedestinationdoj:
      stationslistslicsourcedestinationdojReducer,
    trainsList: trainsListReducer,
  },
});
export default appStore;

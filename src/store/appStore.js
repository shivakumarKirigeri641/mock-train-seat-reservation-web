import { configureStore } from "@reduxjs/toolkit";
import stationslistReducer from "./slices/stationslistslice";
import stationslistslicsourcedestinationdojReducer from "./slices/sourcedestinationdojSlice";
const appStore = configureStore({
  reducer: {
    stationslist: stationslistReducer,
    stationslistslicsourcedestinationdoj:
      stationslistslicsourcedestinationdojReducer,
  },
});
export default appStore;

import { combineReducers } from "@reduxjs/toolkit";
import exercise1 from "../demo/store/exercise1/exercise1.slice";

const rootReducer = combineReducers({
  exercise1,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

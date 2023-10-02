import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import projectsPageReducer from "./Reducer";

export const store = configureStore({
  reducer: {
    projectsPage: projectsPageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

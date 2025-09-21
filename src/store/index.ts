import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import recommendationReducer from "./slices/recommendationSlice";
import cardReducer from "./slices/cardSlice";
import applicationReducer from "./slices/applicationSlice";
import notificationReducer from "./slices/notificationSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    recommendations: recommendationReducer,
    cards: cardReducer,
    applications: applicationReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

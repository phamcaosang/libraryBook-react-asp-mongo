import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlicer from "./userSlicer";
import cartSlicer from "./cartSlicer";
import favoritesSlicer from "./favoritesSlicer";
import loadingSlicer from "./loadingSlicer";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const rootReducer = combineReducers({ user: userSlicer, cart: cartSlicer, favor:  favoritesSlicer, loading: loadingSlicer});

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
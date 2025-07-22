// redux/Store/store.ts
import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { userReducer } from "../Reducers/userReducer";
import { postReducer } from "../Reducers/postsReducers";
import { thunk } from "redux-thunk";

const middleWare=[thunk]
const enhancer=compose(applyMiddleware(...middleWare))

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  posts:postReducer
});


// Persist config WITHOUT explicit types
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // only user slice is persisted
};

// Wrap combined reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer as any);

// Create the store
export const store = createStore(persistedReducer, undefined, enhancer);

// Create the persistor
export const persistor = persistStore(store);

// For TypeScript: RootState will represent the full Redux state tree
export type RootState = ReturnType<typeof rootReducer>;

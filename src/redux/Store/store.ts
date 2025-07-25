import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { userReducer } from "../Reducers/userReducer";
import { postReducer } from "../Reducers/postsReducers";
import { thunk } from "redux-thunk";
import errorReducer from "../Reducers/errorReducer";

const middleWare = [thunk];
const enhancer = compose(applyMiddleware(...middleWare));

const rootReducer = combineReducers({
  user: userReducer,
  posts: postReducer,
  error: errorReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer as any);

export const store = createStore(persistedReducer, undefined, enhancer);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;

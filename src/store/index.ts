import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices
import authSlice from './slices/authSlice';
import assessmentSlice from './slices/assessmentSlice';
import assignmentSlice from './slices/assignmentSlice';
import questionSlice from './slices/questionSlice';
import certificateSlice from './slices/certificateSlice';
import uiSlice from './slices/uiSlice';

// Import API slices
import { authApi } from './api/authApi';
import { assessmentApi } from './api/assessmentApi';
import { assignmentApi } from './api/assignmentApi';
import { questionApi } from './api/questionApi';
import { certificateApi } from './api/certificateApi';
import { userApi } from './api/userApi';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
};

const rootReducer = combineReducers({
  auth: authSlice,
  assessment: assessmentSlice,
  assignment: assignmentSlice,
  question: questionSlice,
  certificate: certificateSlice,
  ui: uiSlice,
  // API slices
  [authApi.reducerPath]: authApi.reducer,
  [assessmentApi.reducerPath]: assessmentApi.reducer,
  [assignmentApi.reducerPath]: assignmentApi.reducer,
  [questionApi.reducerPath]: questionApi.reducer,
  [certificateApi.reducerPath]: certificateApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      authApi.middleware,
      assessmentApi.middleware,
      assignmentApi.middleware,
      questionApi.middleware,
      certificateApi.middleware,
      userApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
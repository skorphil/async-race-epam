import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { backendApi } from '@/services';
import raceSlice from './raceSlice';
import winnersPageSlice from './winnersPageSlice';
import garagePageSlice from './garagePageSlice';

export const store = configureStore({
  reducer: {
    [raceSlice.name]: raceSlice.reducer,
    [garagePageSlice.name]: garagePageSlice.reducer,
    [winnersPageSlice.name]: winnersPageSlice.reducer,
    [backendApi.reducerPath]: backendApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(backendApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

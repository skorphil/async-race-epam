import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type GaragePageState = {
  page?: number;
};

const initialState: GaragePageState = {};

const garagePageSlice = createSlice({
  name: 'garagePage',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      const page = action.payload;
      state.page = page;
    },
  },
});

export default garagePageSlice;
export const garagePageActions = garagePageSlice.actions;

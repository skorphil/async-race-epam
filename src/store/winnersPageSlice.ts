import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SortOption = 'wins' | 'id' | 'time';
type OrderOption = 'ASC' | 'DESC';

type WinnersState = {
  sort?: SortOption;
  page?: number;
  order?: OrderOption;
};

const initialState: WinnersState = {};

const winnersPageSlice = createSlice({
  name: 'winnersPage',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      const page = action.payload;
      state.page = page;
    },
    setSort: (state, action: PayloadAction<SortOption>) => {
      const sort = action.payload;
      state.sort = sort;
    },
    setOrder: (state, action: PayloadAction<OrderOption>) => {
      const order = action.payload;
      state.order = order;
    },
  },
});

export default winnersPageSlice;
export const winnersPageActions = winnersPageSlice.actions;

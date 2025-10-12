import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type NewCarState = {
  name: string;
  color: string;
  nameErrors: string[];
};

const initialState: NewCarState = {
  name: '',
  color: '#FFFFFF',
  nameErrors: [],
};

const newCarFormSlice = createSlice({
  name: 'newCarForm',
  initialState,
  reducers: {
    setFormState: (state, action: PayloadAction<Partial<NewCarState>>) => {
      const newState = action.payload;
      return { ...state, ...newState };
    },
  },
});

export default newCarFormSlice;
export const newCarFormActions = newCarFormSlice.actions;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type CarState = {
  name: string;
  color: string;
  nameErrors: string[];
};

type CarsFormsState = Record<number, CarState>;
type CarsFormPayload = Partial<CarState> & { id: number };

const initialState: CarsFormsState = {};

const carFormSlice = createSlice({
  name: 'carForm',
  initialState,
  reducers: {
    setFormState: (state, action: PayloadAction<CarsFormPayload>) => {
      const { id, ...car } = action.payload;
      state[id] = { ...state[id], ...car };
    },
  },
});

export default carFormSlice;
export const carFormActions = carFormSlice.actions;

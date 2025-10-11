import {
  createSlice,
  isRejectedWithValue,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { engineApi } from '@/services';

type CarRaceState = {
  ongoingRequest: undefined | string;
  state: 'drive' | 'broken' | 'ready' | 'starting' | 'finished' | null;
  driveStarted?: number;
  driveStopped?: number;
  time?: number;
};

type SortOption = 'wins' | 'id' | 'time';
type OrderOption = 'ASC' | 'DESC';

type RaceState =
  | {
      uiState: {
        sort?: SortOption;
        page?: number;
        order?: OrderOption;
      };
      cars: Record<number, CarRaceState>;
    }
  | undefined;

const initialState: RaceState = {
  cars: {},
  uiState: {},
};

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    resetRace: (state) => {
      state.cars = {};
    },
    resetCarRace: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      delete state.cars[id];
    },
    setPage: (state, action: PayloadAction<number>) => {
      const page = action.payload;
      state.uiState.page = page;
    },
    setSort: (state, action: PayloadAction<SortOption>) => {
      const sort = action.payload;
      state.uiState.sort = sort;
    },
    setOrder: (state, action: PayloadAction<OrderOption>) => {
      const order = action.payload;
      state.uiState.order = order;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        engineApi.endpoints.startEngine.matchPending,
        (state, action) => {
          const id = action.meta.arg.originalArgs;
          const currentRequestId = action.meta.requestId;
          state.cars[id] = {
            ...state.cars[id],
            ongoingRequest: currentRequestId,
            state: 'starting',
          };
        },
      )
      .addMatcher(
        engineApi.endpoints.startEngine.matchFulfilled,
        (state, action) => {
          const { distance, velocity } = action.payload;
          const id = action.meta.arg.originalArgs;
          state.cars[id] = {
            ...state.cars[id],
            ongoingRequest: undefined,
            state: 'ready',
            time: distance / velocity,
          };
        },
      )
      .addMatcher(
        engineApi.endpoints.startDrive.matchPending,
        (state, action) => {
          const id = action.meta.arg.originalArgs;
          const currentRequestId = action.meta.requestId;
          state.cars[id] = {
            ...state.cars[id],
            ongoingRequest: currentRequestId,
            driveStarted: Date.now(),
            state: 'drive',
          };
        },
      )
      .addMatcher(
        engineApi.endpoints.startDrive.matchRejected,
        (state, action) => {
          const id = action.meta.arg.originalArgs;
          if (isRejectedWithValue(action)) {
            if (action.payload?.status === 500) {
              state.cars[id] = {
                ...state.cars[id],
                ongoingRequest: undefined,
                driveStopped: Date.now(),
                state: 'broken',
              };
            }
          }
        },
      )
      .addMatcher(
        engineApi.endpoints.startDrive.matchFulfilled,
        (state, action) => {
          const id = action.meta.arg.originalArgs;
          state.cars[id] = {
            ...state.cars[id],
            ongoingRequest: undefined,
            driveStopped: Date.now(),
            state: 'finished',
          };
        },
      );
  },
});

export default raceSlice;

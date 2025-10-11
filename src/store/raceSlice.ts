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

type RaceState = {
  cars: Record<number, CarRaceState>;
};

const initialState: RaceState = {
  cars: {},
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

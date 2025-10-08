import { createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import { engineApi } from '@/services';

type CarRaceState = {
  state: 'drive' | 'broken' | 'ready' | 'starting' | 'finished' | null;
  driveStarted?: number;
  driveStopped?: number;
  time?: number;
};

type RaceState = Record<number, CarRaceState>;

const initialState: RaceState = {};

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        engineApi.endpoints.startEngine.matchPending,
        (state, action) => {
          const id = action.meta.arg.originalArgs;
          state[id] = {
            ...state[id],
            state: 'starting',
          };
        },
      )
      .addMatcher(
        engineApi.endpoints.startEngine.matchFulfilled,
        (state, action) => {
          const { distance, velocity } = action.payload;
          const id = action.meta.arg.originalArgs;
          state[id] = {
            ...state[id],
            state: 'ready',
            time: distance / velocity,
          };
        },
      )
      .addMatcher(
        engineApi.endpoints.startDrive.matchPending,
        (state, action) => {
          const id = action.meta.arg.originalArgs;
          state[id] = {
            ...state[id],
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
              state[id] = {
                ...state[id],
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
          state[id] = {
            ...state[id],
            driveStopped: Date.now(),
            state: 'finished',
          };
        },
      );
  },
});

export default raceSlice;

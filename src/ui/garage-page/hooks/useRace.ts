import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Car } from '@/model';
import { engineApi, garageApi, winnersApi } from '@/services';
import raceSlice from '@/store/raceSlice';
import { store, type AppDispatch, type RootState } from '@/store/store';
import { RaceContext } from '../../providers';

type UseRaceProps = {
  cars: Car[];
};

/**
 * Hook, responsible for managing race.
 * Uses shared useRef with ongoing request promises to abort ongoing requests
 * when resetting the car's state(engine type=stopped)
 */
function useRace(props: UseRaceProps) {
  const ongoingRequests = useContext(RaceContext);
  const { cars: carsOnPage } = props;
  const dispatch = useDispatch<AppDispatch>();
  const [startDrive] = engineApi.useStartDriveMutation();
  const [startEngine] = engineApi.useStartEngineMutation();
  const [stopEngine] = engineApi.useStopEngineMutation();
  const { resetCarRace, setWinner } = raceSlice.actions;
  const raceState = useSelector((state: RootState) => state.race);
  const [updateWinner] = winnersApi.useUpdateWinnerMutation();
  const [getWinner] = winnersApi.useLazyGetWinnerQuery();
  const [addWinner] = winnersApi.useAddWinnerMutation();

  /**
   * Abort driving mode request, stops the engine
   * and set car to it's initial state
   * @param id car's id
   */
  async function carReset(id: number) {
    if (ongoingRequests[id] instanceof Promise) ongoingRequests[id].abort();
    await stopEngine(id);
    dispatch(resetCarRace(id));
  }

  /**
   * Starts the engine, starts driving mode
   * @param id car's id
   * @returns RTK query promise to abort driving if needed
   */
  async function carStart(id: number) {
    const startingEnginePromise = startEngine(id);
    ongoingRequests[id] = startingEnginePromise;
    if ((await startingEnginePromise).error) return;
    const drivePromise = startDrive(id);
    ongoingRequests[id] = drivePromise;
    await drivePromise;
  }

  /**
   * Adds winner to server
   * @param id car's id
   * @param time car's time
   */
  async function saveWinner(id: number, time: number) {
    const winner = await getWinner(id);
    if (winner.data) {
      const newTime = Math.min(winner.data.time, time);
      updateWinner({
        id,
        time: newTime,
        wins: winner.data.wins + 1,
      });
    } else {
      addWinner({
        id,
        time,
        wins: 1,
      });
    }
  }

  /**
   * Starts all cars' engines
   * starts drive mode and handle winner on first finish
   */
  async function raceStart() {
    const enginePromises = carsOnPage.map(({ id }) => {
      const enginePromise = startEngine(id);
      ongoingRequests[id] = enginePromise;
      return enginePromise;
    });
    await Promise.allSettled(enginePromises);
    const carPromises = carsOnPage.map(({ id }) => {
      // Ignore cars that possibly being reset during race
      if (!Object.hasOwn(store.getState().race.cars, id)) return undefined;
      const drivePromise = startDrive(id);
      ongoingRequests[id] = drivePromise;
      return drivePromise.unwrap().then(() => id);
    });
    const winner = await Promise.any(carPromises);
    // TODO Popup call
    if (winner) {
      const { time } = store.getState().race.cars[winner];
      const roundedTime = Math.round(((time || 0) / 1000) * 100) / 100;
      const selectCarResult = garageApi.endpoints.getCar.select(winner);
      const queryResult = selectCarResult(store.getState());
      const { name } = queryResult.data || { name: '' };
      saveWinner(winner, roundedTime);
      dispatch(
        setWinner({
          name,
          time: roundedTime,
        }),
      );
      setTimeout(() => {
        dispatch(setWinner(undefined));
      }, 10000);
    }
  }

  /**
   * Aborts all pending driving mode requests,
   * stops all engines, resets cars to initial state
   */
  async function raceReset() {
    const carResetPromises = Object.keys(raceState.cars).map((id) =>
      carReset(Number(id)),
    ); // Unexpected newline before ')'.eslintfunction-paren-newline
    Promise.all(carResetPromises);
  }

  return { raceReset, carReset, raceStart, carStart, raceState, saveWinner };
}

export default useRace;

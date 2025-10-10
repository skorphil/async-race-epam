import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Car } from '@/model';
import { engineApi, winnersApi } from '@/services';
import raceSlice from '@/store/raceSlice';
import { store, type AppDispatch, type RootState } from '@/store/store';
import { RaceContext } from '../providers';

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
  const { resetCarRace } = raceSlice.actions;
  const raceState = useSelector((state: RootState) => state.race);
  const [updateWinner] = winnersApi.useUpdateWinnerMutation();
  const [getWinner] = winnersApi.useLazyGetWinnerQuery();
  const [addWinner] = winnersApi.useAddWinnerMutation();

  async function carReset(id: number) {
    if (ongoingRequests[id] instanceof Promise) ongoingRequests[id].abort();
    await stopEngine(id);
    dispatch(resetCarRace(id));
  }

  async function carStart(id: number) {
    const startingEnginePromise = startEngine(id);
    ongoingRequests[id] = startingEnginePromise;
    if ((await startingEnginePromise).error) return;
    const drivePromise = startDrive(id);
    ongoingRequests[id] = drivePromise;
    await drivePromise;
  }

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
    try {
      const winner = await Promise.any(carPromises);
      // TODO Popup call
      if (winner) {
        const { time } = store.getState().race.cars[winner];
        saveWinner(winner, Math.round(((time || 0) / 1000) * 100) / 100);
      }
      console.info('winner', winner);
    } catch {
      console.error('No cars have finished');
    }
  }

  async function raceReset() {
    const carResetPromises = Object.keys(raceState.cars).map((id) =>
      carReset(Number(id)),
    );
    Promise.all(carResetPromises);
  }

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

  return { raceReset, carReset, raceStart, carStart, raceState, saveWinner };
}

export default useRace;

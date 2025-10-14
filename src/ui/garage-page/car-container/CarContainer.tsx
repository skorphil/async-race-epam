import { useSelector } from 'react-redux';
import { TrashIcon } from 'lucide-react';
import { garageApi, winnersApi } from '@/services';
import type { RootState } from '@/store/store';
import useRace from '../useRace';
import { RaceTrack } from '../race-track';
import { EditCarForm } from '../edit-car-form';
import styles from './CarContainer.module.css';

type CarGarageContainerProps = {
  id: number;
};

/**
 * Container to display car info in the garage
 * @id Car's ID
 */
function CarContainer(props: CarGarageContainerProps) {
  const { carReset, carStart } = useRace({ cars: [] });
  const { id } = props;
  const [deleteCar] = garageApi.useDeleteCarMutation();
  const [deleteWinner] = winnersApi.useDeleteWinnerMutation();
  const raceStatus = useSelector((state: RootState) => state.race.cars[id]);
  const animation = calculateAnimation({
    carState: raceStatus?.state,
    driveStarted: raceStatus?.driveStarted,
    driveStopped: raceStatus?.driveStopped,
    time: raceStatus?.time,
  });
  const { data } = garageApi.useGetCarQuery(id);
  const { color, name } = data || {};
  function handleCarDelete(carId: number) {
    deleteCar(carId);
    deleteWinner(carId);
  }

  return (
    <div className={styles.container}>
      {name && color && <EditCarForm id={id} color={color} name={name} />}
      <RaceTrack
        trackColor={color || '#ffffff'}
        timeToFinish={animation.timeToFinish}
        initialPosition={animation.initialPosition}
        targetPosition={animation.targetPosition}
      />
      <div className={styles.carControl}>
        <div className={styles.carButtons}>
          <button
            className="secondary outline"
            type="button"
            onClick={() => handleCarDelete(id)}
          >
            <TrashIcon />
          </button>
          {(raceStatus?.state ?? null) === null ? (
            <button
              type="button"
              className="secondary"
              onClick={() => carStart(id)}
            >
              Start
            </button>
          ) : (
            <button
              type="button"
              className="secondary"
              onClick={() => carReset(id)}
            >
              Reset
            </button>
          )}
        </div>
        <div className="grid">
          <small>{raceStatus?.state || 'idle'}</small>
        </div>
      </div>
    </div>
  );
}

export default CarContainer;

type AnimationParams = {
  initialPosition?: number;
  targetPosition?: number;
  timeToFinish?: number;
};

type CalculateAnimationParams = {
  carState?: string | null;
  driveStarted?: number;
  driveStopped?: number;
  time?: number;
};

function calculateAnimation(params: CalculateAnimationParams) {
  const { carState, driveStarted, driveStopped, time } = params;

  const animationParams: AnimationParams = {};

  if (carState === 'drive') {
    if (driveStarted && time) {
      const initialPosition = ((Date.now() - driveStarted) / time) * 100;
      animationParams.initialPosition = initialPosition;
      animationParams.timeToFinish = time - (Date.now() - driveStarted);
      animationParams.targetPosition = 100;
    } else {
      animationParams.initialPosition = 0;
      animationParams.timeToFinish = time;
      animationParams.targetPosition = 100;
    }
  }
  if (carState === 'broken') {
    if (driveStopped && driveStarted && time) {
      const initialPosition = ((driveStopped - driveStarted) / time) * 100;
      animationParams.initialPosition = initialPosition;
    }
  }
  if (carState === 'finished') {
    animationParams.initialPosition = 100;
  }

  if (!animationParams.initialPosition) animationParams.initialPosition = 0;

  return animationParams;
}

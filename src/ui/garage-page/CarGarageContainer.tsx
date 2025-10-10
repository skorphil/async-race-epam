import { useSelector } from 'react-redux';
import { garageApi } from '@/services';
import CarContainer from '../shared/CarContainer';
import type { RootState } from '@/store/store';
import useRace from './useRace';
import RaceTrack from './RaceTrack';

type CarGarageContainerProps = {
  id: number;
};

/**
 * Container to display car info in the garage
 * @id Car's ID
 */
function CarGarageContainer(props: CarGarageContainerProps) {
  const { carReset, carStart } = useRace({ cars: [] });
  const { id } = props;
  const [deleteCar] = garageApi.useDeleteCarMutation();
  const raceStatus = useSelector((state: RootState) => state.race.cars[id]);
  const animation = calculateAnimation({
    carState: raceStatus?.state,
    driveStarted: raceStatus?.driveStarted,
    driveStopped: raceStatus?.driveStopped,
    time: raceStatus?.time,
  });

  function handleCarDelete(carId: number) {
    deleteCar(carId);
  }

  return (
    <CarContainer id={id}>
      <div>
        <p>Racing Data</p>
        <button type="button" onClick={() => handleCarDelete(id)}>
          Delete
        </button>
        {(raceStatus?.state ?? null) === null ? (
          <button type="button" onClick={() => carStart(id)}>
            Start
          </button>
        ) : (
          <button type="button" onClick={() => carReset(id)}>
            Reset
          </button>
        )}
        <p>{raceStatus?.state || 'idle'}</p>
        <RaceTrack
          timeToFinish={animation.timeToFinish}
          initialPosition={animation.initialPosition}
          targetPosition={animation.targetPosition}
        />
      </div>
    </CarContainer>
  );
}

export default CarGarageContainer;

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

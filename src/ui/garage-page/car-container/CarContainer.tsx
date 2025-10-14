import { useSelector } from 'react-redux';
import { TrashIcon } from 'lucide-react';
import { garageApi, winnersApi } from '@/services';
import type { RootState } from '@/store/store';
import useRace from '../hooks/useRace';
import { RaceTrack } from '../race-track';
import { EditCarForm } from '../edit-car-form';
import styles from './CarContainer.module.css';
import { calculateAnimation } from './utils/calculateAnimation';

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

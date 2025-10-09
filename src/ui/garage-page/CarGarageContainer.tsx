import { useSelector } from 'react-redux';
import { garageApi } from '@/services';
import CarContainer from '../shared/CarContainer';
import type { RootState } from '@/store/store';
import useRace from './useRace';

export interface RtkAbortablePromise extends Promise<any> {
  abort: () => void;
}

type CarGarageContainerProps = {
  id: number;
};
/**
 * Container to display car info in the garage
 */
function CarGarageContainer(props: CarGarageContainerProps) {
  const { carReset, carStart } = useRace({ cars: [] });
  const { id } = props;
  const [deleteCar] = garageApi.useDeleteCarMutation();
  const raceStatus = useSelector((state: RootState) => state.race.cars[id]);

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
      </div>
    </CarContainer>
  );
}

export default CarGarageContainer;

import { garageApi, engineApi } from '@/services';
import CarContainer from '../shared/CarContainer';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useState } from 'react';

type CarGarageContainerProps = {
  id: number;
};
/**
 * New component
 */
function CarGarageContainer(props: CarGarageContainerProps) {
  const { id } = props;
  const [deleteCar] = garageApi.useDeleteCarMutation();
  const [startEngine] = engineApi.useStartEngineMutation();
  const [startDrive] = engineApi.useStartDriveMutation();
  const raceStatus = useSelector((state: RootState) => state.race[id]);
  // const [driving, setDriving] = useState(false);

  function handleCarDelete(carId: number) {
    deleteCar(carId);
  }

  async function handleStartDrive(carId: number) {
    await startEngine(carId);
    await startDrive(carId);
  }

  return (
    <CarContainer id={id}>
      <div>
        <p>Racing Data</p>
        <button type="button" onClick={() => handleCarDelete(id)}>
          Delete
        </button>
        {(raceStatus?.state ?? null) === null ? (
          <button type="button" onClick={() => handleStartDrive(id)}>
            Start
          </button>
        ) : (
          <button>Reset</button>
        )}
        <p>{raceStatus?.state || 'idle'}</p>
      </div>
    </CarContainer>
  );
}

export default CarGarageContainer;

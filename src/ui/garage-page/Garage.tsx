import { useSearchParams } from 'react-router';
import styles from './Garage.module.css';
import { engineApi, garageApi } from '@/services/';
import CarGarageContainer from './CarGarageContainer';

/**
 * Displays all cars in the garage by pages
 */
function Garage() {
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const { data, error } = garageApi.useGetCarsQuery({
    page: currentPage,
    limit: 7,
  });
  const [createCar] = garageApi.useCreateCarMutation();
  const [startDrive] = engineApi.useStartDriveMutation();
  const [startEngine] = engineApi.useStartEngineMutation();
  async function handleCarCreate() {
    createCar({ name: 'NewCar', color: '#15aa76ff' });
  }

  const cars = data?.cars ?? [];
  const totalCount = data?.totalCount ?? 0;

  async function handleRaceStart() {
    const enginePromises = cars.map(({ id }) => startEngine(id));
    await Promise.all(enginePromises);
    const carPromises = cars.map(({ id }) =>
      startDrive(id)
        .unwrap()
        .then(() => id),
    );
    const winner = await Promise.any(carPromises);
    console.info('winner', winner);
  }

  return (
    <div className={styles.container}>
      {error && <p>{error.error ? error.error : error.message}</p>}
      <p>{totalCount}</p>
      <button type="button">Add 100 cars</button>
      <button type="button" onClick={handleRaceStart}>
        Race Start
      </button>
      <button type="button" onClick={handleCarCreate}>
        Add car
      </button>
      <section className={styles.carsList}>
        {cars?.map((car) => (
          <CarGarageContainer id={car.id} />
        ))}
      </section>
    </div>
  );
}

export default Garage;

import { useSearchParams } from 'react-router';
import styles from './Garage.module.css';
import CarGarageContainer from './CarGarageContainer';
import useRace from './useRace';
import { garageApi } from '@/services';

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
  const { raceReset, raceStart, raceState } = useRace({
    cars: data?.cars || [],
  });

  async function handleCarCreate() {
    createCar({ name: 'NewCar', color: '#15aa76ff' });
  }

  const cars = data?.cars ?? [];
  const totalCount = data?.totalCount ?? 0;

  async function handleRaceStart() {
    raceStart();
  }

  async function handleRaceReset() {
    raceReset();
  }

  return (
    <div className={styles.container}>
      {error && <p>{error.error ? error.error : error.message}</p>}
      <p>{totalCount}</p>
      <button type="button">Add 100 cars</button>
      {Object.keys(raceState.cars).length === 0 ? (
        <button type="button" onClick={handleRaceStart}>
          Race Start
        </button>
      ) : (
        <button type="button" onClick={handleRaceReset}>
          Race Reset
        </button>
      )}
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

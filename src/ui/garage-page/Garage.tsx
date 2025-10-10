import { useSearchParams } from 'react-router';
import { useEffect } from 'react';
import styles from './Garage.module.css';
import CarGarageContainer from './CarGarageContainer';
import useRace from './useRace';
import { garageApi } from '@/services';

const carsPerPage = 7;

/**
 * Displays all cars in the garage by pages
 */
function Garage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const { data, error } = garageApi.useGetCarsQuery({
    page: currentPage,
    limit: carsPerPage,
  });
  const [createCar] = garageApi.useCreateCarMutation();
  const { raceReset, raceStart, raceState } = useRace({
    cars: data?.cars || [],
  });
  useEffect(() => {
    if (data?.cars.length === 0 && data.totalCount > 0) {
      const targetPage = Math.ceil(data.totalCount / carsPerPage);
      setSearchParams({
        page: targetPage.toString(),
      });
    }
  }, [data]);

  const cars = data?.cars ?? [];
  const totalCount = data?.totalCount ?? 0;

  async function handleCarCreate() {
    createCar({ name: 'NewCar', color: '#1576ff' });
  }
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
          <CarGarageContainer key={`car-${car.id}`} id={car.id} />
        ))}
      </section>
    </div>
  );
}

export default Garage;

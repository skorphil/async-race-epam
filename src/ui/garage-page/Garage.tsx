import { useSearchParams } from 'react-router';
import styles from './Garage.module.css';
import CarContainer from '../shared/CarContainer';
import { useCreateCarMutation, useGetCarsQuery } from '@/services/';

/**
 * Displays all cars in the garage by pages
 */
function Garage() {
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const { data, error } = useGetCarsQuery({
    page: currentPage,
    limit: 7,
  });
  const [createCar] = useCreateCarMutation();
  async function handleCarCreate() {
    createCar({ name: 'NewCar', color: '#15aa76ff' });
  }

  const cars = data?.cars ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <div className={styles.container}>
      {error && <p>{error.error ? error.error : error.message}</p>}
      <p>{totalCount}</p>
      <button type="button">Add 100 cars</button>
      <button type="button" onClick={handleCarCreate}>
        Add car
      </button>
      <section className={styles.carsList}>
        {cars?.map((car) => (
          <CarContainer id={car.id} />
        ))}
      </section>
    </div>
  );
}

export default Garage;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styles from './Garage.module.css';
import type { Car } from '../../model';
import { garage } from '../../services';
import CarContainer from '../shared/CarContainer';
import garageService from '@/services/garageService';

function handleCarCreate() {
  garageService.createCar({ name: 'new car', color: '#ffffff' });
}

function handleCarDelete(id: number) {
  garageService.deleteCar(id);
}

/**
 * Displays all care in the garage by pages
 */
function Garage() {
  const { pageId } = useParams();
  const [cars, setCars] = useState<null | Car[]>(null);

  useEffect(() => {
    const fetchCars = async () => {
      setCars((await garage.getCars(Number(pageId) || 1)).cars);
    };
    fetchCars();
  }, []);
  return (
    <div className={styles.container}>
      <button type="button">Add 100 cars</button>
      <button onClick={handleCarCreate} type="button">
        Add car
      </button>
      {cars?.map((car) => (
        <CarContainer
          onDelete={() => handleCarDelete(car.id)}
          name={car.name}
          id={car.id}
          color={car.color}
        />
      ))}
    </div>
  );
}

export default Garage;

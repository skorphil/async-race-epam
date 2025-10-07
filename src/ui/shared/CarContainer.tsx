import { useEffect, useState } from 'react';
import type { Car } from '@/model';
import styles from './CarContainer.module.css';
import {
  useDeleteCarMutation,
  useGetCarQuery,
  useUpdateCarMutation,
} from '@/services/garageService';

type CarContainerProps = { id: number };

/**
 * Car container, displaying details of a car
 */
function CarContainer(props: CarContainerProps) {
  const { id } = props;
  const [deleteCar] = useDeleteCarMutation();

  const { data } = useGetCarQuery(id);
  const [updateCar] = useUpdateCarMutation();
  const [name, setName] = useState<string>();
  const [color, setColor] = useState<string>();

  function handleCarUpdate(car: Partial<Car>) {
    if (!data) return;
    const updatedCar = { ...data, ...car };
    updateCar(updatedCar);
  }

  function handleCarDelete() {
    deleteCar(id);
  }

  useEffect(() => {
    if (!data) return;
    setName(data.name);
    setColor(data.color);
  }, [data]);

  return (
    <div className={styles.container}>
      <label htmlFor="carName">
        Name
        <input
          id="carName"
          onBlur={() => handleCarUpdate({ name })}
          onChange={(e) => {
            const newName = e.currentTarget.value;
            setName(newName);
          }}
          value={name}
        />
      </label>
      <label htmlFor="color">
        Color
        <input
          type="color"
          id="color"
          onBlur={() => handleCarUpdate({ color })}
          onChange={(e) => {
            const newColor = e.currentTarget.value;
            setColor(newColor);
          }}
          value={color}
        />
      </label>
      <p>{`Id: ${id}`}</p>
      <button type="button" onClick={handleCarDelete}>
        delete
      </button>
    </div>
  );
}

export default CarContainer;

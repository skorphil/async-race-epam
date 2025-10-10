import { useEffect, useState, type ReactElement } from 'react';
import type { Car } from '@/model';
import styles from './CarContainer.module.css';
import { garageApi } from '@/services/garageService';

type CarContainerProps = { id: number; children?: ReactElement };

/**
 * Car container, displaying details of a car
 */
function CarContainer(props: CarContainerProps) {
  const { id, children } = props;

  const { data } = garageApi.useGetCarQuery(id);
  const [updateCar] = garageApi.useUpdateCarMutation();
  const [name, setName] = useState<string>(() => data?.name || '');
  const [color, setColor] = useState<string>(() => data?.color || '#000000');

  function handleCarUpdate(car: Partial<Car>) {
    if (!data) return;
    const updatedCar = { ...data, ...car };
    updateCar(updatedCar);
  }

  useEffect(() => {
    if (!data) return;
    setName(data.name);
    setColor(data.color);
  }, [data]);

  return (
    <div className={styles.container}>
      <label htmlFor={`${id}-car-name`}>
        Name
        <input
          id={`${id}-car-name`}
          onBlur={() => handleCarUpdate({ name })}
          onChange={(e) => {
            const newName = e.currentTarget.value;
            setName(newName);
          }}
          value={name}
        />
      </label>
      <label htmlFor={`${id}-color`}>
        Color
        <input
          type="color"
          id={`${id}-color`}
          onBlur={() => handleCarUpdate({ color })}
          onChange={(e) => {
            const newColor = e.currentTarget.value;
            setColor(newColor);
          }}
          value={color}
        />
      </label>
      <p>{`Id: ${id}`}</p>
      {children}
    </div>
  );
}

export default CarContainer;

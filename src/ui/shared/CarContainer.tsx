import { type ReactElement } from 'react';
import styles from './CarContainer.module.css';
import { garageApi } from '@/services/garageService';
import EditCarForm from '../garage-page/EditCarForm';

type CarContainerProps = { id: number; children?: ReactElement };

/**
 * Car container, displaying details of a car
 */
function CarContainer(props: CarContainerProps) {
  const { id, children } = props;
  const { data } = garageApi.useGetCarQuery(id);

  const { color, name } = data || {};

  return (
    <div className={styles.container}>
      {name && color && <EditCarForm id={id} color={color} name={name} />}
      <p>{`Id: ${id}`}</p>
      {children}
    </div>
  );
}

export default CarContainer;

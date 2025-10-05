import type { Car } from '@/model';
import styles from './CarContainer.module.css';

type CarContainerProps = Car & {
  onDelete: () => void;
};

/**
 * Car container, displaying details of a car
 */
function CarContainer(props: CarContainerProps) {
  const { name, color, id, onDelete } = props;
  return (
    <div className={styles.container}>
      <p>{`Name: ${name}`}</p>
      <p>{`Color: ${color}`}</p>
      <p>{`Id: ${id}`}</p>
      <button type="button" onClick={onDelete}>
        delete
      </button>
    </div>
  );
}

export default CarContainer;

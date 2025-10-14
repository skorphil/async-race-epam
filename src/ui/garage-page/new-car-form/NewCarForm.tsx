import { useDispatch, useSelector } from 'react-redux';
import type { MouseEvent } from 'react';
import { PlusIcon } from 'lucide-react';
import styles from './NewCarForm.module.css';
import { TextInput } from '@/ui/shared/text-input';
import type { AppDispatch, RootState } from '@/store/store';
import { newCarFormActions } from '@/store';
import { CarSchema } from '@/model';
import { garageApi } from '@/services';
import { generateCars } from '@/utils/generateCars';

/**
 * Form to create new car
 */
function NewCarForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [createCar] = garageApi.useCreateCarMutation();
  const { color, name, nameErrors } = useSelector(
    (state: RootState) => state.newCarForm,
  );

  const handleSetNameErrors = (errors: string[]) => {
    dispatch(newCarFormActions.setFormState({ nameErrors: errors }));
  };

  const handleSetName = (value: string) => {
    const zValid = CarSchema.shape.name.safeParse(value);
    if (zValid?.success === false) {
      const errorMessages = zValid.error.issues.map((zIssue) => zIssue.message);
      handleSetNameErrors(errorMessages);
    } else handleSetNameErrors([]);
    dispatch(newCarFormActions.setFormState({ name: value }));
  };

  const handleSetColor = (value: string) => {
    dispatch(newCarFormActions.setFormState({ color: value }));
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const zValid = CarSchema.shape.name.safeParse(name);
    if (zValid?.success === false) {
      const errorMessages = zValid.error.issues.map((zIssue) => zIssue.message);
      handleSetNameErrors(errorMessages);
    } else {
      createCar({
        color,
        name,
      });
      dispatch(newCarFormActions.setFormState({ name: '' }));
    }
  };

  const handleBatchCarsCreate = async () => {
    const newCars = generateCars(100);
    const createCarPromises = newCars.map((car) => createCar(car));
    await Promise.all(createCarPromises);
  };

  return (
    <div className={styles.container}>
      <form className={styles.carForm}>
        <TextInput
          onChange={handleSetName}
          value={name}
          label="Name"
          id="new-car-form-name"
          errorMessages={nameErrors}
        />
        <input
          className={styles.colorInput}
          type="color"
          value={color}
          onChange={(e) => handleSetColor(e.currentTarget.value)}
        />
        <button
          type="submit"
          className={styles.submitButton}
          onClick={(e) => handleSubmit(e)}
        >
          <PlusIcon />
        </button>
      </form>
      <button
        className="secondary outline"
        onClick={handleBatchCarsCreate}
        type="button"
      >
        Add 100 cars
      </button>
    </div>
  );
}

export default NewCarForm;

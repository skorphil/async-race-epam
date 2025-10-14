import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { TextInput } from '@/ui/shared/text-input';
import type { AppDispatch, RootState } from '@/store/store';
import { carFormActions } from '@/store';
import { CarSchema } from '@/model';
import { garageApi } from '@/services';
import styles from './EditCarForm.module.css';

type EditCarFormProps = {
  id: number;
  name: string;
  color: string;
};

/**
 * Form to edit a car
 */
function EditCarForm(props: EditCarFormProps) {
  const { id, color: serverColor, name: serverName } = props;
  const dispatch = useDispatch<AppDispatch>();
  const [updateCar] = garageApi.useUpdateCarMutation();
  const formState = useSelector((state: RootState) => state.carForm[id]);

  const { name, nameErrors } = formState || { name: '', nameErrors: [] };

  const handleSetNameErrors = (errors: string[]) => {
    dispatch(carFormActions.setFormState({ id, nameErrors: errors }));
  };

  const handleSetName = (value: string) => {
    const zValid = CarSchema.shape.name.safeParse(value);
    if (zValid?.success === false) {
      const errorMessages = zValid.error.issues.map((zIssue) => zIssue.message);
      handleSetNameErrors(errorMessages);
    } else handleSetNameErrors([]);
    dispatch(carFormActions.setFormState({ id, name: value }));
  };

  const handleSubmitColor = (value: string) => {
    updateCar({
      id,
      color: value,
    });
  };

  const handleSubmitName = () => {
    const zValid = CarSchema.shape.name.safeParse(name);
    if (zValid?.success === false) {
      const errorMessages = zValid.error.issues.map((zIssue) => zIssue.message);
      handleSetNameErrors(errorMessages);
    } else {
      updateCar({
        id,
        name,
      });
    }
  };

  useEffect(() => {
    if (!name) {
      dispatch(
        carFormActions.setFormState({
          id,
          name: serverName,
          color: serverColor,
        }),
      );
    }
  }, [serverName, serverColor]);

  return (
    <form className={styles.carForm}>
      <TextInput
        onChange={handleSetName}
        onBlur={handleSubmitName}
        value={name}
        id={`edit-car-form-name-${id}`}
        errorMessages={nameErrors || []}
      />
      <input
        type="color"
        className={styles.colorInput}
        value={serverColor}
        onChange={(e) => {
          const { value } = e.currentTarget;
          handleSubmitColor(value);
        }}
      />
    </form>
  );
}

export default EditCarForm;

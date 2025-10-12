import { useDispatch, useSelector } from 'react-redux';
import type { ChangeEvent, MouseEvent } from 'react';
import { TextInput } from '../shared/text-input/TextInput';
import type { AppDispatch, RootState } from '@/store/store';
import { newCarFormActions } from '@/store';
import { CarSchema } from '@/model';
import { garageApi } from '@/services';

/**
 * New component
 *
 */
function NewCarForm() {
  const { color, name, nameErrors } = useSelector(
    (state: RootState) => state.newCarForm,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [createCar] = garageApi.useCreateCarMutation();

  const handleSetNameErrors = (errors: string[]) => {
    dispatch(newCarFormActions.setFormState({ nameErrors: errors }));
  };
  const handleSetName = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    dispatch(newCarFormActions.setFormState({ name: value }));
  };
  const handleSetColor = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
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
    }
  };

  return (
    <div>
      <form>
        <TextInput
          schema={CarSchema.shape.name}
          onChange={handleSetName}
          value={name}
          label="Name"
          id="new-car-form-name"
          errorMessages={nameErrors}
          setErrors={handleSetNameErrors}
        />
        <input type="color" value={color} onChange={handleSetColor} />
      </form>
      <button type="submit" onClick={(e) => handleSubmit(e)}>
        Create car
      </button>
    </div>
  );
}

export default NewCarForm;

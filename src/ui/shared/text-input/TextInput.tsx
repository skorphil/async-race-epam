import type { ZodType } from 'zod';
import type { ChangeEvent } from 'react';
import styles from './TextInput.module.css';

type TextInputProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  id?: string;
  schema?: ZodType;
  disabled?: boolean;
  description?: string;
  errorMessages: string[];
  setErrors: (errors: string[]) => void;
};

function TextInput(props: TextInputProps) {
  const {
    value,
    onChange,
    label,
    id,
    schema,
    disabled,
    description,
    setErrors,
    errorMessages,
  } = props;

  return (
    <div className={styles.container}>
      {label && id && (
        <label htmlFor={id}>
          <div className={styles.label}>
            {label}
            {errorMessages.length > 0 && <span>alert</span>}
          </div>
        </label>
      )}
      <input
        className={`${errorMessages.length > 0 && 'border-red-500 border-2'}`}
        id={id}
        type="text"
        onBlur={(e) => handleBlur(e, setErrors, schema)}
        onChange={(e) => handleChange(e, onChange, setErrors, schema)}
        value={value}
        disabled={disabled || false}
      />
      {description && description.length > 0 && (
        <div className="flex flex-row gap-2">
          <div className="flex flex-col text-xs">{description}</div>
        </div>
      )}
      {errorMessages.length > 0 && (
        <div className="flex flex-row gap-2">
          <div className="flex flex-col">
            {errorMessages.map((message) => (
              <div key={`${message}-${id}`} className="text-xs">
                {message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function handleBlur(
  e: ChangeEvent<HTMLInputElement>,
  setErrors: (errors: string[]) => void,
  schema?: ZodType,
) {
  const newValue = e.target.value;
  const zValid = schema?.safeParse(newValue);
  if (zValid?.success === false) {
    const errorMessages = zValid.error.issues.map((zIssue) => zIssue.message);
    setErrors(errorMessages);
  } else {
    setErrors([]);
  }
}

function handleChange(
  e: ChangeEvent<HTMLInputElement>,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  setErrors: (errors: string[]) => void,
  schema?: ZodType,
) {
  const newValue = e.target.value;
  const zValid = schema?.safeParse(newValue);
  if (zValid?.success === true) setErrors([]);
  onChange(e);
}

export { TextInput };

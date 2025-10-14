import styles from './TextInput.module.css';

type TextInputProps = {
  value: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
  description?: string;
  errorMessages: string[];
};

function TextInput(props: TextInputProps) {
  const {
    value,
    onChange,
    onBlur,
    label,
    id,
    disabled,
    description,
    errorMessages,
  } = props;

  return (
    <div className={styles.container}>
      {label && id && (
        <label htmlFor={id}>
          <div className={styles.label}>{label}</div>
        </label>
      )}
      <input
        aria-invalid={errorMessages.length > 0 || undefined}
        aria-describedby="invalid-helper"
        className={`${errorMessages.length > 0 && styles.error} ${styles.input}`}
        id={id}
        type="text"
        onBlur={(e) => {
          const { value: v } = e.currentTarget;
          if (onBlur) onBlur(v);
        }}
        onChange={(e) => {
          const { value: v } = e.currentTarget;
          if (onChange) onChange(v);
        }}
        value={value}
        disabled={disabled || false}
      />
      {description && description.length > 0 && (
        <div className="flex flex-row gap-2">
          <div className="flex flex-col text-xs">{description}</div>
        </div>
      )}
      {errorMessages.length > 0 && (
        <small
          id="invalid-helper"
          key={`${errorMessages[0]}-${id}`}
          className={styles.errorMessage}
        >
          {errorMessages[0]}
        </small>
      )}
    </div>
  );
}

export { TextInput };

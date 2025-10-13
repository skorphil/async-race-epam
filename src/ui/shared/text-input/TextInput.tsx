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

export { TextInput };

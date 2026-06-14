import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({ label, error, helperText, className, id, ...props }: InputProps) {
  const inputId = id || props.name;

  return (
    <label className="field" htmlFor={inputId}>
      {label && <span className="field-label">{label}</span>}
      <input id={inputId} className={`input ${className || ''}`.trim()} {...props} />
      {(error || helperText) && (
        <span className={error ? 'field-error' : 'field-helper'}>{error || helperText}</span>
      )}
    </label>
  );
}

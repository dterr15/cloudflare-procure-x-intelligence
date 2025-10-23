import React, { InputHTMLAttributes, forwardRef } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
  label: string | React.ReactNode;
  error?: string;
  onChange: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, onChange, className = "", ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    };

    return (
      <div className="form-field-checkbox">
        <label className="checkbox-label">
          <input
            ref={ref}
            type="checkbox"
            className={`checkbox ${error ? "checkbox-error" : ""} ${className}`}
            onChange={handleChange}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.name}-error` : undefined}
            {...props}
          />
          <span className="checkbox-text">
            {label}
            {props.required && <span className="required">*</span>}
          </span>
        </label>
        
        {error && (
          <div id={`${props.name}-error`} className="error-text" role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
import React, { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label: string;
  error?: string;
  helpText?: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helpText, options, onChange, placeholder, className = "", ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className="form-field">
        <label className="label" htmlFor={props.id || props.name}>
          {label}
          {props.required && <span className="required">*</span>}
        </label>
        
        <select
          ref={ref}
          className={`input ${error ? "input-error" : ""} ${className}`}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={
            error 
              ? `${props.name}-error` 
              : helpText 
              ? `${props.name}-help` 
              : undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {helpText && !error && (
          <div id={`${props.name}-help`} className="help-text">
            {helpText}
          </div>
        )}
        
        {error && (
          <div id={`${props.name}-error`} className="error-text" role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
import React, { InputHTMLAttributes, forwardRef } from "react";
import { sanitizeInput } from "@/utils/security";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  error?: string;
  helpText?: string;
  onChange: (value: string) => void;
  skipInputSanitization?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, onChange, className = "", skipInputSanitization = false, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // 1. Obtener el valor crudo (raw) del input
      const rawValue = e.target.value; 

      // 2. Determinar el valor procesado:
      const processed = skipInputSanitization 
        // Si TRUE: Usar el valor crudo (rawValue)
        ? rawValue 
        // Si FALSE: Sanitizar el valor crudo (rawValue)
        : sanitizeInput(rawValue); 
      
      // 3. Enviar el valor procesado al hook de formulario
      onChange(processed);
    };

    return (
      <div className="form-field">
        <label className="label" htmlFor={props.id || props.name}>
          {label}
          {props.required && <span className="required">*</span>}
        </label>
        
        <input
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
        />
        
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

Input.displayName = "Input";
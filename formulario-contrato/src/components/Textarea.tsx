import React, { TextareaHTMLAttributes, forwardRef } from "react";
import { sanitizeInput } from "@/utils/security";

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label: string;
  error?: string;
  helpText?: string;
  onChange: (value: string) => void;
  maxLength?: number;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    label, 
    error, 
    helpText, 
    onChange, 
    maxLength, 
    showCount = false,
    className = "", 
    value = "",
    ...props 
  }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const sanitized = sanitizeInput(e.target.value);
      onChange(sanitized);
    };

    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="form-field">
        <label className="label" htmlFor={props.id || props.name}>
          {label}
          {props.required && <span className="required">*</span>}
        </label>
        
        <textarea
          ref={ref}
          className={`input textarea ${error ? "input-error" : ""} ${className}`}
          onChange={handleChange}
          value={value}
          maxLength={maxLength}
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
        
        {showCount && maxLength && (
          <div className="char-count">
            {currentLength} / {maxLength}
          </div>
        )}
        
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

Textarea.displayName = "Textarea";
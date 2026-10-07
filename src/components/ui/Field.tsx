import type { ComponentPropsWithoutRef, ReactNode } from "react";

import styles from "./Field.module.css";
import { AlertCircle } from "./icons";

/**
 * Form controls. Every control has a visible <label>, optional hint, and an
 * error message wired through aria-describedby + aria-invalid. Errors pair the
 * error color with an icon and text, never color alone.
 */

type BaseFieldProps = {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  /** Visually de-emphasised "(optional)" marker for non-required fields. */
  showOptional?: boolean;
  className?: string;
};

function describedBy(id: string, hint?: ReactNode, error?: string) {
  return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
}

function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  showOptional = true,
  className,
  children,
}: BaseFieldProps & { children: ReactNode }) {
  return (
    <div className={[styles.field, error ? styles.hasError : "", className].filter(Boolean).join(" ")}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : showOptional ? (
          <span className={styles.optional}>(optional)</span>
        ) : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {children}
      <FieldError id={id} error={error} />
    </div>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className={styles.error}>
      <AlertCircle className={styles.errorIcon} />
      <span>{error}</span>
    </p>
  );
}

type InputProps = BaseFieldProps & Omit<ComponentPropsWithoutRef<"input">, "id" | "className" | "required">;

export function Input({ id, label, hint, error, required, showOptional, className, ...rest }: InputProps) {
  return (
    <FieldShell {...{ id, label, hint, error, required, showOptional, className }}>
      <input
        id={id}
        className={styles.control}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </FieldShell>
  );
}

type TextareaProps = BaseFieldProps & Omit<ComponentPropsWithoutRef<"textarea">, "id" | "className" | "required">;

export function Textarea({ id, label, hint, error, required, showOptional, className, rows = 6, ...rest }: TextareaProps) {
  return (
    <FieldShell {...{ id, label, hint, error, required, showOptional, className }}>
      <textarea
        id={id}
        rows={rows}
        className={`${styles.control} ${styles.textarea}`}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </FieldShell>
  );
}

type SelectProps = BaseFieldProps &
  Omit<ComponentPropsWithoutRef<"select">, "id" | "className" | "required"> & {
    options: readonly string[] | readonly { value: string; label: string }[];
    placeholder?: string;
  };

export function Select({ id, label, hint, error, required, showOptional, className, options, placeholder = "Select one", ...rest }: SelectProps) {
  return (
    <FieldShell {...{ id, label, hint, error, required, showOptional, className }}>
      <div className={styles.selectWrap}>
        <select
          id={id}
          className={`${styles.control} ${styles.select}`}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => {
            const o = typeof opt === "string" ? { value: opt, label: opt } : opt;
            return (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            );
          })}
        </select>
        <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </FieldShell>
  );
}

type CheckboxGroupProps = {
  id: string;
  name: string;
  legend: ReactNode;
  hint?: ReactNode;
  error?: string;
  options: readonly string[];
  defaultValues?: readonly string[];
  className?: string;
};

/** Multi-select as real checkboxes inside a fieldset/legend. */
export function CheckboxGroup({ id, name, legend, hint, error, options, defaultValues = [], className }: CheckboxGroupProps) {
  return (
    <fieldset
      className={[styles.fieldset, error ? styles.hasError : "", className].filter(Boolean).join(" ")}
      aria-describedby={describedBy(id, hint, error)}
      aria-invalid={error ? true : undefined}
    >
      <legend className={styles.label}>
        {legend} <span className={styles.optional}>(optional)</span>
      </legend>
      {hint ? (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      <div className={styles.choices}>
        {options.map((opt, i) => {
          const optId = `${id}-${i}`;
          return (
            <label key={opt} htmlFor={optId} className={styles.choice}>
              <input
                id={optId}
                type="checkbox"
                name={name}
                value={opt}
                defaultChecked={defaultValues.includes(opt)}
                className={styles.checkbox}
              />
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
      <FieldError id={id} error={error} />
    </fieldset>
  );
}

type CheckboxProps = {
  id: string;
  name: string;
  label: ReactNode;
  error?: string;
  required?: boolean;
  defaultChecked?: boolean;
  className?: string;
};

export function Checkbox({ id, name, label, error, required, defaultChecked, className }: CheckboxProps) {
  return (
    <div className={[styles.single, error ? styles.hasError : "", className].filter(Boolean).join(" ")}>
      <label htmlFor={id} className={styles.choice}>
        <input
          id={id}
          type="checkbox"
          name={name}
          value="yes"
          required={required}
          defaultChecked={defaultChecked}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={styles.checkbox}
        />
        <span>{label}</span>
      </label>
      <FieldError id={id} error={error} />
    </div>
  );
}

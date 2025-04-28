import React from 'react';
import { useForm, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loading } from './loading';

interface FormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  onSubmit: (data: T) => Promise<void>;
  children: (methods: UseFormReturn<T>) => React.ReactNode;
  className?: string;
}

export function Form<T extends FieldValues>({
  schema,
  onSubmit,
  children,
  className = '',
}: FormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: T) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={methods.handleSubmit(handleSubmit)}
      className={`space-y-4 ${className}`}
    >
      {children(methods)}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !methods.formState.isValid}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loading size="sm" /> : 'Submit'}
        </button>
      </div>
    </form>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <FormField label={label} error={error}>
      <input
        {...props}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
          error ? 'border-red-300' : ''
        }`}
      />
    </FormField>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextArea({ label, error, ...props }: TextAreaProps) {
  return (
    <FormField label={label} error={error}>
      <textarea
        {...props}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
          error ? 'border-red-300' : ''
        }`}
      />
    </FormField>
  );
}

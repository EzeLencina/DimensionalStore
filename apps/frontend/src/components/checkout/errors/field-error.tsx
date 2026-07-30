import { cn } from '@lib/helpers/cn';

type FieldErrorProps = {
  message?: string;
  className?: string;
};

export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p
      className={cn('text-xs text-destructive mt-1', className)}
      role="alert"
      aria-live="polite"
    >
      {message}
    </p>
  );
}

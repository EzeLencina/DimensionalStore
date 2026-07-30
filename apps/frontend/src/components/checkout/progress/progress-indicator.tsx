import { Check } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { checkoutSteps } from '../mock-data';
import type { CheckoutStepId } from '../mock-data';

type ProgressIndicatorProps = {
  currentStep: CheckoutStepId;
  className?: string;
};

export function ProgressIndicator({ currentStep, className }: ProgressIndicatorProps) {
  const currentIndex = checkoutSteps.findIndex((s) => s.id === currentStep);

  return (
    <nav className={cn('w-full', className)} aria-label="Progreso del checkout">
      <ol className="flex items-center justify-between">
        {checkoutSteps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <li key={step.id} className="flex items-center flex-1 relative">
              <div className="flex flex-col items-center w-full">
                <span
                  className={cn(
                    'flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-semibold border-2 transition-all shrink-0',
                    isCompleted && 'bg-primary border-primary text-primary-foreground',
                    isCurrent && 'border-primary text-primary bg-primary/5',
                    isPending && 'border-border text-muted-foreground bg-background',
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  ) : (
                    <span className="hidden sm:inline">{index + 1}</span>
                  )}
                </span>
                <span
                  className={cn(
                    'text-[10px] sm:text-xs mt-1 text-center leading-tight hidden sm:block',
                    isCurrent && 'text-primary font-semibold',
                    isCompleted && 'text-primary',
                    isPending && 'text-muted-foreground',
                  )}
                >
                  {step.shortLabel}
                </span>
              </div>

              {index < checkoutSteps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-4 sm:top-5 left-[calc(50%+1rem)] right-[calc(50%+1rem)] h-0.5 -translate-y-1/2',
                    isCompleted ? 'bg-primary' : 'bg-border',
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

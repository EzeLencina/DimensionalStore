import { cn } from '../../../lib/cn';
import { Spinner } from '../../ui/spinner/spinner';

type LoadingStateProps = {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

function LoadingState({ label = 'Loading...', size = 'md', className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 gap-3', className)}>
      <Spinner size={size} variant="primary" />
      {label && (
        <p className="text-sm text-muted-foreground">{label}</p>
      )}
    </div>
  );
}

export { LoadingState };
export type { LoadingStateProps };

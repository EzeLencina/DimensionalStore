import { Check } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { statusLabels } from '../mock-data';
import type { TimelineEvent, OrderStatus } from '../mock-data';

type OrderTimelineProps = {
  events: TimelineEvent[];
  currentStatus: OrderStatus;
  className?: string;
};

export function OrderTimeline({ events, currentStatus, className }: OrderTimelineProps) {
  const cancelled = currentStatus === 'cancelled';

  return (
    <div className={cn('space-y-0', className)}>
      {events.map((event, i) => {
        const isLast = i === events.length - 1;
        const isCancelled = event.status === 'cancelled';

        return (
          <div key={i} className="flex gap-3 pb-6 last:pb-0 relative">
            <div className="flex flex-col items-center">
              <div className={cn(
                'flex items-center justify-center w-7 h-7 rounded-full shrink-0 z-10',
                isCancelled ? 'bg-destructive/10' : event.status === currentStatus || events.slice(i).some((e) => e.status === currentStatus)
                  ? 'bg-primary/10' : 'bg-muted',
              )}>
                {isCancelled ? (
                  <span className="text-destructive text-xs font-bold">X</span>
                ) : (
                  <Check className={cn(
                    'h-3.5 w-3.5',
                    event.status === currentStatus || events.slice(i).some((e) => e.status === currentStatus)
                      ? 'text-primary' : 'text-muted-foreground/40',
                  )} />
                )}
              </div>
              {!isLast && (
                <div className={cn(
                  'w-px flex-1 min-h-[24px]',
                  isCancelled ? 'bg-destructive/20' : 'bg-border',
                )} />
              )}
            </div>
            <div className={cn('pb-1', isLast ? '' : '')}>
              <p className={cn(
                'text-sm font-medium',
                isCancelled ? 'text-destructive' : 'text-foreground',
              )}>{event.label}</p>
              <p className="text-xs text-muted-foreground">{event.description}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{event.date}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

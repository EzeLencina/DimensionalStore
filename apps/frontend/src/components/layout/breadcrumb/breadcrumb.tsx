import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@lib/helpers/cn';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  homeHref?: string;
};

function Breadcrumb({ items, className, showHome = true, homeHref = '/' }: BreadcrumbProps) {
  const allItems = showHome
    ? [{ label: 'Inicio', href: homeHref }, ...items]
    : items;

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-sm text-muted-foreground', className)}>
      <ol className="flex items-center gap-1.5">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index === 0 && showHome && (
                <Home className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              )}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="hover:text-foreground transition-colors truncate max-w-[200px]"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={cn(
                    'truncate max-w-[200px]',
                    isLast && 'text-foreground font-medium',
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { Breadcrumb };
export type { BreadcrumbProps };

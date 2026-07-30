import { cn } from '@lib/helpers/cn';
import { Button } from '@tienda/ui';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@tienda/ui';

type CatalogPaginationProps = {
  currentPage: number;
  totalPages: number;
  variant?: 'pagination' | 'load-more';
  className?: string;
};

export function CatalogPagination({ currentPage, totalPages, variant = 'pagination', className }: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  if (variant === 'load-more') {
    return (
      <div className={cn('flex justify-center pt-6', className)}>
        <Button variant="outline" size="lg">
          Cargar más productos
        </Button>
      </div>
    );
  }

  const pages: (number | 'ellipsis')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  return (
    <Pagination className={cn('pt-6', className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-label="Ir a página anterior"
            className={currentPage <= 1 ? 'pointer-events-none opacity-40' : ''}
          />
        </PaginationItem>

        {pages.map((page, i) =>
          page === 'ellipsis' ? (
            <PaginationItem key={`e-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                aria-label={`Ir a página ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-label="Ir a página siguiente"
            className={currentPage >= totalPages ? 'pointer-events-none opacity-40' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

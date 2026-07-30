import Image from 'next/image';
import { cn } from '../../../lib/cn';
import { Card, CardContent } from '../../ui/card/card';

type CategoryCardProps = {
  id: string;
  name: string;
  image?: string;
  productCount?: number;
  href: string;
  className?: string;
};

function CategoryCard({ name, image, productCount, href, className }: CategoryCardProps) {
  return (
    <a href={href} className={cn('group block', className)}>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          {productCount !== undefined && (
            <p className="mt-1 text-xs text-muted-foreground">
              {productCount} product{productCount !== 1 ? 's' : ''}
            </p>
          )}
        </CardContent>
      </Card>
    </a>
  );
}

export { CategoryCard };
export type { CategoryCardProps };

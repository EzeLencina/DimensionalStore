import { cn } from '@lib/helpers/cn';
import { homeCategories } from '@lib/home/mock-data';
import { Container } from '@components/layout/containers/container';
import { SectionTitle } from '@tienda/ui';
import { CategoryCard } from '@tienda/ui';

type CategoriesProps = {
  className?: string;
};

export function Categories({ className }: CategoriesProps) {
  return (
    <section className={cn('py-12 sm:py-16', className)}>
      <Container size="xl">
        <SectionTitle
          title="Categorías"
          description="Explorá nuestra gama completa de productos para hogar y empresa"
          align="center"
          spacing="loose"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {homeCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              id={cat.id}
              name={cat.name}
              href={cat.href}
              productCount={cat.productCount}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

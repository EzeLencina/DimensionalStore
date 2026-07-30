export interface Specification<T> {
  satisfiedBy(target: T): boolean;
}

export interface FilterCriteria {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith';
  value: unknown;
}

export interface QuerySpecification<T> {
  filters?: FilterCriteria[];
  orderBy?: Record<string, 'asc' | 'desc'>;
  pagination?: { page: number; limit: number };
  include?: string[];
  select?: string[];
}

export abstract class SpecificationRepository<T> {
  protected abstract get model(): any;

  async findBySpecification(spec: QuerySpecification<T>): Promise<T[]> {
    const where = this.buildWhere(spec.filters ?? []);

    return this.model.findMany({
      where,
      orderBy: spec.orderBy,
      skip: spec.pagination ? (spec.pagination.page - 1) * spec.pagination.limit : undefined,
      take: spec.pagination?.limit,
      include: spec.include?.reduce((acc, inc) => ({ ...acc, [inc]: true }), {}),
      select: spec.select?.reduce((acc, sel) => ({ ...acc, [sel]: true }), {}),
    });
  }

  private buildWhere(filters: FilterCriteria[]): Record<string, unknown> {
    return filters.reduce(
      (acc, filter) => {
        const { field, operator, value } = filter;
        switch (operator) {
          case 'eq':
            acc[field] = value;
            break;
          case 'neq':
            acc[field] = { not: value };
            break;
          case 'gt':
            acc[field] = { gt: value };
            break;
          case 'gte':
            acc[field] = { gte: value };
            break;
          case 'lt':
            acc[field] = { lt: value };
            break;
          case 'lte':
            acc[field] = { lte: value };
            break;
          case 'in':
            acc[field] = { in: value as unknown[] };
            break;
          case 'nin':
            acc[field] = { notIn: value as unknown[] };
            break;
          case 'contains':
            acc[field] = { contains: value };
            break;
          case 'startsWith':
            acc[field] = { startsWith: value };
            break;
          case 'endsWith':
            acc[field] = { endsWith: value };
            break;
        }
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }
}

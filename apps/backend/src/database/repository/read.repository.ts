import { PrismaService } from '../prisma.service';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FindAllOptions<T = unknown> {
  where?: Partial<T>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  pagination?: PaginationParams;
}

export abstract class ReadRepository<T, TId = string> {
  protected abstract readonly prisma: PrismaService;
  protected abstract get model(): any;

  async findById(id: TId): Promise<T | null> {
    return this.model.findUnique({ where: { id } as any });
  }

  async findAll(options?: FindAllOptions<T>): Promise<T[]> {
    return this.model.findMany({
      where: options?.where,
      orderBy: options?.orderBy,
      skip: options?.pagination
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined,
      take: options?.pagination?.limit,
    });
  }

  async findPaginated(options?: FindAllOptions<T>): Promise<PaginatedResult<T>> {
    const page = options?.pagination?.page ?? 1;
    const limit = options?.pagination?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.findMany({
        where: options?.where,
        orderBy: options?.orderBy,
        skip,
        take: limit,
      }),
      this.model.count({ where: options?.where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async count(where?: Partial<T>): Promise<number> {
    return this.model.count({ where });
  }

  async exists(where: Partial<T>): Promise<boolean> {
    const count = await this.model.count({ where });
    return count > 0;
  }
}

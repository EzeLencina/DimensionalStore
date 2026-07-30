import { ReadRepository, FindAllOptions } from './read.repository';
import { WriteRepository } from './write.repository';

export interface ICrudRepository<T, TId = string>
  extends Pick<ReadRepository<T, TId>, 'findById' | 'findAll' | 'findPaginated' | 'count' | 'exists'>,
    Pick<WriteRepository<T, TId>, 'create' | 'update' | 'delete'> {}

export abstract class CrudRepository<T, TId = string>
  extends ReadRepository<T, TId>
  implements ICrudRepository<T, TId>
{
  abstract create(data: Partial<T>): Promise<T>;

  async update(id: TId, data: Partial<T>): Promise<T> {
    return this.model.update({
      where: { id } as any,
      data,
    });
  }

  async delete(id: TId): Promise<void> {
    await this.model.delete({ where: { id } as any });
  }
}

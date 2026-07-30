export abstract class WriteRepository<T, TId = string> {
  protected abstract get model(): any;

  abstract create(data: Partial<T>): Promise<T>;

  abstract update(id: TId, data: Partial<T>): Promise<T>;

  abstract delete(id: TId): Promise<void>;
}

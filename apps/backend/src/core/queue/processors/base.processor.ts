import type { IJobAdapter, IProcessor } from '../interfaces';

export abstract class BaseProcessor<T = unknown, R = unknown> implements IProcessor<T, R> {
  abstract readonly name: string;

  abstract process(job: IJobAdapter<T>): Promise<R>;

  protected shouldRetry(error: Error, _attempts: number): boolean {
    return error instanceof Error;
  }

  protected getTimeout(): number | undefined {
    return undefined;
  }
}

export class QueueMock {
  private jobs: Array<{ queue: string; data: unknown; options?: Record<string, unknown> }> = [];
  private results: Map<string, unknown> = new Map();
  private shouldFail = false;
  private failMessage = 'Mock queue failure';

  add(queue: string, data: unknown, options?: Record<string, unknown>): Promise<string> {
    if (this.shouldFail) {
      return Promise.reject(new Error(this.failMessage));
    }

    const jobId = `mock-job-${this.jobs.length + 1}`;
    this.jobs.push({ queue, data, options });
    return Promise.resolve(jobId);
  }

  addBulk(queue: string, items: Array<{ data: unknown; options?: Record<string, unknown> }>): Promise<string[]> {
    if (this.shouldFail) {
      return Promise.reject(new Error(this.failMessage));
    }

    const ids = items.map((item, index) => {
      const jobId = `mock-job-${this.jobs.length + 1}`;
      this.jobs.push({ queue, data: item.data, options: item.options });
      return jobId;
    });

    return Promise.resolve(ids);
  }

  getJobs(queue?: string): Array<{ queue: string; data: unknown; options?: Record<string, unknown> }> {
    if (queue) {
      return this.jobs.filter(job => job.queue === queue);
    }
    return [...this.jobs];
  }

  setResult(queue: string, result: unknown): void {
    this.results.set(queue, result);
  }

  getResult<T>(queue: string): T | undefined {
    return this.results.get(queue) as T | undefined;
  }

  setFailure(shouldFail: boolean, message?: string): void {
    this.shouldFail = shouldFail;
    if (message) this.failMessage = message;
  }

  getJobCount(queue?: string): number {
    if (queue) {
      return this.jobs.filter(job => job.queue === queue).length;
    }
    return this.jobs.length;
  }

  clear(): void {
    this.jobs = [];
    this.results.clear();
    this.shouldFail = false;
    this.failMessage = 'Mock queue failure';
  }
}

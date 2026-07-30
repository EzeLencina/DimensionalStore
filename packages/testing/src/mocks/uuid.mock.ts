export class UuidMock {
  private counter = 0;
  private fixedUuids: string[] = [];
  private useFixed = false;

  setFixed(uuids: string[]): void {
    this.fixedUuids = [...uuids];
    this.useFixed = true;
    this.counter = 0;
  }

  generate(): string {
    if (this.useFixed && this.counter < this.fixedUuids.length) {
      return this.fixedUuids[this.counter++]!;
    }
    return this.generateRandom();
  }

  setFixedSequence(...uuids: string[]): void {
    this.setFixed(uuids);
  }

  generateMany(count: number): string[] {
    return Array.from({ length: count }, () => this.generate());
  }

  reset(): void {
    this.counter = 0;
    this.fixedUuids = [];
    this.useFixed = false;
  }

  private generateRandom(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

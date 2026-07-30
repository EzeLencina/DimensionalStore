import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class CompositeGuard implements CanActivate {
  private guards: CanActivate[] = [];
  private mode: 'ALL' | 'ANY' = 'ALL';

  setGuards(guards: CanActivate[], mode: 'ALL' | 'ANY' = 'ALL'): void {
    this.guards = guards;
    this.mode = mode;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.guards.length === 0) return true;

    if (this.mode === 'ALL') {
      for (const guard of this.guards) {
        const result = await guard.canActivate(context);
        if (!result) return false;
      }
      return true;
    }

    for (const guard of this.guards) {
      const result = await guard.canActivate(context);
      if (result) return true;
    }
    return false;
  }
}

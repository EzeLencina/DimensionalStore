import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class BranchContextMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const branchId = req.headers['x-branch-id'] as string;

    if (branchId) {
      req.branchId = branchId;
    } else if (req.tenantContext?.branch) {
      req.branchId = req.tenantContext.branch.id;
    }

    next();
  }
}

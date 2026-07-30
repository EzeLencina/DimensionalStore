export class CheckAccessCommand {
  constructor(
    public readonly userId: string,
    public readonly resource: string,
    public readonly action: string,
    public readonly context?: Record<string, unknown>,
    public readonly scope?: { type: string; referenceId?: string },
  ) {}
}

export class AssignRoleCommand {
  constructor(
    public readonly userId: string,
    public readonly roleId: string,
    public readonly scope: { type: string; referenceId?: string },
    public readonly assignedBy: string,
  ) {}
}

export class CreateRoleCommand {
  constructor(
    public readonly name: string,
    public readonly description?: string,
    public readonly permissions?: Array<{ resource: string; action: string; scope?: { type: string } }>,
    public readonly parentRoleId?: string,
  ) {}
}

export class CreatePolicyCommand {
  constructor(
    public readonly name: string,
    public readonly rules: Array<{
      effect: 'ALLOW' | 'DENY';
      resource: string;
      actions: string[];
      conditions?: Array<{ field: string; operator: string; value: unknown }>;
    }>,
    public readonly description?: string,
    public readonly priority?: number,
  ) {}
}

export class AssignScopeCommand {
  constructor(
    public readonly accountId: string,
    public readonly scopes: string[],
  ) {}
}

export class UpdateRolesCommand {
  constructor(
    public readonly accountId: string,
    public readonly roles: string[],
  ) {}
}

export class UpdatePermissionsCommand {
  constructor(
    public readonly accountId: string,
    public readonly permissions: string[],
  ) {}
}

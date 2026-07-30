export const INVENTORY_PERMISSIONS = {
  WAREHOUSE_CREATE: 'warehouses.create',
  WAREHOUSE_READ: 'warehouses.read',
  WAREHOUSE_UPDATE: 'warehouses.update',
  INVENTORY_READ: 'inventory.read',
  INVENTORY_RECEIVE: 'inventory.receive',
  INVENTORY_DISPATCH: 'inventory.dispatch',
  INVENTORY_ADJUST: 'inventory.adjust',
  INVENTORY_TRANSFER: 'inventory.transfer',
  INVENTORY_RESERVE: 'inventory.reserve',
  INVENTORY_MANAGE: 'inventory.manage',
} as const;

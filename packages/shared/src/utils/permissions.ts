import type { UserRole, Permission } from '../types/user';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  system_admin: 100,
  org_admin: 80,
  manager: 60,
  user: 40,
  viewer: 20,
};

export const DEFAULT_PERMISSIONS: Record<UserRole, Permission[]> = {
  system_admin: [
    { resource: '*', actions: ['*'] },
  ],
  org_admin: [
    { resource: 'organization', actions: ['read', 'update'] },
    { resource: 'users', actions: ['*'] },
    { resource: 'inventory', actions: ['*'] },
    { resource: 'reports', actions: ['*'] },
    { resource: 'settings', actions: ['*'] },
    { resource: 'ai', actions: ['*'] },
  ],
  manager: [
    { resource: 'organization', actions: ['read'] },
    { resource: 'users', actions: ['read', 'create', 'update'] },
    { resource: 'inventory', actions: ['*'] },
    { resource: 'reports', actions: ['read', 'create'] },
    { resource: 'settings', actions: ['read'] },
    { resource: 'ai', actions: ['read', 'use'] },
  ],
  user: [
    { resource: 'organization', actions: ['read'] },
    { resource: 'users', actions: ['read'] },
    { resource: 'inventory', actions: ['read', 'update'] },
    { resource: 'reports', actions: ['read'] },
    { resource: 'ai', actions: ['use'] },
  ],
  viewer: [
    { resource: 'organization', actions: ['read'] },
    { resource: 'users', actions: ['read'] },
    { resource: 'inventory', actions: ['read'] },
    { resource: 'reports', actions: ['read'] },
  ],
};

export function hasPermission(
  userPermissions: Permission[],
  resource: string,
  action: string
): boolean {
  return userPermissions.some(permission => {
    const resourceMatch = permission.resource === '*' || permission.resource === resource;
    const actionMatch = permission.actions.includes('*') || permission.actions.includes(action);
    return resourceMatch && actionMatch;
  });
}

export function canManageUser(managerRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetRole];
}

export function mergePermissions(
  rolePermissions: Permission[],
  customPermissions: Permission[]
): Permission[] {
  const permissionMap = new Map<string, Set<string>>();

  // Add role permissions
  rolePermissions.forEach(p => {
    if (!permissionMap.has(p.resource)) {
      permissionMap.set(p.resource, new Set());
    }
    p.actions.forEach(action => permissionMap.get(p.resource)!.add(action));
  });

  // Add custom permissions
  customPermissions.forEach(p => {
    if (!permissionMap.has(p.resource)) {
      permissionMap.set(p.resource, new Set());
    }
    p.actions.forEach(action => permissionMap.get(p.resource)!.add(action));
  });

  // Convert back to Permission array
  return Array.from(permissionMap.entries()).map(([resource, actions]) => ({
    resource,
    actions: Array.from(actions),
  }));
}
'use client';

import React, { useState } from 'react';
import { MobileCard, TouchButton, BottomSheet, TouchInput } from '@itemseek2/ui-mobile';
import { DEFAULT_PERMISSIONS, type UserRole, type Permission } from '@itemseek2/shared';

export function RoleManager() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isCreatingRole, setIsCreatingRole] = useState(false);

  const roles: Array<{
    id: UserRole;
    name: string;
    description: string;
    userCount: number;
    color: string;
  }> = [
    {
      id: 'org_admin',
      name: 'Organization Admin',
      description: 'Full access to organization settings and users',
      userCount: 2,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Manage inventory and team members',
      userCount: 5,
      color: 'bg-green-100 text-green-700'
    },
    {
      id: 'user',
      name: 'User',
      description: 'Basic inventory access and operations',
      userCount: 18,
      color: 'bg-gray-100 text-gray-700'
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Read-only access to inventory',
      userCount: 3,
      color: 'bg-orange-100 text-orange-700'
    }
  ];

  const permissionGroups = [
    {
      name: 'Organization',
      permissions: [
        { id: 'org.read', label: 'View organization details' },
        { id: 'org.update', label: 'Update organization settings' }
      ]
    },
    {
      name: 'Users',
      permissions: [
        { id: 'users.read', label: 'View users' },
        { id: 'users.create', label: 'Create users' },
        { id: 'users.update', label: 'Update users' },
        { id: 'users.delete', label: 'Delete users' }
      ]
    },
    {
      name: 'Inventory',
      permissions: [
        { id: 'inventory.read', label: 'View inventory' },
        { id: 'inventory.create', label: 'Add items' },
        { id: 'inventory.update', label: 'Update items' },
        { id: 'inventory.delete', label: 'Delete items' }
      ]
    },
    {
      name: 'Reports',
      permissions: [
        { id: 'reports.read', label: 'View reports' },
        { id: 'reports.create', label: 'Create reports' },
        { id: 'reports.export', label: 'Export reports' }
      ]
    }
  ];

  const hasPermission = (role: UserRole, permissionId: string): boolean => {
    const permissions = DEFAULT_PERMISSIONS[role];
    const [resource, action] = permissionId.split('.');
    return permissions.some(p => 
      (p.resource === '*' || p.resource === resource) &&
      (p.actions.includes('*') || p.actions.includes(action))
    );
  };

  return (
    <div className="space-y-4">
      {/* Role Overview */}
      <div className="grid grid-cols-2 gap-3">
        <MobileCard padding="sm">
          <p className="text-sm text-gray-500">Total Roles</p>
          <p className="text-2xl font-bold">{roles.length}</p>
        </MobileCard>
        <MobileCard padding="sm">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">
            {roles.reduce((sum, role) => sum + role.userCount, 0)}
          </p>
        </MobileCard>
      </div>

      {/* Role List */}
      <div className="space-y-3">
        {roles.map((role) => (
          <MobileCard
            key={role.id}
            pressable
            onClick={() => setSelectedRole(role.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900">{role.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${role.color}`}>
                    {role.id}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{role.description}</p>
                <p className="text-xs text-gray-400 mt-1">{role.userCount} users</p>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </MobileCard>
        ))}
      </div>

      {/* Create Custom Role */}
      <TouchButton 
        fullWidth 
        variant="secondary"
        onClick={() => setIsCreatingRole(true)}
      >
        + Create Custom Role
      </TouchButton>

      {/* Role Details Sheet */}
      <BottomSheet
        isOpen={!!selectedRole}
        onClose={() => setSelectedRole(null)}
        title={roles.find(r => r.id === selectedRole)?.name || 'Role Details'}
      >
        {selectedRole && (
          <div className="space-y-4">
            <MobileCard>
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-gray-900">
                {roles.find(r => r.id === selectedRole)?.description}
              </p>
              <p className="text-sm text-gray-500 mt-3 mb-1">Users with this role</p>
              <p className="text-2xl font-bold text-gray-900">
                {roles.find(r => r.id === selectedRole)?.userCount}
              </p>
            </MobileCard>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Permissions</h4>
              <div className="space-y-4">
                {permissionGroups.map((group) => (
                  <div key={group.name}>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">{group.name}</h5>
                    <div className="space-y-2">
                      {group.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center gap-2">
                          <span className={hasPermission(selectedRole, permission.id) ? 'text-green-500' : 'text-gray-300'}>
                            {hasPermission(selectedRole, permission.id) ? '✓' : '○'}
                          </span>
                          <span className="text-sm text-gray-700">{permission.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedRole !== 'system_admin' && (
              <TouchButton fullWidth variant="secondary">
                Edit Permissions
              </TouchButton>
            )}
          </div>
        )}
      </BottomSheet>

      {/* Create Role Sheet */}
      <BottomSheet
        isOpen={isCreatingRole}
        onClose={() => setIsCreatingRole(false)}
        title="Create Custom Role"
      >
        <div className="space-y-4">
          <TouchInput label="Role Name" placeholder="e.g., Inventory Specialist" />
          <TouchInput 
            label="Role ID" 
            placeholder="e.g., inventory_specialist"
            error="Use lowercase letters and underscores only"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Permissions On
            </label>
            <select className="w-full min-h-[48px] px-4 rounded-lg border border-gray-300">
              <option value="">Start from scratch</option>
              <option value="viewer">Viewer (read-only)</option>
              <option value="user">User (basic access)</option>
              <option value="manager">Manager (team management)</option>
            </select>
          </div>
          <TouchInput 
            label="Description" 
            placeholder="What can users with this role do?"
          />
          
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> After creating the role, you can customize its permissions in detail.
            </p>
          </div>

          <TouchButton fullWidth variant="primary">
            Create Role
          </TouchButton>
        </div>
      </BottomSheet>
    </div>
  );
}
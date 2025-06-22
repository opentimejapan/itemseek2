'use client';

import React, { useState } from 'react';
import { MobileCard, TouchInput, TouchButton } from '@itemseek2/ui-mobile';
import type { User, UserRole } from '@itemseek2/shared';

interface UserListProps {
  onSelectUser: (userId: string) => void;
}

export function UserList({ onSelectUser }: UserListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');

  const users: User[] = [
    {
      id: '1',
      email: 'john.doe@company.com',
      name: 'John Doe',
      role: 'org_admin',
      organizationId: '1',
      permissions: [],
      isActive: true,
      lastLoginAt: new Date(Date.now() - 3600000),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    {
      id: '2',
      email: 'jane.smith@company.com',
      name: 'Jane Smith',
      role: 'manager',
      organizationId: '1',
      permissions: [],
      isActive: true,
      lastLoginAt: new Date(Date.now() - 86400000),
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date()
    },
    {
      id: '3',
      email: 'bob.wilson@company.com',
      name: 'Bob Wilson',
      role: 'user',
      organizationId: '1',
      permissions: [],
      isActive: false,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date()
    }
  ];

  const roleColors: Record<UserRole, string> = {
    system_admin: 'bg-purple-100 text-purple-700',
    org_admin: 'bg-blue-100 text-blue-700',
    manager: 'bg-green-100 text-green-700',
    user: 'bg-gray-100 text-gray-700',
    viewer: 'bg-orange-100 text-orange-700'
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const formatLastLogin = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="space-y-3">
        <TouchInput
          type="search"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<span>🔍</span>}
        />
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          <TouchButton
            size="sm"
            variant={filterRole === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilterRole('all')}
          >
            All
          </TouchButton>
          {(['org_admin', 'manager', 'user', 'viewer'] as UserRole[]).map(role => (
            <TouchButton
              key={role}
              size="sm"
              variant={filterRole === role ? 'primary' : 'secondary'}
              onClick={() => setFilterRole(role)}
            >
              {role.replace('_', ' ')}
            </TouchButton>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <MobileCard padding="sm">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-bold">{users.length}</p>
        </MobileCard>
        <MobileCard padding="sm">
          <p className="text-xs text-gray-500">Active</p>
          <p className="text-xl font-bold text-green-600">
            {users.filter(u => u.isActive).length}
          </p>
        </MobileCard>
        <MobileCard padding="sm">
          <p className="text-xs text-gray-500">Inactive</p>
          <p className="text-xl font-bold text-gray-500">
            {users.filter(u => !u.isActive).length}
          </p>
        </MobileCard>
      </div>

      {/* User List */}
      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <MobileCard
            key={user.id}
            pressable
            onClick={() => onSelectUser(user.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${roleColors[user.role]}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400">
                    Last login: {formatLastLogin(user.lastLoginAt)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  user.isActive ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span className="text-gray-400">→</span>
              </div>
            </div>
          </MobileCard>
        ))}
      </div>

      {/* Add User Button */}
      <TouchButton fullWidth variant="primary">
        + Add New User
      </TouchButton>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { MobileCard, TouchButton, TouchInput, BottomSheet } from '@itemseek2/ui-mobile';
import type { UserRole } from '@itemseek2/shared';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  lastActive: string;
  status: 'active' | 'inactive';
}

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'org_admin',
      organization: 'Acme Corp',
      lastActive: '2 mins ago',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'manager',
      organization: 'Tech Inc',
      lastActive: '1 hour ago',
      status: 'active'
    }
  ];

  const roleColors = {
    system_admin: 'bg-purple-100 text-purple-700',
    org_admin: 'bg-blue-100 text-blue-700',
    manager: 'bg-green-100 text-green-700',
    user: 'bg-gray-100 text-gray-700',
    viewer: 'bg-orange-100 text-orange-700'
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <TouchInput
        type="search"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        icon={<span>🔍</span>}
      />

      {/* Add User Button */}
      <TouchButton fullWidth variant="primary">
        + Add New User
      </TouchButton>

      {/* User List */}
      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <MobileCard
            key={user.id}
            pressable
            onClick={() => {
              setSelectedUser(user);
              setIsEditOpen(true);
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${roleColors[user.role]}`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400">{user.organization} • {user.lastActive}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
            </div>
          </MobileCard>
        ))}
      </div>

      {/* Edit User Sheet */}
      <BottomSheet
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit User"
      >
        {selectedUser && (
          <div className="space-y-4">
            <TouchInput
              label="Name"
              value={selectedUser.name}
              onChange={() => {}}
            />
            <TouchInput
              label="Email"
              type="email"
              value={selectedUser.email}
              onChange={() => {}}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select className="w-full min-h-[48px] px-4 rounded-lg border border-gray-300">
                <option value="org_admin">Organization Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div className="flex gap-3">
              <TouchButton fullWidth variant="primary">
                Save Changes
              </TouchButton>
              <TouchButton fullWidth variant="secondary" onClick={() => setIsEditOpen(false)}>
                Cancel
              </TouchButton>
            </div>
            <TouchButton fullWidth variant="danger">
              Deactivate User
            </TouchButton>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
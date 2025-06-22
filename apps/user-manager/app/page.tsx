'use client';

import { useState } from 'react';
import { MobileNav, TouchButton } from '@itemseek2/ui-mobile';
import { UserList } from '../components/UserList';
import { UserProfile } from '../components/UserProfile';
import { RoleManager } from '../components/RoleManager';
import { UserActivity } from '../components/UserActivity';
import { InviteUsers } from '../components/InviteUsers';

const navItems = [
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'roles', label: 'Roles', icon: '🔐' },
  { id: 'invites', label: 'Invites', icon: '✉️' },
  { id: 'activity', label: 'Activity', icon: '📊' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

type View = 'users' | 'roles' | 'invites' | 'activity' | 'profile';

export default function UserManagerPage() {
  const [activeView, setActiveView] = useState<View>('users');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const renderContent = () => {
    if (selectedUserId && activeView === 'users') {
      return (
        <UserProfile 
          userId={selectedUserId} 
          onBack={() => setSelectedUserId(null)}
        />
      );
    }

    switch (activeView) {
      case 'users':
        return <UserList onSelectUser={setSelectedUserId} />;
      case 'roles':
        return <RoleManager />;
      case 'invites':
        return <InviteUsers />;
      case 'activity':
        return <UserActivity />;
      case 'profile':
        return <UserProfile userId="current" />;
      default:
        return <UserList onSelectUser={setSelectedUserId} />;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 safe-area-top">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Manager</h1>
            <p className="text-sm text-gray-500">Manage users and permissions</p>
          </div>
          {selectedUserId && (
            <TouchButton
              variant="ghost"
              size="sm"
              onClick={() => setSelectedUserId(null)}
            >
              ← Back
            </TouchButton>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <MobileNav
        items={navItems}
        activeId={activeView}
        onChange={(id) => {
          setActiveView(id as View);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
}
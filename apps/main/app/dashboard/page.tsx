'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MobileCard, TouchButton } from '@itemseek2/ui-mobile';
import { useAuth } from '@itemseek2/api-client';

const apps = [
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Manage your inventory items',
    icon: '📦',
    url: 'http://localhost:3002',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'System administration',
    icon: '⚙️',
    url: 'http://localhost:3003',
    color: 'bg-purple-100 text-purple-700',
    roles: ['org_admin', 'system_admin'],
  },
  {
    id: 'ai-connector',
    name: 'AI Workflows',
    description: 'Automate with AI',
    icon: '🤖',
    url: 'http://localhost:3004',
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 'user-manager',
    name: 'Users',
    description: 'Manage team members',
    icon: '👥',
    url: 'http://localhost:3005',
    color: 'bg-orange-100 text-orange-700',
    roles: ['org_admin', 'manager', 'system_admin'],
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const canAccessApp = (app: typeof apps[0]) => {
    if (!app.roles) return true;
    return app.roles.includes(user?.role || '');
  };

  const openApp = (url: string) => {
    // In production, these would be proper routes or subdomains
    window.location.href = url;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 safe-area-top">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ItemSeek2</h1>
            <p className="text-sm text-gray-500">Welcome, {user.name}</p>
          </div>
          <TouchButton variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </TouchButton>
        </div>
      </div>

      {/* App Grid */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Applications</h2>
        <div className="grid grid-cols-2 gap-4">
          {apps.map((app) => {
            const canAccess = canAccessApp(app);
            return (
              <MobileCard
                key={app.id}
                pressable={canAccess}
                onClick={() => canAccess && openApp(app.url)}
                className={!canAccess ? 'opacity-50' : ''}
              >
                <div className="text-center py-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 ${app.color}`}>
                    <span className="text-3xl">{app.icon}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{app.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{app.description}</p>
                  {!canAccess && (
                    <p className="text-xs text-red-600 mt-2">Requires higher role</p>
                  )}
                </div>
              </MobileCard>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 pb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Stats</h2>
        <div className="grid grid-cols-3 gap-3">
          <MobileCard padding="sm">
            <p className="text-xs text-gray-500">Items</p>
            <p className="text-xl font-bold">342</p>
          </MobileCard>
          <MobileCard padding="sm">
            <p className="text-xs text-gray-500">Low Stock</p>
            <p className="text-xl font-bold text-yellow-600">12</p>
          </MobileCard>
          <MobileCard padding="sm">
            <p className="text-xs text-gray-500">Users</p>
            <p className="text-xl font-bold">8</p>
          </MobileCard>
        </div>
      </div>
    </div>
  );
}
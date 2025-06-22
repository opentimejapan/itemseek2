'use client';

import { useState } from 'react';
import { MobileNav, TouchButton } from '@itemseek2/ui-mobile';
import { NavigationStack } from '../components/NavigationStack';
import { Dashboard } from '../components/Dashboard';
import { UserManagement } from '../components/UserManagement';
import { AIConnectorConfig } from '../components/AIConnectorConfig';
import { OrganizationSettings } from '../components/OrganizationSettings';
import { SystemMonitor } from '../components/SystemMonitor';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'ai', label: 'AI Config', icon: '🤖' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'monitor', label: 'Monitor', icon: '📡' },
];

type View = 'dashboard' | 'users' | 'ai' | 'settings' | 'monitor';

export default function AdminPage() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [navigationStack, setNavigationStack] = useState<View[]>(['dashboard']);

  const pushView = (view: View) => {
    setNavigationStack([...navigationStack, view]);
    setActiveView(view);
  };

  const popView = () => {
    if (navigationStack.length > 1) {
      const newStack = navigationStack.slice(0, -1);
      setNavigationStack(newStack);
      setActiveView(newStack[newStack.length - 1]);
    }
  };

  const goHome = () => {
    setNavigationStack(['dashboard']);
    setActiveView('dashboard');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onNavigate={pushView} />;
      case 'users':
        return <UserManagement />;
      case 'ai':
        return <AIConnectorConfig />;
      case 'settings':
        return <OrganizationSettings />;
      case 'monitor':
        return <SystemMonitor />;
      default:
        return <Dashboard onNavigate={pushView} />;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <NavigationStack
        currentView={activeView}
        canGoBack={navigationStack.length > 1}
        onBack={popView}
        onHome={goHome}
      />

      <div className="px-4 py-4">
        {renderContent()}
      </div>

      <MobileNav
        items={navItems}
        activeId={activeView}
        onChange={(id) => pushView(id as View)}
      />
    </div>
  );
}
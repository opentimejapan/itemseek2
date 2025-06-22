'use client';

import { useState } from 'react';
import { MobileNav, TouchButton, MobileCard } from '@itemseek2/ui-mobile';
import { WorkflowBuilder } from '../components/WorkflowBuilder';
import { AIProviderList } from '../components/AIProviderList';
import { WorkflowTemplates } from '../components/WorkflowTemplates';
import { WorkflowHistory } from '../components/WorkflowHistory';

const navItems = [
  { id: 'workflows', label: 'Workflows', icon: '🔄' },
  { id: 'providers', label: 'Providers', icon: '🤖' },
  { id: 'templates', label: 'Templates', icon: '📋' },
  { id: 'history', label: 'History', icon: '📊' },
];

export default function AIConnectorPage() {
  const [activeTab, setActiveTab] = useState('workflows');

  const renderContent = () => {
    switch (activeTab) {
      case 'workflows':
        return <WorkflowBuilder />;
      case 'providers':
        return <AIProviderList />;
      case 'templates':
        return <WorkflowTemplates />;
      case 'history':
        return <WorkflowHistory />;
      default:
        return <WorkflowBuilder />;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 safe-area-top">
        <div className="px-4 py-3">
          <h1 className="text-2xl font-bold text-gray-900">AI Connector</h1>
          <p className="text-sm text-gray-500">Automate your inventory workflows</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <MobileNav
        items={navItems}
        activeId={activeTab}
        onChange={setActiveTab}
      />
    </div>
  );
}
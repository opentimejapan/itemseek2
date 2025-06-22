'use client';

import React from 'react';
import { MobileCard } from '@itemseek2/ui-mobile';

interface DashboardProps {
  onNavigate: (view: any) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', color: 'text-green-600' },
    { label: 'Active Orgs', value: '56', change: '+5%', color: 'text-green-600' },
    { label: 'AI Requests', value: '8.5K', change: '+23%', color: 'text-blue-600' },
    { label: 'System Health', value: '99.9%', change: '0%', color: 'text-gray-600' },
  ];

  const quickActions = [
    { id: 'users', label: 'Manage Users', icon: '👥', description: 'Add, edit, or remove users' },
    { id: 'ai', label: 'AI Settings', icon: '🤖', description: 'Configure AI providers' },
    { id: 'settings', label: 'Org Settings', icon: '🏢', description: 'Update organization details' },
    { id: 'monitor', label: 'System Monitor', icon: '📡', description: 'View system performance' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <MobileCard key={index} padding="sm">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className={`text-sm font-medium ${stat.color}`}>{stat.change}</p>
          </MobileCard>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <div className="space-y-3">
          {quickActions.map((action) => (
            <MobileCard
              key={action.id}
              pressable
              onClick={() => onNavigate(action.id)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{action.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{action.label}</p>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </MobileCard>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h2>
        <MobileCard>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">New user registered</p>
                <p className="text-xs text-gray-500">john@example.com - 5 mins ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">AI provider updated</p>
                <p className="text-xs text-gray-500">OpenAI GPT-4 enabled - 1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">Organization upgraded</p>
                <p className="text-xs text-gray-500">Acme Corp → Professional - 2 hours ago</p>
              </div>
            </div>
          </div>
        </MobileCard>
      </div>
    </div>
  );
}
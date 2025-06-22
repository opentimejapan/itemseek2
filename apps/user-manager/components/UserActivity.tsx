'use client';

import React, { useState } from 'react';
import { MobileCard, TouchButton, BottomSheet } from '@itemseek2/ui-mobile';
import type { AuditLog } from '@itemseek2/shared';

export function UserActivity() {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('today');

  const activities: AuditLog[] = [
    {
      id: '1',
      userId: '1',
      organizationId: '1',
      action: 'inventory.update',
      resource: 'inventory',
      resourceId: 'item-123',
      changes: { quantity: { from: 100, to: 85 } },
      createdAt: new Date(Date.now() - 300000) // 5 mins ago
    },
    {
      id: '2',
      userId: '2',
      organizationId: '1',
      action: 'user.login',
      resource: 'auth',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 iPhone',
      createdAt: new Date(Date.now() - 1800000) // 30 mins ago
    },
    {
      id: '3',
      userId: '1',
      organizationId: '1',
      action: 'report.create',
      resource: 'reports',
      resourceId: 'report-456',
      createdAt: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
      id: '4',
      userId: '3',
      organizationId: '1',
      action: 'inventory.create',
      resource: 'inventory',
      resourceId: 'item-789',
      changes: { name: 'New Product', quantity: 50 },
      createdAt: new Date(Date.now() - 7200000) // 2 hours ago
    },
    {
      id: '5',
      userId: '2',
      organizationId: '1',
      action: 'user.update',
      resource: 'users',
      resourceId: 'user-999',
      changes: { role: { from: 'user', to: 'manager' } },
      createdAt: new Date(Date.now() - 86400000) // 1 day ago
    }
  ];

  // Mock user data
  const users = {
    '1': { name: 'John Doe', avatar: 'JD' },
    '2': { name: 'Jane Smith', avatar: 'JS' },
    '3': { name: 'Bob Wilson', avatar: 'BW' }
  };

  const actionIcons: Record<string, string> = {
    'inventory.update': '📦',
    'inventory.create': '➕',
    'inventory.delete': '🗑️',
    'user.login': '🔐',
    'user.logout': '🚪',
    'user.update': '👤',
    'report.create': '📊',
    'report.export': '💾'
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getActionDescription = (log: AuditLog): string => {
    const [resource, action] = log.action.split('.');
    
    switch (log.action) {
      case 'inventory.update':
        return `Updated inventory item`;
      case 'inventory.create':
        return `Added new inventory item`;
      case 'inventory.delete':
        return `Deleted inventory item`;
      case 'user.login':
        return `Logged in`;
      case 'user.update':
        return `Updated user settings`;
      case 'report.create':
        return `Created new report`;
      case 'report.export':
        return `Exported report`;
      default:
        return `Performed ${action} on ${resource}`;
    }
  };

  const filterActivities = () => {
    const now = new Date();
    switch (filter) {
      case 'today':
        return activities.filter(a => 
          now.getTime() - a.createdAt.getTime() < 86400000
        );
      case 'week':
        return activities.filter(a => 
          now.getTime() - a.createdAt.getTime() < 7 * 86400000
        );
      default:
        return activities;
    }
  };

  const filteredActivities = filterActivities();

  return (
    <div className="space-y-4">
      {/* Activity Stats */}
      <div className="grid grid-cols-3 gap-3">
        <MobileCard padding="sm">
          <p className="text-xs text-gray-500">Today</p>
          <p className="text-xl font-bold">127</p>
          <p className="text-xs text-green-600">+15%</p>
        </MobileCard>
        <MobileCard padding="sm">
          <p className="text-xs text-gray-500">Active Users</p>
          <p className="text-xl font-bold">18</p>
          <p className="text-xs text-gray-600">of 28</p>
        </MobileCard>
        <MobileCard padding="sm">
          <p className="text-xs text-gray-500">Peak Hour</p>
          <p className="text-xl font-bold">2PM</p>
          <p className="text-xs text-gray-600">45 actions</p>
        </MobileCard>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <TouchButton 
          size="sm" 
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => setFilter('all')}
        >
          All Time
        </TouchButton>
        <TouchButton 
          size="sm" 
          variant={filter === 'today' ? 'primary' : 'secondary'}
          onClick={() => setFilter('today')}
        >
          Today
        </TouchButton>
        <TouchButton 
          size="sm" 
          variant={filter === 'week' ? 'primary' : 'secondary'}
          onClick={() => setFilter('week')}
        >
          This Week
        </TouchButton>
      </div>

      {/* Activity Feed */}
      <div className="space-y-3">
        {filteredActivities.map((activity) => (
          <MobileCard
            key={activity.id}
            pressable
            onClick={() => setSelectedLog(activity)}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium">
                  {users[activity.userId]?.avatar}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">
                    {users[activity.userId]?.name}
                  </p>
                  <span className="text-lg">
                    {actionIcons[activity.action] || '📌'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {getActionDescription(activity)}
                </p>
                {activity.changes && (
                  <p className="text-xs text-gray-500 mt-1">
                    {Object.entries(activity.changes).map(([key, value]) => {
                      if (typeof value === 'object' && 'from' in value && 'to' in value) {
                        return `${key}: ${value.from} → ${value.to}`;
                      }
                      return `${key}: ${value}`;
                    }).join(', ')}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {formatTime(activity.createdAt)}
                </p>
              </div>
            </div>
          </MobileCard>
        ))}
      </div>

      {/* Export Button */}
      <TouchButton fullWidth variant="secondary">
        Export Activity Log
      </TouchButton>

      {/* Activity Details Sheet */}
      <BottomSheet
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Activity Details"
      >
        {selectedLog && (
          <div className="space-y-4">
            <MobileCard>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">User</p>
                  <p className="font-medium">{users[selectedLog.userId]?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{selectedLog.createdAt.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Action</p>
                  <p className="font-medium">{selectedLog.action}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Resource</p>
                  <p className="font-medium">{selectedLog.resource}</p>
                </div>
              </div>
            </MobileCard>

            {selectedLog.changes && (
              <MobileCard>
                <h4 className="font-medium text-gray-900 mb-2">Changes</h4>
                <div className="space-y-2">
                  {Object.entries(selectedLog.changes).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm font-medium text-gray-700">{key}</p>
                      <p className="text-sm text-gray-600">
                        {typeof value === 'object' && 'from' in value && 'to' in value
                          ? `${value.from} → ${value.to}`
                          : JSON.stringify(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </MobileCard>
            )}

            {(selectedLog.ipAddress || selectedLog.userAgent) && (
              <MobileCard>
                <h4 className="font-medium text-gray-900 mb-2">Technical Details</h4>
                {selectedLog.ipAddress && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-500">IP Address</p>
                    <p className="text-sm font-mono">{selectedLog.ipAddress}</p>
                  </div>
                )}
                {selectedLog.userAgent && (
                  <div>
                    <p className="text-sm text-gray-500">User Agent</p>
                    <p className="text-sm font-mono break-all">{selectedLog.userAgent}</p>
                  </div>
                )}
              </MobileCard>
            )}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
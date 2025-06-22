'use client';

import React from 'react';
import { MobileCard } from '@itemseek2/ui-mobile';

interface QuickActionsProps {
  onActionSelect: (action: string) => void;
}

export function QuickActions({ onActionSelect }: QuickActionsProps) {
  const actions = [
    { id: 'scan', label: 'Scan', icon: '📷', color: 'bg-blue-100 text-blue-700' },
    { id: 'count', label: 'Count', icon: '🔢', color: 'bg-green-100 text-green-700' },
    { id: 'receive', label: 'Receive', icon: '📥', color: 'bg-purple-100 text-purple-700' },
    { id: 'transfer', label: 'Transfer', icon: '🔄', color: 'bg-orange-100 text-orange-700' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action) => (
        <MobileCard
          key={action.id}
          pressable
          padding="sm"
          onClick={() => onActionSelect(action.id)}
          className="text-center"
        >
          <div className={`rounded-lg p-3 mb-2 ${action.color}`}>
            <span className="text-2xl">{action.icon}</span>
          </div>
          <p className="text-sm font-medium text-gray-700">{action.label}</p>
        </MobileCard>
      ))}
    </div>
  );
}
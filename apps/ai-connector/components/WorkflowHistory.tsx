'use client';

import React, { useState } from 'react';
import { MobileCard, TouchButton, BottomSheet } from '@itemseek2/ui-mobile';

interface WorkflowRun {
  id: string;
  workflowName: string;
  status: 'success' | 'failed' | 'running';
  startTime: Date;
  duration: number;
  triggeredBy: string;
  aiCalls: number;
  actions: {
    type: string;
    result: string;
  }[];
}

export function WorkflowHistory() {
  const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(null);

  const runs: WorkflowRun[] = [
    {
      id: '1',
      workflowName: 'Smart Reordering',
      status: 'success',
      startTime: new Date(Date.now() - 3600000),
      duration: 45,
      triggeredBy: 'Schedule',
      aiCalls: 2,
      actions: [
        { type: 'AI Analysis', result: 'Predicted 20% increase in demand' },
        { type: 'Create Order', result: 'PO #12345 created for 500 units' }
      ]
    },
    {
      id: '2',
      workflowName: 'Low Stock Alert',
      status: 'running',
      startTime: new Date(Date.now() - 300000),
      duration: 5,
      triggeredBy: 'System',
      aiCalls: 0,
      actions: [
        { type: 'Check Inventory', result: 'Found 3 low stock items' }
      ]
    },
    {
      id: '3',
      workflowName: 'Demand Forecasting',
      status: 'failed',
      startTime: new Date(Date.now() - 7200000),
      duration: 120,
      triggeredBy: 'Manual',
      aiCalls: 3,
      actions: [
        { type: 'Data Collection', result: 'Success' },
        { type: 'AI Analysis', result: 'Error: Insufficient data' }
      ]
    }
  ];

  const statusColors = {
    success: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    running: 'bg-blue-100 text-blue-700'
  };

  const statusIcons = {
    success: '✅',
    failed: '❌',
    running: '⏳'
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 60) return `${minutes} mins ago`;
    if (hours < 24) return `${hours} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <MobileCard padding="sm">
          <p className="text-xs text-gray-500">Today</p>
          <p className="text-xl font-bold">24</p>
          <p className="text-xs text-green-600">+12%</p>
        </MobileCard>
        <MobileCard padding="sm">
          <p className="text-xs text-gray-500">Success</p>
          <p className="text-xl font-bold">92%</p>
          <p className="text-xs text-gray-600">22/24</p>
        </MobileCard>
        <MobileCard padding="sm">
          <p className="text-xs text-gray-500">AI Calls</p>
          <p className="text-xl font-bold">156</p>
          <p className="text-xs text-gray-600">$4.32</p>
        </MobileCard>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <TouchButton size="sm" variant="primary">All</TouchButton>
        <TouchButton size="sm" variant="secondary">Success</TouchButton>
        <TouchButton size="sm" variant="secondary">Failed</TouchButton>
        <TouchButton size="sm" variant="secondary">Running</TouchButton>
      </div>

      {/* Run History */}
      <div className="space-y-3">
        {runs.map((run) => (
          <MobileCard
            key={run.id}
            pressable
            onClick={() => setSelectedRun(run)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span>{statusIcons[run.status]}</span>
                <div>
                  <p className="font-medium text-gray-900">{run.workflowName}</p>
                  <p className="text-xs text-gray-500">{formatTime(run.startTime)}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[run.status]}`}>
                {run.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>⏱️ {formatDuration(run.duration)}</span>
              <span>👤 {run.triggeredBy}</span>
              {run.aiCalls > 0 && <span>🤖 {run.aiCalls} AI calls</span>}
            </div>
          </MobileCard>
        ))}
      </div>

      {/* Run Details Sheet */}
      <BottomSheet
        isOpen={!!selectedRun}
        onClose={() => setSelectedRun(null)}
        title="Workflow Run Details"
      >
        {selectedRun && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium flex items-center gap-1">
                  {statusIcons[selectedRun.status]} {selectedRun.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{formatDuration(selectedRun.duration)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Triggered By</p>
                <p className="font-medium">{selectedRun.triggeredBy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">AI Calls</p>
                <p className="font-medium">{selectedRun.aiCalls}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Action Log</h4>
              <div className="space-y-2">
                {selectedRun.actions.map((action, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-sm text-gray-900">{action.type}</p>
                    <p className="text-sm text-gray-600">{action.result}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <TouchButton fullWidth variant="primary">
                View Full Log
              </TouchButton>
              <TouchButton fullWidth variant="secondary">
                Re-run
              </TouchButton>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
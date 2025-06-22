'use client';

import React, { useState } from 'react';
import { MobileCard, TouchButton, BottomSheet } from '@itemseek2/ui-mobile';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'ai';
  label: string;
  config?: any;
}

export function WorkflowBuilder() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: '1', type: 'trigger', label: 'Low Stock Alert' },
    { id: '2', type: 'ai', label: 'Analyze Demand' },
    { id: '3', type: 'action', label: 'Create Purchase Order' }
  ]);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);

  const nodeTypes = {
    trigger: { color: 'bg-blue-100 text-blue-700', icon: '⚡' },
    condition: { color: 'bg-yellow-100 text-yellow-700', icon: '🔀' },
    action: { color: 'bg-green-100 text-green-700', icon: '▶️' },
    ai: { color: 'bg-purple-100 text-purple-700', icon: '🤖' }
  };

  const availableNodes = [
    { type: 'trigger', label: 'Low Stock Alert', description: 'When inventory falls below threshold' },
    { type: 'trigger', label: 'Schedule', description: 'Run at specific times' },
    { type: 'trigger', label: 'Manual', description: 'Triggered by user action' },
    { type: 'condition', label: 'Check Quantity', description: 'Compare inventory levels' },
    { type: 'condition', label: 'Time Check', description: 'Check day/time conditions' },
    { type: 'ai', label: 'Predict Demand', description: 'AI forecasts future needs' },
    { type: 'ai', label: 'Optimize Order', description: 'AI determines best quantity' },
    { type: 'action', label: 'Send Alert', description: 'Notify team members' },
    { type: 'action', label: 'Create Order', description: 'Generate purchase order' }
  ];

  const addNode = (type: string, label: string) => {
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type: type as any,
      label
    };
    setNodes([...nodes, newNode]);
    setIsAddNodeOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Workflow Name */}
      <MobileCard>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900">Automated Reorder Workflow</h3>
            <p className="text-sm text-gray-500">Runs when stock is low</p>
          </div>
          <TouchButton size="sm" variant="primary">
            Save
          </TouchButton>
        </div>
      </MobileCard>

      {/* Workflow Nodes */}
      <div className="space-y-3">
        {nodes.map((node, index) => (
          <div key={node.id}>
            <MobileCard>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${nodeTypes[node.type].color}`}>
                  <span className="text-xl">{nodeTypes[node.type].icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{node.label}</p>
                  <p className="text-sm text-gray-500">{node.type}</p>
                </div>
                <TouchButton size="sm" variant="ghost">
                  ⚙️
                </TouchButton>
              </div>
            </MobileCard>
            {index < nodes.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="w-0.5 h-8 bg-gray-300" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Node Button */}
      <TouchButton 
        fullWidth 
        variant="secondary"
        onClick={() => setIsAddNodeOpen(true)}
      >
        + Add Step
      </TouchButton>

      {/* Test Workflow */}
      <MobileCard>
        <h4 className="font-medium text-gray-900 mb-3">Test Workflow</h4>
        <TouchButton fullWidth variant="primary">
          Run Test
        </TouchButton>
      </MobileCard>

      {/* Add Node Sheet */}
      <BottomSheet
        isOpen={isAddNodeOpen}
        onClose={() => setIsAddNodeOpen(false)}
        title="Add Workflow Step"
      >
        <div className="space-y-3">
          {availableNodes.map((node) => (
            <MobileCard
              key={`${node.type}-${node.label}`}
              pressable
              onClick={() => addNode(node.type, node.label)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${nodeTypes[node.type as keyof typeof nodeTypes].color}`}>
                  <span className="text-xl">{nodeTypes[node.type as keyof typeof nodeTypes].icon}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{node.label}</p>
                  <p className="text-sm text-gray-500">{node.description}</p>
                </div>
              </div>
            </MobileCard>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
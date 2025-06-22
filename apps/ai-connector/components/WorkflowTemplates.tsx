'use client';

import React from 'react';
import { MobileCard, TouchButton } from '@itemseek2/ui-mobile';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  icon: string;
  aiRequired: boolean;
}

export function WorkflowTemplates() {
  const templates: WorkflowTemplate[] = [
    {
      id: '1',
      name: 'Smart Reordering',
      description: 'AI predicts demand and automatically creates purchase orders',
      category: 'Inventory',
      difficulty: 'easy',
      icon: '📦',
      aiRequired: true
    },
    {
      id: '2',
      name: 'Low Stock Alerts',
      description: 'Get notified when items fall below threshold',
      category: 'Inventory',
      difficulty: 'easy',
      icon: '🔔',
      aiRequired: false
    },
    {
      id: '3',
      name: 'Demand Forecasting',
      description: 'AI analyzes patterns to predict future needs',
      category: 'Analytics',
      difficulty: 'medium',
      icon: '📊',
      aiRequired: true
    },
    {
      id: '4',
      name: 'Supplier Optimization',
      description: 'AI finds best suppliers based on price and delivery',
      category: 'Procurement',
      difficulty: 'advanced',
      icon: '🚚',
      aiRequired: true
    },
    {
      id: '5',
      name: 'Expiry Management',
      description: 'Track and alert on expiring items',
      category: 'Quality',
      difficulty: 'easy',
      icon: '⏰',
      aiRequired: false
    },
    {
      id: '6',
      name: 'Cost Analysis',
      description: 'AI identifies cost-saving opportunities',
      category: 'Finance',
      difficulty: 'medium',
      icon: '💰',
      aiRequired: true
    }
  ];

  const categories = [...new Set(templates.map(t => t.category))];
  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700'
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="sticky top-0 bg-gray-50 pb-3">
        <input
          type="search"
          placeholder="Search templates..."
          className="w-full min-h-[48px] px-4 rounded-lg border border-gray-300"
        />
      </div>

      {/* Categories */}
      {categories.map(category => (
        <div key={category}>
          <h3 className="font-semibold text-gray-900 mb-3">{category}</h3>
          <div className="space-y-3">
            {templates
              .filter(t => t.category === category)
              .map(template => (
                <MobileCard key={template.id} pressable>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{template.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{template.name}</p>
                        {template.aiRequired && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                            AI
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[template.difficulty]}`}>
                          {template.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{template.description}</p>
                      <TouchButton size="sm" variant="primary" className="mt-2">
                        Use Template
                      </TouchButton>
                    </div>
                  </div>
                </MobileCard>
              ))}
          </div>
        </div>
      ))}

      {/* Custom Template */}
      <MobileCard>
        <div className="text-center py-4">
          <span className="text-3xl mb-2 block">✨</span>
          <h4 className="font-medium text-gray-900 mb-1">Create Custom Workflow</h4>
          <p className="text-sm text-gray-500 mb-3">Build your own automation from scratch</p>
          <TouchButton variant="secondary">
            Start Building
          </TouchButton>
        </div>
      </MobileCard>
    </div>
  );
}
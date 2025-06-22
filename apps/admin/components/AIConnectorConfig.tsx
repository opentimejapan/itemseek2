'use client';

import React, { useState } from 'react';
import { MobileCard, TouchButton, TouchInput, BottomSheet, MobileModal } from '@itemseek2/ui-mobile';

interface AIProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'google' | 'custom';
  model: string;
  status: 'active' | 'inactive';
  usage: number;
  limit: number;
}

export function AIConnectorConfig() {
  const [providers, setProviders] = useState<AIProvider[]>([
    {
      id: '1',
      name: 'OpenAI GPT-4',
      type: 'openai',
      model: 'gpt-4-turbo-preview',
      status: 'active',
      usage: 2500,
      limit: 10000
    },
    {
      id: '2',
      name: 'Claude 3',
      type: 'anthropic',
      model: 'claude-3-opus',
      status: 'inactive',
      usage: 0,
      limit: 5000
    }
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const providerIcons = {
    openai: '🧠',
    anthropic: '🤖',
    google: '🔍',
    custom: '⚙️'
  };

  const toggleProvider = (id: string) => {
    setProviders(providers.map(p => 
      p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
    ));
  };

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <MobileCard>
        <h3 className="font-semibold text-gray-900 mb-2">AI Usage Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Requests</p>
            <p className="text-xl font-bold">2,500</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Providers</p>
            <p className="text-xl font-bold">{providers.filter(p => p.status === 'active').length}</p>
          </div>
        </div>
      </MobileCard>

      {/* Add Provider Button */}
      <TouchButton fullWidth variant="primary" onClick={() => setIsAddOpen(true)}>
        + Add AI Provider
      </TouchButton>

      {/* Providers List */}
      <div className="space-y-3">
        {providers.map((provider) => (
          <MobileCard key={provider.id}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{providerIcons[provider.type]}</span>
                  <div>
                    <p className="font-medium text-gray-900">{provider.name}</p>
                    <p className="text-sm text-gray-500">{provider.model}</p>
                  </div>
                </div>
                <TouchButton
                  size="sm"
                  variant={provider.status === 'active' ? 'primary' : 'secondary'}
                  onClick={() => toggleProvider(provider.id)}
                >
                  {provider.status === 'active' ? 'Active' : 'Inactive'}
                </TouchButton>
              </div>

              {/* Usage Bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Usage</span>
                  <span className="text-gray-700">{provider.usage.toLocaleString()} / {provider.limit.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(provider.usage / provider.limit) * 100}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <TouchButton size="sm" variant="secondary" fullWidth onClick={() => {
                  setSelectedProvider(provider);
                  setIsTestModalOpen(true);
                }}>
                  Test
                </TouchButton>
                <TouchButton size="sm" variant="secondary" fullWidth>
                  Configure
                </TouchButton>
                <TouchButton size="sm" variant="danger" fullWidth>
                  Remove
                </TouchButton>
              </div>
            </div>
          </MobileCard>
        ))}
      </div>

      {/* Add Provider Sheet */}
      <BottomSheet
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add AI Provider"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Provider Type</label>
            <select className="w-full min-h-[48px] px-4 rounded-lg border border-gray-300">
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google AI</option>
              <option value="custom">Custom API</option>
            </select>
          </div>
          <TouchInput label="Provider Name" placeholder="e.g., Production GPT-4" />
          <TouchInput label="API Key" type="password" placeholder="sk-..." />
          <TouchInput label="Model" placeholder="e.g., gpt-4-turbo-preview" />
          <TouchInput label="Monthly Limit" type="number" placeholder="10000" />
          <TouchButton fullWidth variant="primary">
            Add Provider
          </TouchButton>
        </div>
      </BottomSheet>

      {/* Test Modal */}
      <MobileModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        title="Test AI Provider"
        actions={[
          { label: 'Close', onClick: () => setIsTestModalOpen(false), variant: 'secondary' }
        ]}
      >
        {selectedProvider && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Testing connection to {selectedProvider.name}...
            </p>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm font-mono text-gray-700">
                ✅ Connection successful<br />
                ✅ Authentication verified<br />
                ✅ Model available<br />
                ⏱️ Response time: 245ms
              </p>
            </div>
          </div>
        )}
      </MobileModal>
    </div>
  );
}
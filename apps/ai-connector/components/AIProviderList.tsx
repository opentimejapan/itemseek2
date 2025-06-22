'use client';

import React, { useState } from 'react';
import { MobileCard, TouchButton, TouchInput, BottomSheet } from '@itemseek2/ui-mobile';
import type { AIProvider } from '@itemseek2/shared';

export function AIProviderList() {
  const [providers, setProviders] = useState<AIProvider[]>([
    {
      id: '1',
      name: 'OpenAI GPT-4',
      type: 'openai',
      apiKey: 'sk-...xxx',
      model: 'gpt-4-turbo-preview',
      isActive: true
    },
    {
      id: '2',
      name: 'Claude 3 Opus',
      type: 'anthropic',
      apiKey: 'sk-...yyy',
      model: 'claude-3-opus',
      isActive: false
    }
  ]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<AIProvider | null>(null);

  const providerLogos = {
    openai: '🧠',
    anthropic: '🤖',
    google: '🔍',
    custom: '⚙️'
  };

  const toggleProvider = (id: string) => {
    setProviders(providers.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <MobileCard padding="sm">
          <p className="text-sm text-gray-500">Active Providers</p>
          <p className="text-2xl font-bold">{providers.filter(p => p.isActive).length}</p>
        </MobileCard>
        <MobileCard padding="sm">
          <p className="text-sm text-gray-500">API Calls Today</p>
          <p className="text-2xl font-bold">342</p>
        </MobileCard>
      </div>

      {/* Add Provider */}
      <TouchButton fullWidth variant="primary" onClick={() => setIsAddOpen(true)}>
        + Add AI Provider
      </TouchButton>

      {/* Provider List */}
      <div className="space-y-3">
        {providers.map((provider) => (
          <MobileCard key={provider.id}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{providerLogos[provider.type]}</span>
                  <div>
                    <p className="font-medium text-gray-900">{provider.name}</p>
                    <p className="text-sm text-gray-500">{provider.model}</p>
                    <p className="text-xs text-gray-400">
                      API Key: {provider.apiKey.substring(0, 7)}...
                    </p>
                  </div>
                </div>
                <TouchButton
                  size="sm"
                  variant={provider.isActive ? 'primary' : 'secondary'}
                  onClick={() => toggleProvider(provider.id)}
                >
                  {provider.isActive ? 'Active' : 'Inactive'}
                </TouchButton>
              </div>

              <div className="flex gap-2">
                <TouchButton 
                  size="sm" 
                  variant="secondary" 
                  fullWidth
                  onClick={() => setEditingProvider(provider)}
                >
                  Edit
                </TouchButton>
                <TouchButton size="sm" variant="secondary" fullWidth>
                  Test
                </TouchButton>
                <TouchButton size="sm" variant="danger" fullWidth>
                  Remove
                </TouchButton>
              </div>
            </div>
          </MobileCard>
        ))}
      </div>

      {/* Usage Limits */}
      <MobileCard>
        <h3 className="font-semibold text-gray-900 mb-3">Usage & Limits</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>OpenAI</span>
              <span>$42.50 / $100.00</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42.5%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Anthropic</span>
              <span>$12.00 / $50.00</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '24%' }} />
            </div>
          </div>
        </div>
      </MobileCard>

      {/* Add/Edit Provider Sheet */}
      <BottomSheet
        isOpen={isAddOpen || !!editingProvider}
        onClose={() => {
          setIsAddOpen(false);
          setEditingProvider(null);
        }}
        title={editingProvider ? 'Edit Provider' : 'Add AI Provider'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider Type
            </label>
            <select 
              className="w-full min-h-[48px] px-4 rounded-lg border border-gray-300"
              defaultValue={editingProvider?.type || 'openai'}
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google AI</option>
              <option value="custom">Custom API</option>
            </select>
          </div>
          <TouchInput 
            label="Provider Name" 
            placeholder="e.g., Production GPT-4"
            defaultValue={editingProvider?.name}
          />
          <TouchInput 
            label="API Key" 
            type="password" 
            placeholder="sk-..."
            defaultValue={editingProvider?.apiKey}
          />
          <TouchInput 
            label="Model" 
            placeholder="e.g., gpt-4-turbo-preview"
            defaultValue={editingProvider?.model}
          />
          <TouchInput 
            label="Endpoint (optional)" 
            placeholder="https://api.openai.com/v1"
            defaultValue={editingProvider?.endpoint}
          />
          <TouchButton fullWidth variant="primary">
            {editingProvider ? 'Save Changes' : 'Add Provider'}
          </TouchButton>
        </div>
      </BottomSheet>
    </div>
  );
}
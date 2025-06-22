'use client';

import React, { useState } from 'react';
import { MobileCard, TouchButton, TouchInput } from '@itemseek2/ui-mobile';

export function OrganizationSettings() {
  const [settings, setSettings] = useState({
    name: 'Acme Corporation',
    industry: 'hospitality',
    plan: 'professional',
    timezone: 'America/New_York',
    currency: 'USD',
    lowStockThreshold: 20,
    autoReorderEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  });

  const plans = [
    { id: 'free', name: 'Free', price: '$0', features: ['Up to 100 items', '1 user', 'Basic reports'] },
    { id: 'starter', name: 'Starter', price: '$29', features: ['Up to 1,000 items', '5 users', 'Advanced reports', 'API access'] },
    { id: 'professional', name: 'Professional', price: '$99', features: ['Unlimited items', '25 users', 'AI features', 'Priority support'] },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', features: ['Everything in Pro', 'Unlimited users', 'Custom integrations', 'SLA'] }
  ];

  return (
    <div className="space-y-6">
      {/* Organization Info */}
      <MobileCard>
        <h3 className="font-semibold text-gray-900 mb-4">Organization Information</h3>
        <div className="space-y-3">
          <TouchInput
            label="Organization Name"
            value={settings.name}
            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select 
              className="w-full min-h-[48px] px-4 rounded-lg border border-gray-300"
              value={settings.industry}
              onChange={(e) => setSettings({ ...settings, industry: e.target.value })}
            >
              <option value="hospitality">Hospitality</option>
              <option value="healthcare">Healthcare</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>
        </div>
      </MobileCard>

      {/* Subscription Plan */}
      <MobileCard>
        <h3 className="font-semibold text-gray-900 mb-4">Subscription Plan</h3>
        <div className="space-y-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-3 rounded-lg border-2 ${
                settings.plan === plan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">{plan.name}</p>
                  <p className="text-sm text-gray-500">{plan.price}/month</p>
                </div>
                {settings.plan === plan.id && (
                  <span className="text-sm font-medium text-blue-600">Current</span>
                )}
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                {plan.features.map((feature, i) => (
                  <li key={i}>• {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </MobileCard>

      {/* Inventory Settings */}
      <MobileCard>
        <h3 className="font-semibold text-gray-900 mb-4">Inventory Settings</h3>
        <div className="space-y-4">
          <TouchInput
            label="Low Stock Threshold (%)"
            type="number"
            value={settings.lowStockThreshold.toString()}
            onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) })}
          />
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Auto-reorder</span>
            <button
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.autoReorderEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              onClick={() => setSettings({ ...settings, autoReorderEnabled: !settings.autoReorderEnabled })}
            >
              <span
                className={`block w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                  settings.autoReorderEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </MobileCard>

      {/* Notifications */}
      <MobileCard>
        <h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications' },
            { key: 'smsNotifications', label: 'SMS Notifications' },
            { key: 'pushNotifications', label: 'Push Notifications' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-700">{label}</span>
              <button
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings[key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onClick={() => setSettings({ ...settings, [key]: !settings[key as keyof typeof settings] })}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    settings[key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </MobileCard>

      {/* Save Button */}
      <TouchButton fullWidth variant="primary">
        Save Changes
      </TouchButton>
    </div>
  );
}
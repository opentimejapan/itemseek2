export interface Organization {
  id: string;
  name: string;
  slug: string;
  industry: Industry;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  settings: OrganizationSettings;
  features: string[];
  logo?: string;
  timezone: string;
  currency: string;
  locale: string;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type Industry = 
  | 'hospitality'
  | 'healthcare'
  | 'retail'
  | 'manufacturing'
  | 'education'
  | 'restaurant'
  | 'logistics'
  | 'other';

export interface OrganizationSettings {
  inventory: {
    lowStockThreshold: number;
    autoReorderEnabled: boolean;
    barcodeFormat: string;
    enableExpiryTracking: boolean;
    enableBatchTracking: boolean;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    lowStockAlerts: boolean;
    orderUpdates: boolean;
  };
  integrations: {
    ai: {
      enabled: boolean;
      providers: AIProvider[];
    };
  };
  customFields: CustomField[];
}

export interface AIProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'google' | 'custom';
  apiKey: string;
  endpoint?: string;
  model?: string;
  isActive: boolean;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  required: boolean;
  options?: string[];
  defaultValue?: any;
}
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  permissions: Permission[];
  avatar?: string;
  phoneNumber?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'system_admin' | 'org_admin' | 'manager' | 'user' | 'viewer';

export interface Permission {
  resource: string;
  actions: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

import type { Organization } from './organization';

export interface Session {
  user: User;
  organization: Organization;
  permissions: Permission[];
  expiresAt: Date;
}
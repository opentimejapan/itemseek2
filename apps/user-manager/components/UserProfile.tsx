'use client';

import React, { useState } from 'react';
import { MobileCard, TouchButton, TouchInput, BottomSheet, MobileModal } from '@itemseek2/ui-mobile';
import { validatePasswordStrength } from '@itemseek2/shared';
import type { User, UserRole } from '@itemseek2/shared';

interface UserProfileProps {
  userId: string;
  onBack?: () => void;
}

export function UserProfile({ userId, onBack }: UserProfileProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isManagingPermissions, setIsManagingPermissions] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Mock user data
  const user: User = {
    id: userId,
    email: 'john.doe@company.com',
    name: 'John Doe',
    role: 'manager',
    organizationId: '1',
    permissions: [],
    phoneNumber: '+1 234 567 8900',
    isActive: true,
    lastLoginAt: new Date(Date.now() - 3600000),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  };

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const passwordStrength = validatePasswordStrength(passwordForm.new);

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <MobileCard>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl font-medium text-gray-600">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                {user.role.replace('_', ' ')}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
        <TouchButton 
          fullWidth 
          variant="primary" 
          className="mt-4"
          onClick={() => setIsEditingProfile(true)}
        >
          Edit Profile
        </TouchButton>
      </MobileCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <TouchButton 
          variant="secondary"
          onClick={() => setIsChangingPassword(true)}
        >
          🔐 Change Password
        </TouchButton>
        <TouchButton 
          variant="secondary"
          onClick={() => setIsManagingPermissions(true)}
        >
          🔑 Permissions
        </TouchButton>
      </div>

      {/* User Information */}
      <MobileCard>
        <h3 className="font-semibold text-gray-900 mb-3">User Information</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="text-gray-900">{user.phoneNumber || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="text-gray-900">{user.createdAt.toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Login</p>
            <p className="text-gray-900">
              {user.lastLoginAt?.toLocaleString() || 'Never'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Organization ID</p>
            <p className="text-gray-900">{user.organizationId}</p>
          </div>
        </div>
      </MobileCard>

      {/* Activity Summary */}
      <MobileCard>
        <h3 className="font-semibold text-gray-900 mb-3">Activity Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">142</p>
            <p className="text-xs text-gray-500">Actions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">28</p>
            <p className="text-xs text-gray-500">This Week</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">98%</p>
            <p className="text-xs text-gray-500">Success Rate</p>
          </div>
        </div>
      </MobileCard>

      {/* Danger Zone */}
      {userId !== 'current' && (
        <MobileCard>
          <h3 className="font-semibold text-red-600 mb-3">Danger Zone</h3>
          <TouchButton 
            fullWidth 
            variant="danger"
            onClick={() => setShowDeactivateModal(true)}
          >
            Deactivate User
          </TouchButton>
        </MobileCard>
      )}

      {/* Edit Profile Sheet */}
      <BottomSheet
        isOpen={isEditingProfile}
        onClose={() => setIsEditingProfile(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <TouchInput label="Name" defaultValue={user.name} />
          <TouchInput label="Email" type="email" defaultValue={user.email} />
          <TouchInput label="Phone Number" defaultValue={user.phoneNumber} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select 
              className="w-full min-h-[48px] px-4 rounded-lg border border-gray-300"
              defaultValue={user.role}
            >
              <option value="org_admin">Organization Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <TouchButton fullWidth variant="primary">
            Save Changes
          </TouchButton>
        </div>
      </BottomSheet>

      {/* Change Password Sheet */}
      <BottomSheet
        isOpen={isChangingPassword}
        onClose={() => setIsChangingPassword(false)}
        title="Change Password"
      >
        <div className="space-y-4">
          <TouchInput 
            label="Current Password" 
            type="password"
            value={passwordForm.current}
            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
          />
          <TouchInput 
            label="New Password" 
            type="password"
            value={passwordForm.new}
            onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
          />
          {passwordForm.new && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Password Strength</span>
                <span className={
                  passwordStrength.score > 0.7 ? 'text-green-600' :
                  passwordStrength.score > 0.4 ? 'text-yellow-600' : 'text-red-600'
                }>
                  {passwordStrength.score > 0.7 ? 'Strong' :
                   passwordStrength.score > 0.4 ? 'Medium' : 'Weak'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    passwordStrength.score > 0.7 ? 'bg-green-500' :
                    passwordStrength.score > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${passwordStrength.score * 100}%` }}
                />
              </div>
              {passwordStrength.feedback.length > 0 && (
                <ul className="text-xs text-gray-500 space-y-1">
                  {passwordStrength.feedback.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <TouchInput 
            label="Confirm New Password" 
            type="password"
            value={passwordForm.confirm}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
            error={passwordForm.confirm && passwordForm.new !== passwordForm.confirm ? 'Passwords do not match' : undefined}
          />
          <TouchButton 
            fullWidth 
            variant="primary"
            disabled={!passwordForm.current || !passwordForm.new || passwordForm.new !== passwordForm.confirm}
          >
            Update Password
          </TouchButton>
        </div>
      </BottomSheet>

      {/* Permissions Sheet */}
      <BottomSheet
        isOpen={isManagingPermissions}
        onClose={() => setIsManagingPermissions(false)}
        title="Manage Permissions"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Permissions are determined by the user's role. Custom permissions can be added on top of role-based permissions.
          </p>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Role Permissions</h4>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">View inventory</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Edit inventory</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Create reports</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Manage team members</span>
              </div>
            </div>
          </div>

          <TouchButton fullWidth variant="secondary">
            + Add Custom Permission
          </TouchButton>
        </div>
      </BottomSheet>

      {/* Deactivate Modal */}
      <MobileModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        title="Deactivate User?"
        actions={[
          { label: 'Cancel', onClick: () => setShowDeactivateModal(false), variant: 'secondary' },
          { label: 'Deactivate', onClick: () => {}, variant: 'danger' }
        ]}
      >
        <p className="text-gray-600">
          Are you sure you want to deactivate {user.name}? They will no longer be able to access the system.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          This action can be reversed by reactivating the user.
        </p>
      </MobileModal>
    </div>
  );
}
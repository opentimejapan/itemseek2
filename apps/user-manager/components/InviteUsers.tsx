'use client';

import React, { useState } from 'react';
import { MobileCard, TouchButton, TouchInput, BottomSheet } from '@itemseek2/ui-mobile';
import { isValidEmail } from '@itemseek2/shared';
import type { UserRole } from '@itemseek2/shared';

interface Invite {
  id: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  invitedAt: Date;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: Date;
}

export function InviteUsers() {
  const [isInviting, setIsInviting] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    emails: '',
    role: 'user' as UserRole,
    message: ''
  });

  const invites: Invite[] = [
    {
      id: '1',
      email: 'sarah.jones@example.com',
      role: 'manager',
      invitedBy: 'John Doe',
      invitedAt: new Date(Date.now() - 86400000),
      status: 'pending',
      expiresAt: new Date(Date.now() + 6 * 86400000)
    },
    {
      id: '2',
      email: 'mike.smith@example.com',
      role: 'user',
      invitedBy: 'Jane Smith',
      invitedAt: new Date(Date.now() - 172800000),
      status: 'accepted',
      expiresAt: new Date(Date.now() + 5 * 86400000)
    },
    {
      id: '3',
      email: 'alex.brown@example.com',
      role: 'viewer',
      invitedBy: 'John Doe',
      invitedAt: new Date(Date.now() - 7 * 86400000),
      status: 'expired',
      expiresAt: new Date(Date.now() - 86400000)
    }
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    expired: 'bg-gray-100 text-gray-700'
  };

  const getDaysRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const days = Math.ceil(diff / 86400000);
    return days;
  };

  const validateEmails = (emailString: string): { valid: string[], invalid: string[] } => {
    const emails = emailString.split(/[,\n]/).map(e => e.trim()).filter(e => e);
    const valid: string[] = [];
    const invalid: string[] = [];
    
    emails.forEach(email => {
      if (isValidEmail(email)) {
        valid.push(email);
      } else {
        invalid.push(email);
      }
    });
    
    return { valid, invalid };
  };

  const emailValidation = validateEmails(inviteForm.emails);

  return (
    <div className="space-y-4">
      {/* Invite Stats */}
      <div className="grid grid-cols-3 gap-3">
        <MobileCard padding="sm">
          <p className="text-xs text-gray-500">Pending</p>
          <p className="text-xl font-bold text-yellow-600">
            {invites.filter(i => i.status === 'pending').length}
          </p>
        </MobileCard>
        <MobileCard padding="sm">
          <p className="text-xs text-gray-500">Accepted</p>
          <p className="text-xl font-bold text-green-600">
            {invites.filter(i => i.status === 'accepted').length}
          </p>
        </MobileCard>
        <MobileCard padding="sm">
          <p className="text-xs text-gray-500">Expired</p>
          <p className="text-xl font-bold text-gray-600">
            {invites.filter(i => i.status === 'expired').length}
          </p>
        </MobileCard>
      </div>

      {/* Send Invites Button */}
      <TouchButton 
        fullWidth 
        variant="primary"
        onClick={() => setIsInviting(true)}
      >
        + Send Invites
      </TouchButton>

      {/* Invites List */}
      <div className="space-y-3">
        {invites.map((invite) => (
          <MobileCard key={invite.id}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">{invite.email}</p>
                <p className="text-sm text-gray-500">
                  Invited by {invite.invitedBy} • {invite.invitedAt.toLocaleDateString()}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[invite.status]}`}>
                {invite.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {invite.role.replace('_', ' ')}
              </span>
              {invite.status === 'pending' && (
                <p className="text-xs text-gray-500">
                  Expires in {getDaysRemaining(invite.expiresAt)} days
                </p>
              )}
            </div>

            {invite.status === 'pending' && (
              <div className="flex gap-2 mt-3">
                <TouchButton size="sm" variant="secondary" fullWidth>
                  Resend
                </TouchButton>
                <TouchButton size="sm" variant="danger" fullWidth>
                  Cancel
                </TouchButton>
              </div>
            )}
          </MobileCard>
        ))}
      </div>

      {/* Send Invites Sheet */}
      <BottomSheet
        isOpen={isInviting}
        onClose={() => setIsInviting(false)}
        title="Send Invites"
        initialSnap={1}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Addresses
            </label>
            <textarea
              className="w-full min-h-[120px] px-4 py-3 rounded-lg border border-gray-300"
              placeholder="Enter email addresses separated by commas or new lines..."
              value={inviteForm.emails}
              onChange={(e) => setInviteForm({ ...inviteForm, emails: e.target.value })}
            />
            {inviteForm.emails && (
              <div className="mt-2 space-y-1">
                {emailValidation.valid.length > 0 && (
                  <p className="text-xs text-green-600">
                    ✓ {emailValidation.valid.length} valid email{emailValidation.valid.length > 1 ? 's' : ''}
                  </p>
                )}
                {emailValidation.invalid.length > 0 && (
                  <p className="text-xs text-red-600">
                    ✗ {emailValidation.invalid.length} invalid: {emailValidation.invalid.join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Role
            </label>
            <select 
              className="w-full min-h-[48px] px-4 rounded-lg border border-gray-300"
              value={inviteForm.role}
              onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as UserRole })}
            >
              <option value="viewer">Viewer</option>
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="org_admin">Organization Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personal Message (optional)
            </label>
            <textarea
              className="w-full min-h-[80px] px-4 py-3 rounded-lg border border-gray-300"
              placeholder="Add a personal message to the invitation..."
              value={inviteForm.message}
              onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Invites expire after 7 days. Users will receive an email with instructions to join.
            </p>
          </div>

          <TouchButton 
            fullWidth 
            variant="primary"
            disabled={emailValidation.valid.length === 0}
          >
            Send {emailValidation.valid.length} Invite{emailValidation.valid.length !== 1 ? 's' : ''}
          </TouchButton>
        </div>
      </BottomSheet>
    </div>
  );
}
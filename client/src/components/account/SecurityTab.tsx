'use client';
import React, { useState } from 'react';
import {
  Card,
  CardTitle,
  Label,
  Input,
  Button,
  ButtonRow,
  SuccessMessage,
  ErrorMessage
} from '@/components/ui/PageStyles';
import { isPasswordValid, PASSWORD_RULES } from '@derecksnotes/shared';
import { PasswordStrength } from './PasswordStrength';
import { SessionList } from './SessionList';

export function SecurityTab({
  changePassword,
  deleteAccount,
  logout
}: {
  changePassword: (current: string, newPass: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  logout: () => Promise<void>;
}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChangePassword = async () => {
    setSaving(true);
    setSuccess(null);
    setError(null);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setSuccess('Password changed. All other sessions revoked.');
    } catch (err: any) {
      setError(err.data?.error || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        'Are you sure you want to delete your account? This cannot be undone.'
      )
    )
      return;
    if (!confirm('Really delete your account?')) return;
    try {
      await deleteAccount();
    } catch {
      setError('Failed to delete account');
    }
  };

  return (
    <>
      <Card>
        <CardTitle>Change Password</CardTitle>
        <Label>Current Password</Label>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Label>New Password</Label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder={`Min ${PASSWORD_RULES.minLength} chars, 1 upper, 1 lower, 1 number`}
        />
        {newPassword && <PasswordStrength password={newPassword} />}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonRow>
          <Button
            onClick={handleChangePassword}
            disabled={
              saving ||
              !currentPassword ||
              !newPassword ||
              !isPasswordValid(newPassword)
            }
          >
            {saving ? 'Changing...' : 'Change Password'}
          </Button>
        </ButtonRow>
      </Card>

      <Card>
        <CardTitle>Sessions</CardTitle>
        <SessionList />
      </Card>

      <Card>
        <CardTitle>Danger Zone</CardTitle>
        <ButtonRow>
          <Button $variant="secondary" onClick={logout}>
            Log Out Everywhere
          </Button>
          <Button $variant="danger" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </ButtonRow>
      </Card>
    </>
  );
}

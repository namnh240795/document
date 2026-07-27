import { useState } from 'react';
import { useChangePassword } from '@api/hooks/useAuth';
import { Button } from '@ui/components/ui/Button';
import { Input } from '@ui/components/ui/Input';
import { Card } from '@ui/components/ui/Card';
import { PageLayout } from '@ui/components/layout/PageLayout';

export function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const changePasswordMutation = useChangePassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to change password');
    }
  };

  return (
    <PageLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <form data-testid="change-password-form" onSubmit={handleSubmit} className="space-y-4">
            <Input
              data-testid="settings-current-password-input"
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
            />
            <Input
              data-testid="settings-new-password-input"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 8 characters)"
              minLength={8}
              required
            />
            <Input
              data-testid="settings-confirm-password-input"
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
            {error && <p data-testid="settings-error-message" className="text-sm text-red-500">{error}</p>}
            {success && <p data-testid="settings-success-message" className="text-sm text-green-500">Password changed successfully!</p>}
            <Button data-testid="settings-change-password-button" type="submit" isLoading={changePasswordMutation.isPending}>
              Change Password
            </Button>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
}

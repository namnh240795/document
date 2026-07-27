import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '@api/client';
import { Button } from '@ui/components/ui/Button';
import { Input } from '@ui/components/ui/Input';
import { Card } from '@ui/components/ui/Card';
import { PageLayout } from '@ui/components/layout/PageLayout';

export function ForgotPasswordPhonePage() {
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.post('/auth/forgot-password-phone', { phone });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Reset Password via Phone">
      <div className="max-w-md mx-auto">
        <Card>
          {success ? (
            <div data-testid="forgot-password-phone-success-message" className="text-center space-y-4">
              <p className="text-green-600">
                If an account exists with that phone number, an OTP has been sent.
              </p>
              <Link data-testid="forgot-password-phone-enter-otp-link" to="/verify-phone" className="text-blue-600 hover:underline">
                Enter OTP
              </Link>
            </div>
          ) : (
            <form data-testid="forgot-password-phone-form" onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter your phone number and we'll send you an OTP to reset your password.
              </p>
              <Input
                data-testid="forgot-password-phone-input"
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
              {error && <p data-testid="forgot-password-phone-error-message" className="text-sm text-red-500">{error}</p>}
              <Button data-testid="forgot-password-phone-submit-button" type="submit" isLoading={loading} className="w-full">
                Send OTP
              </Button>
            </form>
          )}
          <div className="mt-4 text-sm text-center">
            <Link data-testid="forgot-password-phone-email-link" to="/forgot-password" className="text-blue-600 hover:underline">
              Reset via email instead
            </Link>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}

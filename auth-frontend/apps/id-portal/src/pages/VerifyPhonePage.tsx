import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '@api/client';
import { Button } from '@ui/components/ui/Button';
import { Input } from '@ui/components/ui/Input';
import { Card } from '@ui/components/ui/Card';
import { PageLayout } from '@ui/components/layout/PageLayout';

export function VerifyPhonePage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.post('/auth/verify-phone', { phone, code });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Verify Phone">
      <div className="max-w-md mx-auto">
        <Card>
          {success ? (
            <div data-testid="verify-phone-success-message" className="text-center space-y-4">
              <p className="text-green-600">Phone verified successfully!</p>
              <Link data-testid="verify-phone-login-link" to="/login" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </div>
          ) : (
            <form data-testid="verify-phone-form" onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter the 6-digit code sent to your phone number.
              </p>
              <Input
                data-testid="verify-phone-number-input"
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
              <Input
                data-testid="verify-phone-code-input"
                label="Verification Code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
              />
              {error && <p data-testid="verify-phone-error-message" className="text-sm text-red-500">{error}</p>}
              <Button data-testid="verify-phone-submit-button" type="submit" isLoading={loading} className="w-full">
                Verify Phone
              </Button>
            </form>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}

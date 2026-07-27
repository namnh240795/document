import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '@api/hooks/useAuth';
import { Button } from '@ui/components/ui/Button';
import { Input } from '@ui/components/ui/Input';
import { Card } from '@ui/components/ui/Card';
import { PageLayout } from '@ui/components/layout/PageLayout';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await forgotPasswordMutation.mutateAsync({ email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to send reset email');
    }
  };

  return (
    <PageLayout title="Reset Password">
      <div className="max-w-md mx-auto">
        <Card>
          {success ? (
            <div data-testid="forgot-password-success-message" className="text-center space-y-4">
              <p className="text-green-600">
                If an account exists with that email, a password reset link has been sent.
              </p>
              <Link data-testid="forgot-password-back-to-login-link" to="/login" className="text-blue-600 hover:underline">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form data-testid="forgot-password-form" onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <Input
                data-testid="forgot-password-email-input"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              {error && <p data-testid="forgot-password-error-message" className="text-sm text-red-500">{error}</p>}
              <Button data-testid="forgot-password-submit-button" type="submit" isLoading={forgotPasswordMutation.isPending} className="w-full">
                Send Reset Link
              </Button>
            </form>
          )}
          <div className="mt-4 text-sm text-center">
            <Link data-testid="forgot-password-phone-link" to="/forgot-password-phone" className="text-blue-600 hover:underline">
              Reset via phone instead
            </Link>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}

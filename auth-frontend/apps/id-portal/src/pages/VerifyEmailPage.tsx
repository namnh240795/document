import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiClient } from '@api/client';
import { Card } from '@ui/components/ui/Card';
import { PageLayout } from '@ui/components/layout/PageLayout';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    apiClient
      .get(`/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus('success');
        setMessage('Email verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.error?.message || 'Verification failed');
      });
  }, [searchParams]);

  return (
    <PageLayout title="Verify Email">
      <div className="max-w-md mx-auto">
        <Card>
          {status === 'loading' && (
            <div data-testid="verify-email-loading" className="text-center">
              <p>Verifying your email...</p>
            </div>
          )}
          {status === 'success' && (
            <div data-testid="verify-email-success-message" className="text-center space-y-4">
              <p className="text-green-600">{message}</p>
              <Link data-testid="verify-email-login-link" to="/login" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </div>
          )}
          {status === 'error' && (
            <div data-testid="verify-email-error-message" className="text-center space-y-4">
              <p className="text-red-600">{message}</p>
              <Link data-testid="verify-email-back-to-login-link" to="/login" className="text-blue-600 hover:underline">
                Back to Sign In
              </Link>
            </div>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}

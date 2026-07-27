import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '@api/hooks/useAuth';
import { useAuth } from '@auth/auth';
import { Button } from '@ui/components/ui/Button';
import { Input } from '@ui/components/ui/Input';
import { Card } from '@ui/components/ui/Card';
import { PageLayout } from '@ui/components/layout/PageLayout';

export function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await loginMutation.mutateAsync({ identifier, password });
      authLogin(response.data.accessToken, response.data.refreshToken, response.data.user);
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Login failed');
    }
  };

  return (
    <PageLayout title="Sign In">
      <div className="max-w-md mx-auto">
        <Card>
          <form data-testid="login-form" onSubmit={handleSubmit} className="space-y-4">
            <Input
              data-testid="login-identifier-input"
              label="Email or Phone"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or phone"
              required
            />
            <Input
              data-testid="login-password-input"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            {error && <p data-testid="login-error-message" className="text-sm text-red-500">{error}</p>}
            <Button data-testid="login-submit-button" type="submit" isLoading={loginMutation.isPending} className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-4 space-y-2 text-sm text-center">
            <Link data-testid="login-forgot-password-link" to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
            <p>
              Don't have an account?{' '}
              <Link data-testid="login-register-link" to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}

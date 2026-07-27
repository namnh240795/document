import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '@api/hooks/useAuth';
import { Button } from '@ui/components/ui/Button';
import { Input } from '@ui/components/ui/Input';
import { Card } from '@ui/components/ui/Card';
import { PageLayout } from '@ui/components/layout/PageLayout';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await registerMutation.mutateAsync({ name, email, phone, password });
      navigate('/verify-email');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed');
    }
  };

  return (
    <PageLayout title="Create Account">
      <div className="max-w-md mx-auto">
        <Card>
          <form data-testid="register-form" onSubmit={handleSubmit} className="space-y-4">
            <Input
              data-testid="register-name-input"
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
            <Input
              data-testid="register-email-input"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <Input
              data-testid="register-phone-input"
              label="Phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
            <Input
              data-testid="register-password-input"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min 8 characters)"
              minLength={8}
              required
            />
            {error && <p data-testid="register-error-message" className="text-sm text-red-500">{error}</p>}
            <Button data-testid="register-submit-button" type="submit" isLoading={registerMutation.isPending} className="w-full">
              Create Account
            </Button>
          </form>
          <div className="mt-4 text-sm text-center">
            Already have an account?{' '}
            <Link data-testid="register-login-link" to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}

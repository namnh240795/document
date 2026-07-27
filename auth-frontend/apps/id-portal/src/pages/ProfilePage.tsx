import { useAuth } from '@auth/auth';
import { Card } from '@ui/components/ui/Card';
import { PageLayout } from '@ui/components/layout/PageLayout';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <PageLayout title="Profile">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div data-testid="profile-info" className="space-y-3">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p data-testid="profile-name" className="font-medium">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p data-testid="profile-email" className="font-medium">
                {user?.email || 'Not provided'}
                {user?.emailVerified && (
                  <span data-testid="profile-email-verified" className="ml-2 text-green-600 text-sm">(Verified)</span>
                )}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p data-testid="profile-phone" className="font-medium">
                {user?.phone || 'Not provided'}
                {user?.phoneVerified && (
                  <span data-testid="profile-phone-verified" className="ml-2 text-green-600 text-sm">(Verified)</span>
                )}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <p data-testid="profile-status" className="font-medium capitalize">{user?.status}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Member Since</label>
              <p data-testid="profile-created-at" className="font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}

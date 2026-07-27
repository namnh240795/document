import { useParams, Link } from 'react-router-dom';
import { useUser, useUpdateUser, useAssignRole } from '@api/hooks/useUsers';
import { useRoles } from '@api/hooks/useRoles';
import { Button } from '@ui/components/ui/Button';
import { Card } from '@ui/components/ui/Card';
import { PageLayout } from '@ui/components/layout/PageLayout';

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: userData, isLoading } = useUser(id || '');
  const { data: rolesData } = useRoles();
  const updateUserMutation = useUpdateUser();
  const assignRoleMutation = useAssignRole();

  const handleStatusChange = async (status: string) => {
    if (id) {
      await updateUserMutation.mutateAsync({ id, data: { status } });
    }
  };

  const handleAssignRole = async (roleId: string) => {
    if (id) {
      await assignRoleMutation.mutateAsync({ userId: id, roleId });
    }
  };

  if (isLoading) {
    return (
      <PageLayout title="User Detail">
        <p data-testid="user-detail-loading">Loading...</p>
      </PageLayout>
    );
  }

  const user = userData?.data;

  return (
    <PageLayout title="User Detail">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link data-testid="user-detail-back-link" to="/users" className="text-blue-600 hover:underline">
          &larr; Back to Users
        </Link>

        <Card>
          <h2 className="text-lg font-semibold mb-4">User Information</h2>
          <div data-testid="user-detail-info" className="space-y-3">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p data-testid="user-detail-name" className="font-medium">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p data-testid="user-detail-email" className="font-medium">
                {user?.email || 'Not provided'}
                {user?.emailVerified && (
                  <span data-testid="user-detail-email-verified" className="ml-2 text-green-600 text-sm">(Verified)</span>
                )}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p data-testid="user-detail-phone" className="font-medium">
                {user?.phone || 'Not provided'}
                {user?.phoneVerified && (
                  <span data-testid="user-detail-phone-verified" className="ml-2 text-green-600 text-sm">(Verified)</span>
                )}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <div data-testid="user-detail-status-buttons" className="flex space-x-2 mt-1">
                {['active', 'inactive', 'banned'].map((status) => (
                  <Button
                    key={status}
                    data-testid={`user-detail-status-${status}-button`}
                    variant={user?.status === status ? 'primary' : 'secondary'}
                    onClick={() => handleStatusChange(status)}
                    isLoading={updateUserMutation.isPending}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Assign Role</h2>
          <div data-testid="user-detail-roles" className="space-y-2">
            {rolesData?.data?.map((role: any) => (
              <div key={role.id} className="flex justify-between items-center p-2 border rounded">
                <span data-testid={`user-detail-role-name-${role.id}`}>{role.name}</span>
                <Button
                  data-testid={`user-detail-assign-role-${role.id}-button`}
                  variant="secondary"
                  onClick={() => handleAssignRole(role.id)}
                  isLoading={assignRoleMutation.isPending}
                >
                  Assign
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}

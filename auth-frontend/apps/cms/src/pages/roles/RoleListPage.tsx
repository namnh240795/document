import { useState } from 'react';
import { useRoles, useCreateRole } from '@api/hooks/useRoles';
import { Button } from '@ui/components/ui/Button';
import { Input } from '@ui/components/ui/Input';
import { Card } from '@ui/components/ui/Card';
import { PageLayout } from '@ui/components/layout/PageLayout';

export function RoleListPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { data, isLoading } = useRoles();
  const createRoleMutation = useCreateRole();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRoleMutation.mutateAsync({ name, description });
    setName('');
    setDescription('');
  };

  return (
    <PageLayout title="Role Management">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Create New Role</h2>
          <form data-testid="role-create-form" onSubmit={handleSubmit} className="space-y-4">
            <Input
              data-testid="role-name-input"
              label="Role Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter role name"
              required
            />
            <Input
              data-testid="role-description-input"
              label="Description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
            />
            <Button data-testid="role-create-submit-button" type="submit" isLoading={createRoleMutation.isPending}>
              Create Role
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Existing Roles</h2>
          {isLoading ? (
            <p data-testid="role-list-loading">Loading...</p>
          ) : (
            <table data-testid="role-list-table" className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Description</th>
                  <th className="text-left py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((role: any) => (
                  <tr key={role.id} className="border-b">
                    <td className="py-2 font-medium">{role.name}</td>
                    <td className="py-2">{role.description || '-'}</td>
                    <td className="py-2">
                      {new Date(role.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}

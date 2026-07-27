import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUsers, useDeleteUser } from '@api/hooks/useUsers';
import { Button } from '@ui/components/ui/Button';
import { Input } from '@ui/components/ui/Input';
import { Card } from '@ui/components/ui/Card';
import { PageLayout } from '@ui/components/layout/PageLayout';

export function UserListPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUsers({ page, limit: 10, search });
  const deleteUserMutation = useDeleteUser();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await deleteUserMutation.mutateAsync(id);
    }
  };

  return (
    <PageLayout title="User Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Input
            data-testid="user-list-search-input"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />
        </div>

        <Card>
          {isLoading ? (
            <p data-testid="user-list-loading" className="text-center py-4">Loading...</p>
          ) : (
            <table data-testid="user-list-table" className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Phone</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.users?.map((user: any) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-2">{user.name}</td>
                    <td className="py-2">{user.email || '-'}</td>
                    <td className="py-2">{user.phone || '-'}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'banned' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-2 space-x-2">
                      <Link data-testid={`user-view-link-${user.id}`} to={`/users/${user.id}`} className="text-blue-600 hover:underline">
                        View
                      </Link>
                      <button
                        data-testid={`user-delete-button-${user.id}`}
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {data?.data?.pagination && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="text-sm text-gray-500">
                Page {data.data.pagination.page} of {data.data.pagination.totalPages}
              </span>
              <div className="space-x-2">
                <Button
                  data-testid="user-list-previous-button"
                  variant="secondary"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  data-testid="user-list-next-button"
                  variant="secondary"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= (data.data.pagination.totalPages || 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}

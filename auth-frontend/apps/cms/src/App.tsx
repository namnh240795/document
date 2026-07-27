import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@auth/auth';
import { LoginPage } from './pages/LoginPage';
import { UserListPage } from './pages/users/UserListPage';
import { UserDetailPage } from './pages/users/UserDetailPage';
import { RoleListPage } from './pages/roles/RoleListPage';
import { LogViewerPage } from './pages/logs/LogViewerPage';
import { AnalyticsDashboard } from './pages/logs/AnalyticsDashboard';
import { AdminGuard } from '@auth/auth';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/users"
          element={
            <AdminGuard>
              <UserListPage />
            </AdminGuard>
          }
        />
        <Route
          path="/users/:id"
          element={
            <AdminGuard>
              <UserDetailPage />
            </AdminGuard>
          }
        />
        <Route
          path="/roles"
          element={
            <AdminGuard>
              <RoleListPage />
            </AdminGuard>
          }
        />
        <Route
          path="/logs"
          element={
            <AdminGuard>
              <LogViewerPage />
            </AdminGuard>
          }
        />
        <Route
          path="/logs/analytics"
          element={
            <AdminGuard>
              <AnalyticsDashboard />
            </AdminGuard>
          }
        />
        <Route
          path="/"
          element={
            <AdminGuard>
              <UserListPage />
            </AdminGuard>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;

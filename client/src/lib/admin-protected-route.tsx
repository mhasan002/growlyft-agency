import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function AdminProtectedRoute({
  path,
  component: Component,
  requiredRoles,
}: {
  path: string;
  component: () => JSX.Element;
  requiredRoles?: string[];
}) {
  const { admin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading admin panel...</p>
          </div>
        </div>
      </Route>
    );
  }

  if (!admin) {
    return (
      <Route path={path}>
        <Redirect to="/admin/login" />
      </Route>
    );
  }

  // Check role-based access
  if (requiredRoles && requiredRoles.length > 0) {
    const hasPermission = requiredRoles.includes(admin.role) || admin.role === 'admin';
    if (!hasPermission) {
      return (
        <Route path={path}>
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </div>
          </div>
        </Route>
      );
    }
  }

  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}
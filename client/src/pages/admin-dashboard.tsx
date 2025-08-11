import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  FileText, 
  Settings,
  LogOut,
  Users,
  Mail,
  BarChart3,
  Plus,
  Loader2
} from "lucide-react";
import AdminFormsManager from "../components/admin/AdminFormsManager";
import AdminBlogManager from "../components/admin/AdminBlogManager";
import AdminAnalytics from "../components/admin/AdminAnalytics";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { admin, logoutMutation } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!admin) {
    setLocation("/admin/login");
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setLocation("/admin/login");
    } catch (error) {
      // Error is handled in the mutation's onError callback
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "editor":
        return "bg-blue-100 text-blue-800";
      case "form_manager":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canAccessForms = admin.role === "admin" || admin.role === "form_manager";
  const canAccessBlog = admin.role === "admin" || admin.role === "editor";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Growlyft Admin</h1>
              <Badge className={getRoleColor(admin.role)}>
                {admin.role.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {admin.firstName} {admin.lastName}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="dashboard" data-testid="tab-dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            {canAccessForms && (
              <TabsTrigger value="forms" data-testid="tab-forms">
                <Mail className="h-4 w-4 mr-2" />
                Forms
              </TabsTrigger>
            )}
            {canAccessBlog && (
              <TabsTrigger value="blog" data-testid="tab-blog">
                <FileText className="h-4 w-4 mr-2" />
                Blog
              </TabsTrigger>
            )}
            <TabsTrigger value="analytics" data-testid="tab-analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">124</div>
                  <p className="text-xs text-muted-foreground">
                    +12 from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">
                    +3 this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6</div>
                  <p className="text-xs text-muted-foreground">
                    All systems operational
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts for your role
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {canAccessBlog && (
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => setActiveTab("blog")}
                    data-testid="button-create-post"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">Create Blog Post</div>
                      <div className="text-sm text-gray-500">Write a new article</div>
                    </div>
                  </Button>
                )}
                
                {canAccessForms && (
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => setActiveTab("forms")}
                    data-testid="button-manage-forms"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">Manage Forms</div>
                      <div className="text-sm text-gray-500">Configure form settings</div>
                    </div>
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="justify-start h-auto p-4"
                  onClick={() => setActiveTab("analytics")}
                  data-testid="button-view-analytics"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">View Analytics</div>
                    <div className="text-sm text-gray-500">See performance metrics</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {canAccessForms && (
            <TabsContent value="forms">
              <AdminFormsManager />
            </TabsContent>
          )}

          {canAccessBlog && (
            <TabsContent value="blog">
              <AdminBlogManager />
            </TabsContent>
          )}

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
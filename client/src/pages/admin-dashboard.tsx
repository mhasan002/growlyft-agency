import { useState } from "react";
import * as React from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Settings,
  LogOut,
  Users,
  Mail,
  BarChart3,
  Plus,
  Loader2,
  User,
  Shield
} from "lucide-react";
import AdminFormsManager from "@/components/admin/AdminFormsManager";
import AdminBlogManager from "@/components/admin/AdminBlogManager";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminTeamManager from "@/components/admin/AdminTeamManager";
import AdminProfile from "@/components/admin/AdminProfile";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { admin, isLoading, logoutMutation } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Handle authentication redirects using useEffect to avoid hooks issues
  React.useEffect(() => {
    if (!isLoading && !admin) {
      setLocation("/admin/login");
    }
  }, [admin, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
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
  const canAccessTeam = admin.role === "admin";

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, show: true },
    { id: "forms", label: "Forms", icon: Mail, show: canAccessForms },
    { id: "blog", label: "Blog", icon: FileText, show: canAccessBlog },
    { id: "analytics", label: "Analytics", icon: BarChart3, show: true },
    { id: "team", label: "Team", icon: Users, show: canAccessTeam },
    { id: "profile", label: "Profile", icon: User, show: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Growlyft Admin</h1>
              <Badge className={cn("text-xs", getRoleColor(admin.role))}>
                {admin.role.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.filter(item => item.show).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                  activeTab === item.id
                    ? "bg-green-100 text-green-900 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
                data-testid={`nav-${item.id}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {admin.firstName} {admin.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{admin.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {activeTab === "profile" ? "My Profile" : activeTab}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {activeTab === "dashboard" && "Overview of your admin panel"}
                {activeTab === "forms" && "Manage contact forms and configurations"}
                {activeTab === "blog" && "Create and manage blog posts"}
                {activeTab === "analytics" && "View performance metrics and analytics"}
                {activeTab === "team" && "Manage team members and permissions"}
                {activeTab === "profile" && "Manage your account settings"}
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
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
              </div>
            )}

            {canAccessForms && activeTab === "forms" && (
              <AdminFormsManager />
            )}

            {canAccessBlog && activeTab === "blog" && (
              <AdminBlogManager />
            )}

            {activeTab === "analytics" && (
              <AdminAnalytics />
            )}

            {canAccessTeam && activeTab === "team" && (
              <AdminTeamManager />
            )}

            {activeTab === "profile" && (
              <AdminProfile />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
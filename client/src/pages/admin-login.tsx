import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { LoginAdmin, loginAdminSchema } from "@shared/schema";
import { Loader2, Shield, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { admin, loginMutation } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  if (admin) {
    setLocation("/admin-dashboard");
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const form = useForm<LoginAdmin>({
    resolver: zodResolver(loginAdminSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginAdmin) => {
    try {
      await loginMutation.mutateAsync(data);
      setLocation("/admin-dashboard");
    } catch (error) {
      // Error is handled in the mutation's onError callback
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Growlyft Admin
          </CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="admin@growlyft.com"
                        data-testid="input-email"
                        className="transition-colors focus:border-green-500 focus:ring-green-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          data-testid="input-password"
                          className="pr-10 transition-colors focus:border-green-500 focus:ring-green-500"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {loginMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {loginMutation.error?.message || "Login failed. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setLocation("/admin/forgot-password")}
              className="text-sm text-green-600 hover:text-green-700 underline"
              data-testid="link-forgot-password"
            >
              Forgot your password?
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
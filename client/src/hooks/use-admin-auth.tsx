import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { AdminUser, LoginAdmin, InsertAdminUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AdminAuthContextType = {
  admin: AdminUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<AdminUser, Error, LoginAdmin>;
  logoutMutation: UseMutationResult<void, Error, void>;
  createAdminMutation: UseMutationResult<AdminUser, Error, InsertAdminUser>;
};

export const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: admin,
    error,
    isLoading,
  } = useQuery<AdminUser | undefined, Error>({
    queryKey: ["/api/admin/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginAdmin) => {
      const res = await apiRequest("POST", "/api/admin/login", credentials);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Login failed");
      }
      return await res.json();
    },
    onSuccess: (admin: AdminUser) => {
      queryClient.setQueryData(["/api/admin/me"], admin);
      toast({
        title: "Login successful",
        description: `Welcome back, ${admin.firstName}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: async (adminData: InsertAdminUser) => {
      const res = await apiRequest("POST", "/api/admin/create", adminData);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create admin user");
      }
      return await res.json();
    },
    onSuccess: (admin: AdminUser) => {
      toast({
        title: "Admin user created",
        description: `Admin user ${admin.email} created successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create admin user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/logout");
      if (!res.ok) {
        throw new Error("Logout failed");
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/admin/me"], null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AdminAuthContext.Provider
      value={{
        admin: admin ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        createAdminMutation,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuthStatus, useLogoutAdmin } from "@/app/api/features/admin";

type AdminAuthContextType = {
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  userRole: string | null;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading: queryLoading } = useAuthStatus();
  const logoutMutation = useLogoutAdmin();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!queryLoading) {
      const loggedIn = !!data?.isLoggedIn && data?.userRole === "admin";
      setIsAuthenticated(loggedIn);
      setIsSuperAdmin(data?.userRole === "admin");
      setUserRole(data?.userRole || null);
      setIsLoading(false);
    }
  }, [data, queryLoading]);

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        setIsAuthenticated(false);
        setIsSuperAdmin(false);
        setUserRole(null);
        window.location.href = "/super-admin/login";
      },
    });
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isSuperAdmin,
        isLoading,
        userRole,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}

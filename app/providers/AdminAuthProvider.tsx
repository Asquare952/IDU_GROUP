"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuthStatus, useLogoutAdmin } from "@/app/api/features/admin";
import Cookies from "js-cookie";

const normalizeRole = (value: unknown) => {
  const role = typeof value === "string" ? value.trim().toLowerCase() : "";
  return role;
};

const hasSuperAdminClaim = () => {
  const token = Cookies.get("ACCESS_TOKEN");
  if (!token) return false;

  try {
    const segment = token.split(".")[1];
    if (!segment) return false;

    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const payload = JSON.parse(atob(padded)) as Record<string, unknown>;

    const claimValues = [
      payload.is_superadmin,
      payload.isSuperAdmin,
      payload.super_admin,
      payload.superadmin,
      payload.is_admin,
      payload.role,
      payload.userRole,
    ];

    return claimValues.some((value) => {
      const normalized = normalizeRole(value);
      return ["super-admin", "superadmin", "admin"].includes(normalized);
    });
  } catch {
    return false;
  }
};

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
      const cookieRole = normalizeRole(Cookies.get("USER_ROLE"));
      const apiRole = normalizeRole(
        data?.userRole ?? data?.role ?? data?.role_name,
      );
      const resolvedRole = apiRole || cookieRole || null;
      const tokenExists = !!Cookies.get("ACCESS_TOKEN");
      const loggedIn = !!data?.isLoggedIn || tokenExists;
      const isSuperAdminRole = ["super-admin", "superadmin", "admin"].includes(
        resolvedRole ?? "",
      );

      const shouldAllowAdminSession =
        loggedIn &&
        (data?.is_superadmin === true ||
          data?.isSuperAdmin === true ||
          isSuperAdminRole ||
          hasSuperAdminClaim());

      setIsAuthenticated(loggedIn);
      setIsSuperAdmin(!!shouldAllowAdminSession);
      setUserRole(resolvedRole);

      // Delay setting isLoading to false to prevent race conditions
      // with rapid redirects on mount
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);

      return () => clearTimeout(timer);
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

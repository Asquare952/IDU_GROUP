"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status from localStorage
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("adminUser");
        if (userData) {
          const user = JSON.parse(userData);
          const isAdmin =
            user?.is_superadmin === true && user?.role === "admin";
          setIsAuthenticated(!!userData);
          setIsSuperAdmin(isAdmin);
          setUserRole(user?.role || null);
        } else {
          setIsAuthenticated(false);
          setIsSuperAdmin(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
        setIsSuperAdmin(false);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("adminUser");
    setIsAuthenticated(false);
    setIsSuperAdmin(false);
    setUserRole(null);
    router.push("/super-admin/login");
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

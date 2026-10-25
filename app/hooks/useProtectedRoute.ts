"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAdminAuth } from "@/app/providers/AdminAuthProvider";

const adminRoles = ["super-admin", "superadmin", "admin"];

const hasAdminCookieSession = () => {
  const token = Cookies.get("ACCESS_TOKEN");
  if (!token) return false;

  const role = Cookies.get("USER_ROLE")?.trim().toLowerCase();
  if (role && adminRoles.includes(role)) return true;

  try {
    const segment = token.split(".")[1];
    if (!segment) return false;

    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const payload = JSON.parse(atob(padded)) as Record<string, unknown>;
    const values = [
      payload.is_superadmin,
      payload.isSuperAdmin,
      payload.super_admin,
      payload.superadmin,
      payload.is_admin,
      payload.role,
      payload.userRole,
    ];

    return values.some((value) => {
      const current =
        typeof value === "string" ? value.trim().toLowerCase() : "";
      return adminRoles.includes(current);
    });
  } catch {
    return false;
  }
};

export function useProtectedRoute() {
  const router = useRouter();
  const { isAuthenticated, isSuperAdmin, isLoading } = useAdminAuth();

  useEffect(() => {
    const hasValidAdminSession =
      isAuthenticated && isSuperAdmin ? true : hasAdminCookieSession();

    if (!isLoading && !hasValidAdminSession) {
      router.replace("/super-admin/login");
    }
  }, [isLoading, isAuthenticated, isSuperAdmin, router]);

  return { isLoading, isAuthenticated, isSuperAdmin };
}

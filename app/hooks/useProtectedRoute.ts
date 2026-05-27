"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/app/providers/AdminAuthProvider";

export function useProtectedRoute() {
  const router = useRouter();
  const { isAuthenticated, isSuperAdmin, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isSuperAdmin)) {
      router.push("/super-admin/login");
    }
  }, [isLoading, isAuthenticated, isSuperAdmin, router]);

  return { isLoading, isAuthenticated, isSuperAdmin };
}

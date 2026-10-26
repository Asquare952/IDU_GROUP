"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { clearCachedProfile } from "@/app/api/features/auth/profile-cache";

interface AuthContextType {
  isLoggedIn: boolean;
  sessionVersion: number;
  login: (token: string, role: string, remember?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionVersion, setSessionVersion] = useState(0);

  useEffect(() => {
    const token = Cookies.get("ACCESS_TOKEN");
    setIsLoggedIn(!!token);
  }, []);

  const login = (token: string, role: string, remember?: boolean) => {
    queryClient.removeQueries({ queryKey: ["support"] });
    const secureCookie = window.location.protocol === "https:";

    Cookies.set("ACCESS_TOKEN", token, {
      expires: remember ? 7 : 1,
      secure: secureCookie,
      sameSite: "lax",
      path: "/",
    });

    Cookies.set("USER_ROLE", role, {
      expires: remember ? 7 : 1,
      secure: secureCookie,
      sameSite: "lax",
      path: "/",
    });

    setSessionVersion((version) => version + 1);
    setIsLoggedIn(true);
  };
  const logout = () => {
    queryClient.removeQueries({ queryKey: ["support"] });
    clearCachedProfile();
    Cookies.remove("ACCESS_TOKEN");
    Cookies.remove("USER_ROLE");
    setSessionVersion((version) => version + 1);
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, sessionVersion, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

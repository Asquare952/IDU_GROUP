"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string, role: string, remember?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();


  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const token = Cookies.get("ACCESS_TOKEN");
    setIsLoggedIn(!!token);
  }, []);

  const login = (token: string, role: string, remember?: boolean) => {
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

    setIsLoggedIn(true);
  };
  const logout = () => {
    Cookies.remove("ACCESS_TOKEN");
    Cookies.remove("USER_ROLE");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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

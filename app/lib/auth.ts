import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type DecodedAuthToken = {
  _id?: string;
  id?: string;
  userId?: string;
  sub?: string;
  role?: "tenant" | "landlord";
};

export const getAccessToken = (): string | null => {
  return Cookies.get("ACCESS_TOKEN") ?? null;
};

export const hasAccessToken = (): boolean => {
  return Boolean(getAccessToken());
};

export const getCurrentUserId = (): string | null => {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode<DecodedAuthToken>(token);

    return (
      decodedToken._id ??
      decodedToken.id ??
      decodedToken.userId ??
      decodedToken.sub ??
      null
    );
  } catch {
    return null;
  }
};

export const getCurrentUserRole = (): "tenant" | "landlord" | null => {
  const token = getAccessToken();

  if (!token) {
    return (Cookies.get("USER_ROLE") as "tenant" | "landlord" | undefined) ?? null;
  }

  try {
    const decodedToken = jwtDecode<DecodedAuthToken>(token);

    return (
      decodedToken.role ??
      (Cookies.get("USER_ROLE") as "tenant" | "landlord" | undefined) ??
      null
    );
  } catch {
    return (Cookies.get("USER_ROLE") as "tenant" | "landlord" | undefined) ?? null;
  }
};

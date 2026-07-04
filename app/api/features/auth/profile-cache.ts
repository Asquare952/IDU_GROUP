"use client";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import type { AuthResponse, userProfile } from "./types";
import { normalizeProfileForCache } from "./profile-display";

type CachedProfile = Partial<NonNullable<AuthResponse["user"]> & userProfile>;

const PROFILE_STORAGE_KEY = "USER_PROFILE_CACHE";
const PROFILE_COOKIE_KEY = "USER_PROFILE";
const COOKIE_SAFE_IMAGE_MAX_LENGTH = 1500;

const isBrowser = () => typeof window !== "undefined";

const parseProfile = (value?: string): CachedProfile | undefined => {
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(value) as CachedProfile;
  } catch {
    return undefined;
  }
};

const getUserIdFromProfile = (profile?: CachedProfile) => {
  const candidate = profile?.id;
  if (typeof candidate === "string" && candidate.trim()) {
    return candidate.trim();
  }

  return "";
};

const getUserIdFromToken = () => {
  if (!isBrowser()) {
    return "";
  }

  const token = Cookies.get("ACCESS_TOKEN");
  if (!token) {
    return "";
  }

  try {
    const decoded = jwtDecode<{
      id?: string;
      sub?: string;
      userId?: string;
      _id?: string;
    }>(token);
    const candidate =
      decoded.id ?? decoded.userId ?? decoded._id ?? decoded.sub;
    return typeof candidate === "string" && candidate.trim()
      ? candidate.trim()
      : "";
  } catch {
    return "";
  }
};

const getStorageKey = (userId?: string) => {
  const resolvedUserId = userId?.trim() || getUserIdFromToken();
  return resolvedUserId
    ? `${PROFILE_STORAGE_KEY}_${resolvedUserId}`
    : PROFILE_STORAGE_KEY;
};

const getCookieKey = (userId?: string) => {
  const resolvedUserId = userId?.trim() || getUserIdFromToken();
  return resolvedUserId
    ? `${PROFILE_COOKIE_KEY}_${resolvedUserId}`
    : PROFILE_COOKIE_KEY;
};

const toCookieSafeProfile = (profile: CachedProfile): CachedProfile => {
  if (
    typeof profile.profileImage === "string" &&
    profile.profileImage.startsWith("data:") &&
    profile.profileImage.length > COOKIE_SAFE_IMAGE_MAX_LENGTH
  ) {
    const { profileImage: _ignored, ...rest } = profile;
    return rest;
  }

  return profile;
};

export const readCachedProfile = (
  userId?: string,
): CachedProfile | undefined => {
  if (!isBrowser()) {
    return undefined;
  }

  const storageKey = getStorageKey(userId);
  const cookieKey = getCookieKey(userId);
  const localProfile = parseProfile(
    window.localStorage.getItem(storageKey) ?? undefined,
  );
  const cookieProfile = parseProfile(Cookies.get(cookieKey));

  if (!localProfile && !cookieProfile) {
    return undefined;
  }

  return {
    ...cookieProfile,
    ...localProfile,
  };
};

export const writeCachedProfile = (
  profile: CachedProfile,
  expires = 1,
  userId?: string,
) => {
  if (!isBrowser()) {
    return;
  }

  const resolvedUserId =
    userId?.trim() || getUserIdFromProfile(profile) || getUserIdFromToken();
  const storageKey = getStorageKey(resolvedUserId);
  const cookieKey = getCookieKey(resolvedUserId);
  const nextProfile = normalizeProfileForCache({
    ...readCachedProfile(resolvedUserId),
    ...profile,
  });

  window.localStorage.setItem(storageKey, JSON.stringify(nextProfile));
  Cookies.set(cookieKey, JSON.stringify(toCookieSafeProfile(nextProfile)), {
    expires,
  });
};

export const clearCachedProfile = (userId?: string) => {
  if (!isBrowser()) {
    return;
  }

  const storageKey = getStorageKey(userId);
  const cookieKey = getCookieKey(userId);

  window.localStorage.removeItem(storageKey);
  Cookies.remove(cookieKey);
};

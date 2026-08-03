"use client";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import type { AuthResponse, userProfile } from "./types";
import { normalizeProfileForCache } from "./profile-display";

type CachedProfile = Partial<NonNullable<AuthResponse["user"]> & userProfile>;

const PROFILE_STORAGE_KEY = "USER_PROFILE_CACHE";
const PROFILE_COOKIE_KEY = "USER_PROFILE";
const memoryProfileCache = new Map<string, CachedProfile>();

const isBrowser = () => typeof window !== "undefined";

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

const getMemoryKey = (userId?: string) =>
  userId?.trim() || getUserIdFromToken() || "current";

const clearLegacyPersistentProfile = (userId?: string) => {
  if (!isBrowser()) {
    return;
  }

  const storageKey = getStorageKey(userId);
  const cookieKey = getCookieKey(userId);

  window.localStorage.removeItem(storageKey);
  Cookies.remove(cookieKey);

  for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
    const key = window.localStorage.key(index);

    if (key?.startsWith(PROFILE_STORAGE_KEY)) {
      window.localStorage.removeItem(key);
    }
  }

  Object.keys(Cookies.get()).forEach((key) => {
    if (key.startsWith(PROFILE_COOKIE_KEY)) {
      Cookies.remove(key);
    }
  });
};

export const readCachedProfile = (
  userId?: string,
): CachedProfile | undefined => {
  if (!isBrowser()) {
    return undefined;
  }

  clearLegacyPersistentProfile(userId);
  return memoryProfileCache.get(getMemoryKey(userId));
};

export const writeCachedProfile = (
  profile: CachedProfile,
  _expires = 1,
  userId?: string,
) => {
  if (!isBrowser()) {
    return;
  }

  const resolvedUserId =
    userId?.trim() || getUserIdFromProfile(profile) || getUserIdFromToken();
  const previousProfile = readCachedProfile(resolvedUserId);
  const mergedProfile = {
    ...(previousProfile ?? {}),
    ...profile,
  };
  const nextProfile = normalizeProfileForCache(mergedProfile, previousProfile);

  clearLegacyPersistentProfile(resolvedUserId);
  memoryProfileCache.set(getMemoryKey(resolvedUserId), nextProfile);
};

export const clearCachedProfile = (userId?: string) => {
  if (!isBrowser()) {
    return;
  }

  memoryProfileCache.delete(getMemoryKey(userId));
  clearLegacyPersistentProfile(userId);
};

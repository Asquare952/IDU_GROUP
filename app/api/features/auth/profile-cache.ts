"use client";

import Cookies from "js-cookie";
import type { AuthResponse, userProfile } from "./types";

type CachedProfile = Partial<NonNullable<AuthResponse["user"]> & userProfile>;

const PROFILE_STORAGE_KEY = "USER_PROFILE_CACHE";
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

export const readCachedProfile = (): CachedProfile | undefined => {
  if (!isBrowser()) {
    return undefined;
  }

  const localProfile = parseProfile(
    window.localStorage.getItem(PROFILE_STORAGE_KEY) ?? undefined,
  );
  const cookieProfile = parseProfile(Cookies.get("USER_PROFILE"));

  if (!localProfile && !cookieProfile) {
    return undefined;
  }

  return {
    ...cookieProfile,
    ...localProfile,
  };
};

export const writeCachedProfile = (profile: CachedProfile) => {
  if (!isBrowser()) {
    return;
  }

  const nextProfile = {
    ...readCachedProfile(),
    ...profile,
  };

  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
  Cookies.set("USER_PROFILE", JSON.stringify(toCookieSafeProfile(nextProfile)), {
    expires: 1,
  });
};

export const clearCachedProfile = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(PROFILE_STORAGE_KEY);
  Cookies.remove("USER_PROFILE");
};

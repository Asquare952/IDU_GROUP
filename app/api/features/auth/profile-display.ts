import { useEffect, useState } from "react";

type ProfileRecord = Record<string, unknown>;

const readString = (profile: ProfileRecord, keys: string[]) => {
  for (const key of keys) {
    const value = profile[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (Array.isArray(value)) {
      const match = value.find(
        (item): item is string =>
          typeof item === "string" && item.trim() !== "",
      );

      if (match) {
        return match.trim();
      }
    }
  }

  return "";
};

const splitName = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
};

export const getProfileDisplayFields = (profile?: unknown) => {
  if (!profile || typeof profile !== "object") {
    return {
      full_name: "",
      email: "",
      profileImage: "",
      phone_no: "",
      address: "",
      state: "",
      createdAt: "",
      is_verified: false,
      verified: false,
      withdrawalBankName: "",
      withdrawalAccountNumber: "",
      withdrawalAccountName: "",
    };
  }

  const record = profile as ProfileRecord;
  const combinedName = readString(record, [
    "fullName",
    "full_name",
    "name",
    "username",
  ]);
  const splitCombinedName = splitName(combinedName);
  const firstName =
    readString(record, ["first_name", "firstName", "given_name"]) ||
    splitCombinedName.firstName;
  const lastName =
    readString(record, ["last_name", "lastName", "family_name"]) ||
    splitCombinedName.lastName;
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const email = readString(record, ["email"]);
  const phone_no = readString(record, ["phone_no", "phone", "mobile"]);
  const address = readString(record, ["address"]);
  const state = readString(record, ["state"]);
  const createdAt = readString(record, ["createdAt", "created_at"]);
  const is_verified = !!readString(record, ["is_verified", "verified"]);
  const verified = !!readString(record, ["is_verified", "verified"]);
  const withdrawalBankName = readString(record, [
    "withdrawalBankName",
    "bankName",
  ]);
  const withdrawalAccountNumber = readString(record, [
    "withdrawalAccountNumber",
    "accountNumber",
  ]);
  const withdrawalAccountName = readString(record, [
    "withdrawalAccountName",
    "accountName",
  ]);

  return {
    firstName,
    lastName,
    fullName,
    full_name: fullName,
    email,
    profileImage: readString(record, [
      "profileImage",
      "profile_image",
      "image",
      "avatar",
    ]),
    phone_no,
    address,
    state,
    createdAt,
    is_verified,
    verified,
    withdrawalBankName,
    withdrawalAccountNumber,
    withdrawalAccountName
  };
};

export const useStableProfileImage = (image?: string) => {
  const [stableImage, setStableImage] = useState<string>(image?.trim() ?? "");

  useEffect(() => {
    const nextImage = image?.trim();

    if (nextImage) {
      setStableImage(nextImage);
    }
  }, [image]);

  return stableImage;
};

export const normalizeProfileForCache = <T extends object>(
  profile: T,
  fallbackProfile?: unknown,
) => {
  const display = getProfileDisplayFields(profile);
  const fallbackDisplay = getProfileDisplayFields(fallbackProfile);

  return {
    ...profile,
    full_name: display.full_name || fallbackDisplay.full_name,
    email: display.email || fallbackDisplay.email,
    profileImage:
      display.profileImage ||
      fallbackDisplay.profileImage ||
      (profile as ProfileRecord).profileImage,
    phone_no: display.phone_no || fallbackDisplay.phone_no,
    address: display.address || fallbackDisplay.address,
    state: display.state || fallbackDisplay.state,
    createdAt: display.createdAt || fallbackDisplay.createdAt,
    is_verified: display.is_verified || fallbackDisplay.is_verified,
    verified: display.verified || fallbackDisplay.verified,
    withdrawalBankName:
      display.withdrawalBankName || fallbackDisplay.withdrawalBankName,
    withdrawalAccountNumber:
      display.withdrawalAccountNumber ||
      fallbackDisplay.withdrawalAccountNumber,
    withdrawalAccountName:
      display.withdrawalAccountName || fallbackDisplay.withdrawalAccountName,
  };
};

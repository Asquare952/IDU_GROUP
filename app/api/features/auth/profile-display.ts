type ProfileRecord = Record<string, unknown>;

const readString = (profile: ProfileRecord, keys: string[]) => {
  for (const key of keys) {
    const value = profile[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
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

  return {
    firstName,
    lastName,
    fullName,
    full_name: fullName,
    email,
    profileImage: readString(record, [
      "profileImage",
      "profile_image",
      "avatar",
    ]),
  };
};

export const normalizeProfileForCache = <T extends object>(profile: T) => {
  const display = getProfileDisplayFields(profile);

  return {
    ...profile,
    full_name: display.full_name,
    email: display.email,
    profileImage:
      display.profileImage || (profile as ProfileRecord).profileImage,
  };
};

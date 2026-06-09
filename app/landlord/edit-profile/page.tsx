"use client"


import { ChangeEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { MoveLeft, Upload } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import {
  useChangePassword,
  useUpdateUserProfile,
  useUserProfile,
} from "@/app/api/features/auth/auth.queries";
import { getProfileDisplayFields } from "@/app/api/features/auth/profile-display";
import { AuthResponse, updateUserPayload } from "@/app/api/features/auth/types";
import { readCachedProfile } from "@/app/api/features/auth/profile-cache";
import { toast } from "react-toastify";

type DecodedToken = {
  id?: string;
  sub?: string;
  userId?: string;
  _id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_no?: string;
  address?: string;
  state?: string;
};

type EditProfileFormValues = {
  first_name: string;
  last_name: string;
  phone_no: string;
  email: string;
  address: string;
  state: string;
  bio: string;
  profileImage: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const defaultValues: EditProfileFormValues = {
  first_name: "",
  last_name: "",
  phone_no: "",
  email: "",
  address: "",
  state: "",
  bio: "",
  profileImage: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

type CachedUserProfile = Partial<AuthResponse["user"]>;

const MAX_IMAGE_DIMENSION = 800;
const MAX_IMAGE_BYTES = 700 * 1024;

const getBase64SizeInBytes = (dataUrl: string) => {
  const base64 = dataUrl.split(",")[1] ?? "";
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;

  return (base64.length * 3) / 4 - padding;
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load selected image"));
    image.src = src;
  });

const compressImage = async (file: File) => {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);

  const scale = Math.min(
    1,
    MAX_IMAGE_DIMENSION / Math.max(image.width, image.height),
  );
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Image compression is not supported in this browser");
  }

  context.drawImage(image, 0, 0, width, height);

  let quality = 0.82;
  let output = canvas.toDataURL("image/jpeg", quality);

  while (getBase64SizeInBytes(output) > MAX_IMAGE_BYTES && quality > 0.4) {
    quality -= 0.08;
    output = canvas.toDataURL("image/jpeg", quality);
  }

  if (getBase64SizeInBytes(output) > MAX_IMAGE_BYTES) {
    throw new Error(
      "Image is still too large after compression. Please choose a smaller photo.",
    );
  }

  return output;
};

const page = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [cachedProfile, setCachedProfile] = useState<CachedUserProfile>();
  const [decodedProfile, setDecodedProfile] = useState<Partial<EditProfileFormValues>>(
    {},
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { isSubmitting },
  } = useForm<EditProfileFormValues>({
    defaultValues,
  });

  const firstName = watch("first_name");
  const lastName = watch("last_name");

  useEffect(() => {
    const token = Cookies.get("ACCESS_TOKEN");

    if (!token) {
      setHasCheckedAuth(true);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUserId(decoded.id ?? decoded.userId ?? decoded._id ?? decoded.sub);
      setDecodedProfile({
        first_name: decoded.first_name ?? "",
        last_name: decoded.last_name ?? "",
        phone_no: decoded.phone_no ?? "",
        email: decoded.email ?? "",
        address: decoded.address ?? "",
        state: decoded.state ?? "",
      });
    } catch {
      setUserId(undefined);
    } finally {
      setHasCheckedAuth(true);
    }

    setCachedProfile(readCachedProfile() as CachedUserProfile | undefined);
  }, []);

  const { data: profile, isLoading: isProfileLoading } = useUserProfile(
    userId,
    hasCheckedAuth,
  );
  const { mutateAsync: updateProfile, isPending: isUpdating } =
    useUpdateUserProfile(userId);
  const { mutateAsync: changePassword, isPending: isChangingPassword } =
    useChangePassword();

  useEffect(() => {
    const cachedDisplay = getProfileDisplayFields(cachedProfile);
    const profileDisplay = getProfileDisplayFields(profile);
    const decodedDisplay = getProfileDisplayFields(decodedProfile);

    if (!profile) {
      reset({
        ...defaultValues,
        first_name:
          cachedDisplay.firstName ?? decodedDisplay.firstName ?? "",
        last_name:
          cachedDisplay.lastName ?? decodedDisplay.lastName ?? "",
        phone_no: cachedProfile?.phone_no ?? decodedProfile.phone_no ?? "",
        email: cachedDisplay.email ?? decodedDisplay.email ?? "",
        address: cachedProfile?.address ?? decodedProfile.address ?? "",
        state: cachedProfile?.state ?? decodedProfile.state ?? "",
        bio: cachedProfile?.bio ?? "",
        profileImage: cachedProfile?.profileImage ?? "",
      });

      setPreview(cachedProfile?.profileImage ?? null);
      return;
    }

    reset({
      ...defaultValues,
      first_name:
        profileDisplay.firstName ??
        cachedDisplay.firstName ??
        decodedDisplay.firstName ??
        "",
      last_name:
        profileDisplay.lastName ??
        cachedDisplay.lastName ??
        decodedDisplay.lastName ??
        "",
      phone_no:
        profile.phone_no ?? cachedProfile?.phone_no ?? decodedProfile.phone_no ?? "",
      email:
        profileDisplay.email ?? cachedDisplay.email ?? decodedDisplay.email ?? "",
      address:
        profile.address ?? cachedProfile?.address ?? decodedProfile.address ?? "",
      state: profile.state ?? cachedProfile?.state ?? decodedProfile.state ?? "",
      bio: profile.bio ?? cachedProfile?.bio ?? "",
      profileImage:
        (profile.profileImage || cachedProfile?.profileImage) ?? "",
    });

    setPreview((profile.profileImage || cachedProfile?.profileImage) ?? null);
  }, [cachedProfile, decodedProfile, profile, reset]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      e.target.value = "";
      return;
    }

    if (file.type === "image/gif") {
      toast.error("GIF uploads are not supported here. Please use JPG or PNG.");
      e.target.value = "";
      return;
    }

    try {
      const imageValue = await compressImage(file);
      setPreview(imageValue);
      setValue("profileImage", imageValue, { shouldDirty: true });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to process the selected image",
      );
      e.target.value = "";
    }
  };

  const onSubmit: SubmitHandler<EditProfileFormValues> = async ({
    bio,
    profileImage,
    currentPassword,
    newPassword,
    confirmPassword,
  }) => {
    const payload: updateUserPayload = {
      bio,
      profileImage,
    };

    const originalBio = profile?.bio ?? cachedProfile?.bio ?? "";
    const originalProfileImage = profile?.profileImage ?? cachedProfile?.profileImage ?? "";
    const shouldUpdateProfile =
      bio !== originalBio || profileImage !== originalProfileImage;
    const shouldChangePassword =
      !!currentPassword || !!newPassword || !!confirmPassword;

    if (!shouldUpdateProfile && !shouldChangePassword) {
      toast.info("No changes to save");
      return;
    }

    if (shouldChangePassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("Fill in all password fields to change your password");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("confirmPassword", {
          type: "validate",
          message: "Passwords do not match",
        });
        toast.error("New password and confirm password must match");
        return;
      }
    }

    try {
      if (shouldUpdateProfile) {
        await updateProfile(payload);
        setCachedProfile((current) => ({
          ...(current ?? {}),
          bio,
          profileImage,
        }));
        setPreview(profileImage || null);
      }

      if (shouldChangePassword) {
        await changePassword({
          currentPassword,
          newPassword,
        });

        reset(
          {
            ...watch(),
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          },
          { keepDirty: false },
        );
      }
    } catch {
      // Mutation hooks already handle user-facing errors.
    }
  };

  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.trim() || "U";
  const imageSrc = preview || null;
  const isBusy =
    isProfileLoading || isUpdating || isChangingPassword || isSubmitting;


  return (
    <DashboardLayout>
      <section className="min-h-screen bg-[#F8F9FA] p-8">
        <div className="mx-auto flex max-w-325 flex-col gap-3.5">
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-4">
              <Link
                href="/tenant/dashboard/profile"
                className="flex items-center gap-1.5"
              >
                <MoveLeft />
                <span>Back to Profile</span>
              </Link>
              <div className="flex flex-col gap-1">
                <h1 className="text-4xl font-semibold text-gray-900">
                  Edit Profile
                </h1>
                <p className="mt-2 text-gray-600">
                  Update your personal information and profile settings
                </p>
                {/* <p className="text-sm text-gray-500">
                  Only your bio and profile photo can be updated from this page.
                </p> */}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2 rounded-xl bg-white px-6 py-3">
                <h2 className="text-xl font-medium text-gray-900">Profile Photo</h2>
                <div className="flex flex-col md:flex-row gap-4">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="Profile preview"
                      className="h-25 w-25 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-25 w-25 items-center justify-center rounded-full bg-[#43A047] text-3xl font-semibold text-white">
                      {initials}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      className="mb-2 flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
                      onClick={handleButtonClick}
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload New Photo</span>
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500">
                      JPG or PNG.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-xl bg-white px-6 py-3">
                <h2 className="text-xl font-medium text-gray-900">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="first_name"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      id="first_name"
                      type="text"
                      {...register("first_name")}
                      readOnly
                      className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="last_name"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      id="last_name"
                      type="text"
                      {...register("last_name")}
                      readOnly
                      className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="bio"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    {...register("bio")}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                  />
                  <p>Brief description about yourself</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-xl bg-white px-6 py-5">
                <h2 className="text-xl font-medium text-gray-900">
                  Contact Information
                </h2>

                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      readOnly
                      className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="phone_no"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone_no"
                      type="text"
                      {...register("phone_no")}
                      readOnly
                      className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Current Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      {...register("address")}
                      readOnly
                      className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* change password */}
              <div className="flex flex-col gap-4 rounded-xl bg-white px-6 py-5">
                <h2 className="text-xl font-medium text-gray-900">
                  Change Password
                </h2>

                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="currentPassword"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      {...register("currentPassword")}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="newPassword"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      {...register("newPassword")}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword")}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-[#43A047] px-3.5 py-1.5 text-white disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isBusy || !userId}
                >
                  {isBusy ? "Saving..." : "Save Changes"}
                </button>
                <Link
                  href="/tenant/dashboard/settings"
                  className="rounded-lg bg-gray-100 px-4 py-1.5 hover:bg-gray-200"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </DashboardLayout>

  )
}

export default page

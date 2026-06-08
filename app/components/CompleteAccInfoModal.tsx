"use client"

import { useEffect, useState } from "react"
import z from "zod";
import { finishAccDetailsSchema } from "../lib/accInfoDetails.schema";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Loader2, X } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useUpdateUserProfile,
  useUserProfile
} from "@/app/api/features/auth/auth.queries";
import { AuthResponse, updateUserPayload } from "@/app/api/features/auth/types";
import { readCachedProfile } from "@/app/api/features/auth/profile-cache";


type CompleteAccInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type DecodedToken = {
  id?: string;
  sub?: string;
  userId?: string;
  _id?: string;
  email?: string;
  phone_no?: string;
  address?: string;
  state?: string;
};

type EditProfileFormValues = {
  phone_no: string;
  address: string;
  state: string;
};

const defaultValues: EditProfileFormValues = {
  phone_no: "",
  address: "",
  state: "",
};

type CachedUserProfile = AuthResponse["user"];



const CompleteAccInfoModal = ({ isOpen, onClose }: CompleteAccInfoModalProps) => {
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
  } = useForm<EditProfileFormValues>();

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
        phone_no: decoded.phone_no ?? "",
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
  const { mutateAsync: updateProfile, isPending } =
    useUpdateUserProfile(userId);

  useEffect(() => {
    const mergedProfile = {
      ...profile,
      ...cachedProfile,
    };

    if (!profile && !cachedProfile) {
      reset({
        ...defaultValues,
        phone_no: decodedProfile.phone_no ?? "",
        address: decodedProfile.address ?? "",
        state: decodedProfile.state ?? "",
      });

      return;
    }

    reset({
      ...defaultValues,
      phone_no: mergedProfile.phone_no ?? decodedProfile.phone_no ?? "",
      address: mergedProfile.address ?? decodedProfile.address ?? "",
      state: mergedProfile.state ?? decodedProfile.state ?? "",
    });
  }, [cachedProfile, decodedProfile, profile, reset]);


  const onSubmit: SubmitHandler<EditProfileFormValues> = async ({
    phone_no,
    address,
    state,
    }) => {
      const payload: updateUserPayload = {
        phone_no,
        address,
        state,
      };
  
    const originalPhone_no = profile?.phone_no ?? cachedProfile?.phone_no ?? "";
      const originalAddress = profile?.address ?? cachedProfile?.address ?? "";
      const originalState = profile?.state ?? cachedProfile?.state ?? "";
      const shouldUpdateProfile =
        phone_no !== originalPhone_no || address !== originalAddress || state !== originalState;
  
      if (!shouldUpdateProfile) {
        toast.info("No changes to save");
        return;
      }
  
      try {
        if (shouldUpdateProfile) {
          await updateProfile(payload);
          setCachedProfile((current) =>
            current
              ? {
                  ...current,
                  phone_no,
                  address,
                  state,
                }
              : current,
          );
          toast.success("Profile verified successfully");
        }
      } catch {
        // Mutation hooks already handle user-facing errors.
      }
    };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl relative z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex flex-col items-center gap-1">
              <h3 className="text-2xl text-center text-3xl font-bold text-gray-900">Please Complete Your Account Details</h3>
              <p className="mb-6 text-center text-gray-600">
                To ensure a smooth experience, please complete your account details.
              </p>
            </div>

            {/* <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close waitlist modal"
            >
              <X size={24} className="cursor-pointer" />
            </button> */}
            

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

              {/*  */}
              <div>
                <label
                  htmlFor="state"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  State of residence
                </label>
                <input
                  id="state"
                  type="text"
                  {...register("state", { required: "State is required" })}
                  placeholder="State of residence"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white placeholder:text-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#43A047]"
                  autoComplete="email"
                  required
                />
              </div>

              {/*  */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  {...register("address", { required: "Address is required" })}
                  placeholder="123 Main St, City, State ZIP"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white placeholder:text-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#43A047]"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone_no", { required: "Phone number is required" }, )}
                  placeholder="123-456-7890"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white placeholder:text-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#43A047]"
                  autoComplete="email"
                  required
                />
              </div>

              <button
                type="submit"
                // disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#43A047] px-4 py-2 font-bold text-white transition-all hover:bg-[#3a8a3d] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {isPending && <Loader2 size={18} className="animate-spin" />}
                {isPending ? "Submitting..." : "Submit"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 font-bold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default CompleteAccInfoModal

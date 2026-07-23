"use client";

import Image from "next/image";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";
import {
  SquarePen, User, Mail, Phone, MapPin, Calendar, Landmark,
  CreditCard, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useUserProfile } from "@/app/api/features/auth/auth.queries";
import { AuthResponse } from "@/app/api/features/auth/types";
import {
  getProfileDisplayFields,
  useStableProfileImage,
} from "@/app/api/features/auth/profile-display";
import { readCachedProfile } from "@/app/api/features/auth/profile-cache";
import { useState, useEffect } from "react";

type SettingsUser = NonNullable<AuthResponse["user"]>;

type CachedUserProfile = SettingsUser;

type DecodedToken = {
  id?: string;
  sub?: string;
  userId?: string;
  _id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_no?: string;
  address?: string;
  state?: string;
  createdAt?: string;
  is_verified?: boolean;
  withdrawalBankName?: string;
  withdrawalAccountNumber?: string;
  withdrawalAccountName?: string;
};

const page = () => {
  const [userId, setUserId] = useState<string>();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [cachedProfile, setCachedProfile] = useState<CachedUserProfile>();
  const [decodedProfile, setDecodedProfile] = useState<
    Partial<CachedUserProfile>
  >({});

  useEffect(() => {
    const token = Cookies.get("ACCESS_TOKEN");
    setCachedProfile(readCachedProfile() as CachedUserProfile | undefined);

    if (!token) {
      setHasCheckedAuth(true);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUserId(decoded.id ?? decoded.userId ?? decoded._id ?? decoded.sub);
      setDecodedProfile({
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        email: decoded.email,
        phone_no: decoded.phone_no,
        address: decoded.address,
        state: decoded.state,
        createdAt: decoded.createdAt,
        is_verified: decoded.is_verified,
        withdrawalBankName: decoded.withdrawalBankName,
        withdrawalAccountNumber: decoded.withdrawalAccountNumber,
        withdrawalAccountName: decoded.withdrawalAccountName
      });
    } catch {
      setUserId(undefined);
      setDecodedProfile({});
    } finally {
      setHasCheckedAuth(true);
    }
  }, []);

  const { data: user } = useUserProfile(userId, hasCheckedAuth);
  const cachedDisplay = getProfileDisplayFields(cachedProfile);
  const userDisplay = getProfileDisplayFields(user);
  const decodedDisplay = getProfileDisplayFields(decodedProfile);

  const displayFirstName =
    userDisplay.firstName ||
    cachedDisplay.firstName ||
    decodedDisplay.firstName ||
    "";
  const displayLastName =
    userDisplay.lastName ||
    cachedDisplay.lastName ||
    decodedDisplay.lastName ||
    "";
  const displayEmail =
    userDisplay.email || cachedDisplay.email || decodedDisplay.email || "";
  const displayPhone =
    cachedProfile?.phone_no ?? userDisplay?.phone_no ?? decodedProfile.phone_no ?? "";
  const displayAddress =
    cachedProfile?.address ?? userDisplay.address ?? decodedProfile.address ?? "";
  const displayState =
    cachedProfile?.state ?? userDisplay.state ?? decodedProfile.state ?? "";
  const displayBio = cachedProfile?.bio ?? user?.bio ?? "";
  const displayMembershipYear = userDisplay?.createdAt
    ? new Date(userDisplay.createdAt).getFullYear()
    : cachedProfile?.createdAt
      ? new Date(cachedProfile.createdAt).getFullYear()
      : "";


  const [avatarSrc, setAvatarSrc] = useState("");
  const fallbackImage =
    userDisplay.profileImage ||
    cachedDisplay.profileImage ||
    decodedDisplay.profileImage ||
    "";
  const displayProfileImage = useStableProfileImage(fallbackImage);
  const displayBankName = userDisplay.withdrawalBankName ?? cachedProfile?.withdrawalBankName ?? decodedProfile.withdrawalBankName ?? "";
  const displayAccountNumber = userDisplay.withdrawalAccountNumber ?? cachedProfile?.withdrawalAccountNumber ?? decodedProfile.withdrawalAccountNumber ?? "";
  const displayAccountName = userDisplay.withdrawalAccountName ?? cachedProfile?.withdrawalAccountName ?? decodedProfile.withdrawalAccountName ?? "";

  useEffect(() => {
    if (fallbackImage) {
      setAvatarSrc(fallbackImage);
    }
  }, [fallbackImage]);
  const initials =
    `${displayFirstName[0] ?? ""}${displayLastName[0] ?? ""}`.trim() || "U";

  const profileDisplay = getProfileDisplayFields(
    user ?? cachedProfile ?? decodedProfile,
  );

  return (
    <DashboardLayout>
      <section className="p-8 bg-[#F8F9FA] min-h-screen">
        <div className=" flex justify-between items-center mb-6">
          <h2 className="text-2xl  md:text-4xl font-bold text-[#162B4C]">
            My Profile
          </h2>
          <Link
            href="/tenant/edit-profile"
            className=" flex items-center gap-1.5 py-2.5 px-3.5 rounded-md bg-[#43A047] text-white"
          >
            <SquarePen size={15} className=" text-md" />
            <span>Edit Profile</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-3xl p-6 md:p-8 mb-8 shadow-sm border border-gray-50 text-center md:text-left gap-6 md:gap-0">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="relative">
              {avatarSrc || displayProfileImage ? (
                <Image
                  src={avatarSrc || displayProfileImage}
                  alt="User profile"
                  width={100}
                  height={100}
                  className="h-[100px] w-[100px] rounded-full object-cover"
                />
              ) : (
                <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#43A047] text-2xl font-semibold text-white">
                  {initials}
                </div>
              )}
              <div className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full border border-gray-100 shadow-sm">
                <User size={14} className="text-gray-400 cursor-pointer" />
              </div>
            </div>

            <div className=" flex flex-col gap-2.5">
              <h3 className="text-2xl md:text-3xl font-bold text-[#162B4C]">
                {displayFirstName} {displayLastName}
              </h3>
              <p className="text-gray-500 flex items-center justify-center md:justify-start gap-1 text-sm md:text-base">
                {displayBio || "No bio added yet"}
              </p>
            </div>
          </div>
        </div>

        {/*  */}
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
            <div className=" mb-10">
              <h4 className="text-xl font-semibold text-[#162B4C]">
                Contact Information
              </h4>
            </div>

            <div className="flex flex-col gap-8 mb-1">
              <div className="flex items-center gap-2">
                <div className="bg-[#E8F5E9] p-2 rounded-lg">
                  <Mail size={25} className="text-gray-400" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm  text-gray-500 ">Email</p>
                  <p className="font-bold text-[#162B4C]">{displayEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-[#E8F5E9] p-2 rounded-lg">
                  <Phone size={25} className="text-gray-400" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500 ">Phone Number</p>
                  <p className="font-bold text-[#162B4C]">{displayPhone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-[#E8F5E9] p-2 rounded-lg">
                  <MapPin size={25} className="text-gray-400" />
                </div>
                <div className="flex flex-col ">
                  <p className="text-sm text-gray-500 ">Address</p>
                  <p className="font-bold text-[#162B4C]">
                    {displayAddress || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-[#E8F5E9] p-2 rounded-lg">
                  <MapPin size={25} className="text-gray-400" />
                </div>
                <div className="flex flex-col ">
                  <p className="text-sm text-gray-500 ">State</p>
                  <p className="font-bold text-[#162B4C]">
                    {displayState || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
            <div className=" mb-10">
              <h4 className="text-xl font-semibold text-[#162B4C]">
                Account Details
              </h4>
            </div>

            <div className="flex flex-col gap-8 mb-1">
              <div className="flex gap-1.5">
                <div className="bg-[#E8F5E9] p-2 rounded-lg">
                  <Calendar size={25} className="text-gray-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-[#162B4C]">
                    Memeber Since
                  </p>
                  <p className="text-gray-500">
                    {displayMembershipYear
                      ? `Since ${displayMembershipYear}`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex gap-1.5">
                <div className="bg-[#E8F5E9] p-2 rounded-lg">
                  <ShieldCheck size={25} className="text-gray-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-[#162B4C]">
                    Verification Status
                  </p>

                  {profileDisplay.verified === true 
                    ? <p className=" text-green-500">Verified</p>
                    : <p className=" text-amber-400">Not verified</p>}

                </div>
              </div>
            </div>
          </div>


          {/* Bank Details */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
            <div className=" mb-10">
              <h4 className="text-xl font-semibold text-[#162B4C]">
                Bank Details
              </h4>
            </div>

            <div className="flex flex-col gap-8 mb-1">
              <div className="flex gap-1.5">
                <div className="bg-[#E8F5E9] p-2 rounded-lg">
                  <Landmark size={25} className="text-gray-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-[#162B4C]">
                    Bank Name
                  </p>
                  <p className="text-gray-500">
                    {displayBankName}
                  </p>
                </div>
              </div>

              <div className="flex gap-1">
                <div className="bg-[#E8F5E9] p-2 rounded-lg">
                  <CreditCard size={25} className="text-gray-400" />
                </div>
                <div className=" flex flex-col gap-1">
                  <p className="text-sm font-bold text-[#162B4C]">Account Number</p>
                  <p className="text-gray-500">{displayAccountNumber}</p>
                </div>
              </div>

              <div className="flex gap-1">
                <div className="bg-[#E8F5E9] p-2 rounded-lg">
                  <User size={25} className="text-gray-400" />
                </div>
                <div className=" flex flex-col gap-1">
                  <p className="text-sm font-bold text-[#162B4C]">Account Name</p>
                  <p className="text-gray-500">{displayAccountName}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default page;

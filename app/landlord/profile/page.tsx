"use client"

import Image from "next/image";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import { SquarePen, User, Mail, Phone, MapPin, Calendar, Building2, Shield } from 'lucide-react';
import Link from "next/link";
import { useUserProfile } from "@/app/api/features/auth/auth.queries";
import { AuthResponse } from "@/app/api/features/auth/types";
import { useFetchLandlordListedProperties } from "@/app/api/features/property/property.queries";
import { useState, useEffect } from "react";
// import { property } from "zod";

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
};


const page = () => {

  const [userId, setUserId] = useState<string>();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [cachedProfile, setCachedProfile] = useState<CachedUserProfile>();
  const [decodedProfile, setDecodedProfile] = useState<Partial<CachedUserProfile>>({});

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-50 text-orange-700 border border-green-100";
      case "pending":
        return "bg-amber-50 text-[#FFCD36] border border-amber-100";
      case "rented":
        return "bg-blue-50 text-[#4B8EFF] border border-blue-100";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const { data: properties } = useFetchLandlordListedProperties();


  useEffect(() => {
    const token = Cookies.get("ACCESS_TOKEN");
    const storedProfile = Cookies.get("USER_PROFILE");

    if (storedProfile) {
      try {
        setCachedProfile(JSON.parse(storedProfile) as CachedUserProfile);
      } catch {
        setCachedProfile(undefined);
      }
    }

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
        createdAt: decoded.createdAt
      });
    } catch {
      setUserId(undefined);
      setDecodedProfile({});
    } finally {
      setHasCheckedAuth(true);
    }
  }, []);

  const { data: user } = useUserProfile(userId, hasCheckedAuth);

  useEffect(() => {
    if (user) {
      console.log("Landlord profile object from API:", user);
      return;
    }

    if (cachedProfile) {
      console.log("Landlord profile object from cookie:", cachedProfile);
    }
  }, [user, cachedProfile]);

  const displayUser = user ?? cachedProfile;
  const displayFirstName =
    user?.first_name ?? cachedProfile?.first_name ?? decodedProfile.first_name ?? "";
  const displayLastName =
    user?.last_name ?? cachedProfile?.last_name ?? decodedProfile.last_name ?? "";
  const displayEmail =
    user?.email ?? cachedProfile?.email ?? decodedProfile.email ?? "";
  const displayPhone =
    user?.phone_no ?? cachedProfile?.phone_no ?? decodedProfile.phone_no ?? "";
  const displayAddress =
    user?.address ?? cachedProfile?.address ?? decodedProfile.address ?? "";
  const displayBio = user?.bio ?? cachedProfile?.bio ?? "";
  const displayMembershipYear = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : cachedProfile?.createdAt
      ? new Date(cachedProfile.createdAt).getFullYear()
      : "";
  const initials =
    `${displayFirstName[0] ?? ""}${displayLastName[0] ?? ""}`.trim() ||
    "U";

  return (
    <DashboardLayout>
      <section className="p-8 bg-[#F8F9FA] min-h-screen">
        <div className=" flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-[#162B4C]">My Profile</h2>
          <Link href="/landlord/edit-profile" className=" flex items-center gap-1.5 py-2.5 px-3.5 rounded-md bg-[#43A047] text-white">
            <SquarePen size={15} className=" text-md" />
            <span>Edit Profile</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-3xl p-6 md:p-8 mb-8 shadow-sm border border-gray-50 text-center md:text-left gap-6 md:gap-0">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="relative">
              {displayUser?.profileImage ? (
                <Image
                  src={displayUser.profileImage}
                  alt="User profile"
                  className="h-[50px] w-[50px] rounded-full object-cover"
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
                  <p className="font-bold text-[#162B4C]">{displayAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/*  */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
            <div className=" mb-10">
              <h4 className="text-xl font-semibold text-[#162B4C]">
                Business Details
              </h4>
            </div>

            <div className="flex flex-col  gap-8 mb-1">
              <div className="flex  gap-1.5">
                <div className="bg-[#E8F5E9] p-2 rounded-lg">
                  <Calendar size={25} className="text-gray-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-[#162B4C]">Memeber Since</p>
                  <p className="text-gray-500">
                    {displayMembershipYear ? `Since ${displayMembershipYear}` : "N/A"}
                  </p>
                </div>

              </div>

              <div className="flex gap-1">
                <div className="bg-[#E8F5E9] p-2 rounded-lg">
                  <Building2 size={25} className="text-gray-400" />
                </div>
                <div className=" flex flex-col gap-1">
                  <p className="text-sm font-bold text-[#162B4C]">Company Name</p>
                  <p className="text-gray-500">{displayEmail}</p>
                </div>

              </div>

              <div className="flex gap-1">
                <div className="bg-[#E8F5E9] p-2 rounded-lg">
                  <Shield size={25} className="text-gray-400" />
                </div>
                <div className=" flex flex-col gap-1">
                  <p className="text-sm font-bold text-[#162B4C]">Phone Number</p>
                  <p className="text-gray-500">{displayPhone}</p>
                </div>

              </div>
            </div>
          </div>

          {/* Featured Properties */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
            <div className=" mb-10">
              <h4 className="text-xl font-semibold text-[#162B4C]">
                Featured Properties
              </h4>
            </div>

            <div className="flex flex-col gap-8 mb-1">
              {properties?.rentals?.slice(0, 3).map((prop) => {
                if (!prop.images?.length) return null;

                return (
                  <div key={prop.id} className="flex gap-1.5">
                    <div>
                      <Image
                        src={prop.images[0]}
                        alt="Property Image"
                        className="h-[50px] w-[50px] rounded-lg object-cover"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-gray-900">{prop.title}</p>
                        <p className="text-xs text-gray-500">
                          {prop.location}
                        </p>
                        <p className="text-lg font-bold text-[#43A047] mt-1">${prop.price.toFixed(2)}/month</p>
                      </div>
                    </div>
                    <p className={`text-[9px] font-bold px-2 py-1 rounded-full ${getStatusStyle(prop.status)}`}>{prop.status}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
            <div className=" mb-10">
              <h4 className="text-xl font-semibold text-[#162B4C]">
                Recent Reviews
              </h4>
            </div>

            <div className="flex flex-col gap-8 mb-1">
              <div className="flex gap-1.5">
                <div className="bg-[#E8F5E9] p-2 rounded-lg">
                  <Calendar size={25} className="text-gray-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-[#162B4C]">Memeber Since</p>
                  <p className="text-gray-500">
                    {displayFirstName} {displayLastName}
                  </p>
                </div>

              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-[#162B4C]">Email</p>
                <p className="text-gray-500">{displayEmail}</p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-[#162B4C]">Phone Number</p>
                <p className="text-gray-500">{displayPhone}</p>
              </div>
            </div>
          </div>
        </div>

      </section>
    </DashboardLayout>

  )
}

export default page

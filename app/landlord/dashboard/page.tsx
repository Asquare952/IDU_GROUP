"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { rentalApi, Rental } from "@/app/api/features/rental";
import {
  DashMetrics,
  Inquiries,
} from "../../components/Dashboard/config/DashboardDatas";
import Cookies from "js-cookie";
import { useUserProfile } from "@/app/api/features/auth/auth.queries";
import { AuthResponse } from "@/app/api/features/auth/types";
import { readCachedProfile } from "@/app/api/features/auth/profile-cache";
import Image from "next/image";
import { PenLine, Trash2, Loader2 } from "lucide-react";
// import ReviewGraph from "@/public/assets/income-overview-graph.webp";
// import SnapshotGraph from "@/public/assets/tenants-activity-snapshot-graph.png";
import { getCurrentUserId } from "@/app/lib/auth";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

type HeaderUser = NonNullable<AuthResponse["user"]>;

type DecodedToken = {
  id?: string;
  sub?: string;
  userId?: string;
  _id?: string;
  full_name?: string;
};

export default function Page() {
  const [userId, setUserId] = useState<string>();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [cachedProfile, setCachedProfile] = useState<HeaderUser>();
  const [decodedProfile, setDecodedProfile] = useState<Partial<HeaderUser>>({});
  const router = useRouter();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchRentals();
  }, []);

  useEffect(() => {
    const token = Cookies.get("ACCESS_TOKEN");
    setCachedProfile(readCachedProfile() as HeaderUser | undefined);

    if (!token) {
      setHasCheckedAuth(true);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUserId(decoded.id ?? decoded.userId ?? decoded._id ?? decoded.sub);
      setDecodedProfile({
        full_name: decoded.full_name,
      });
    } catch {
      setUserId(undefined);
      setDecodedProfile({});
    } finally {
      setHasCheckedAuth(true);
    }
  }, []);

  const { data: user, isLoading } = useUserProfile(userId, hasCheckedAuth);
  const displayName =
    cachedProfile?.full_name ?? user?.full_name ?? decodedProfile.full_name ?? "";

  const fetchRentals = async () => {
    try {
      const data = await rentalApi.getAllRentals();
      const currentUserId = getCurrentUserId();

      setRentals(
        currentUserId
          ? data.filter((rental) => rental.UserId === currentUserId)
          : data,
      );
    } catch (error) {
      console.error("Failed to fetch rentals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "Delete property?",
      text: `You are about to delete "${title}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    setDeleteId(id);
    try {
      await rentalApi.deleteRental(id);
      setRentals((prev) => prev.filter((r) => r.id !== id));
      await Swal.fire({
        title: "Deleted!",
        text: "Property has been deleted.",
        icon: "success",
        confirmButtonColor: "#43A047",
      });
    } catch (error) {
      console.error("Failed to delete:", error);
      await Swal.fire({
        title: "Delete failed",
        text: "Failed to delete listing. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/landlord/edit-listing/${id}`);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-50 text-[#43A047] border border-green-100";
      case "pending":
        return "bg-amber-50 text-[#FFCD36] border border-amber-100";
      case "rented":
        return "bg-blue-50 text-[#4B8EFF] border border-blue-100";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  // Calculate metrics from real data
  const activeListings = rentals.filter((r) => r.status === "available").length;
  const totalViews = rentals.reduce(
    (acc, r) => acc + Math.floor(Math.random() * 1000),
    0,
  ); // Replace with real view count when available

  return (
    <DashboardLayout>
      <section className="flex flex-col gap-6 p-4 md:p-8 bg-[#F8FAFC]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-extrabold text-[#162B4C]">
              Welcome back, {displayName}
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium">
              Here is how your properties are performing today.
            </p>
          </div>
          <select className="w-full md:w-auto bg-white border border-slate-200 py-2 px-4 rounded-xl shadow-sm outline-none">
            <option>Last 5 months</option>
          </select>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {DashMetrics.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm"
            >
              <div className="flex flex-col gap-2">
                <div className="p-2 bg-[#43A047] w-fit rounded-lg">
                  <Image
                    src={item.image}
                    width={20}
                    height={20}
                    alt=""
                    className="saturate-150"
                  />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">
                    {item.name}
                  </p>
                  <h2 className="text-xl md:text-2xl font-black text-[#162B4C]">
                    {item.name === "Active listings"
                      ? activeListings
                      : item.figure}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Your Listings Table - REAL DATA */}
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-[#162B4C]">Your Listings</h3>
              <button
                onClick={() => router.push("/landlord/upload-listings")}
                className="text-[#43A047] text-xs font-bold hover:underline"
              >
                + Add New
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 size={24} className="animate-spin text-[#43A047]" />
              </div>
            ) : rentals.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p>No listings yet</p>
                <button
                  onClick={() => router.push("/landlord/upload-listings")}
                  className="text-[#43A047] text-sm font-semibold mt-2 hover:underline"
                >
                  Create your first listing
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-slate-50/50">
                    <tr className="text-slate-400 text-[10px] uppercase font-bold">
                      <th className="px-6 py-4">Property</th>
                      <th className="px-4 py-4 text-center">Status</th>
                      <th className="px-4 py-4 text-center">Price</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {rentals.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 relative rounded-lg overflow-hidden shrink-0 bg-slate-100">
                              {item.images && item.images.length > 0 ? (
                                <Image
                                  src={item.images[0]}
                                  fill
                                  className="object-cover"
                                  alt={item.title}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-400">
                                  No Img
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs text-[#3D3F42] truncate w-[120px]">
                                {item.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 truncate w-[120px]">
                                {item.location}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`text-[9px] font-bold px-2 py-1 rounded-full capitalize ${getStatusStyle(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-slate-600 text-xs">
                          ₦{Number(item.price).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(item.id)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <PenLine size={14} className="text-slate-400" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.title)}
                              disabled={deleteId === item.id}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deleteId === item.id ? (
                                <Loader2
                                  size={14}
                                  className="animate-spin text-red-400"
                                />
                              ) : (
                                <Trash2 size={14} className="text-red-400" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Inquiries Sidebar */}
          <div className="bg-white p-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-[#162B4C] mb-6">Recent Inquiries</h3>
            <div className="space-y-6">
              {Inquiries.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                      {item.image ? (
                        <Image src={item.image} fill alt="" />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">No image</div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#3D3F42]">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate w-[120px] md:w-auto">
                        {item.message}
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#43A047] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {item.figure}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Income Overview */}
          {/* <div className="bg-white p-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="font-bold text-[#162B4C]">Income Overview</h3>
                <p className="text-xs text-slate-400">
                  Rental income performance over time
                </p>
              </div>
              <div className="flex items-center gap-4">
                <h4 className="text-xl font-black text-[#162B4C]">$20,000</h4>
                <span className="bg-green-50 text-[#43A047] px-2 py-1 rounded-lg text-[10px] font-bold">
                  +12%
                </span>
              </div>
            </div>
            <div className="mt-4">
              <Image
                src={ReviewGraph}
                width={600}
                height={250}
                alt="Income Graph"
                className="w-full h-auto"
              />
            </div>
          </div> */}

          {/* Tenant Activity Snapshots */}
          {/* <div className="bg-white p-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-6">
            <h3 className="font-bold text-[#162B4C]">
              Tenants Activity Snapshots
            </h3>
            <div className="space-y-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <h4 className="font-bold text-xs text-[#3D3F42]">
                    Occupancy rate:
                  </h4>
                  <p className="text-[10px] text-slate-400 max-w-[150px]">
                    Properties rented this month
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src={SnapshotGraph}
                    width={50}
                    height={50}
                    alt="Graph"
                  />
                  <div className="text-center">
                    <p className="text-xs font-bold text-[#43A047]">+12%</p>
                    <p className="text-[8px] text-slate-400">vs last</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#3D3F42]">
                    Tenant Activity:
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Track active engagement
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="bg-[#43A047] px-4 py-2 rounded-xl text-white font-bold text-sm shadow-sm">
                    35
                  </div>
                  <div className="bg-[#9EFF71] px-4 py-2 rounded-xl text-white font-bold text-sm shadow-sm">
                    12
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </section>
    </DashboardLayout>
  );
}

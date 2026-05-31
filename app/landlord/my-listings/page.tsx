"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import { rentalApi, useDeleteRental, Rental } from "@/app/api/features/rental";
import { getCurrentUserId } from "@/app/lib/auth";
import { getPropertyDetailsPath } from "@/app/lib/property-routes";
import { Plus, MapPin, Home, Loader2 } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";

const tabs = ["All Properties", "Available", "Pending", "Rented"] as const;

const getStatusClasses = (status: string) => {
  switch (status) {
    case "available":
      return "bg-[#43A047] text-white";
    case "pending":
      return "bg-[#FF8A00] text-white";
    case "rented":
      return "bg-[#162B4C] text-white";
    default:
      return "bg-slate-200 text-slate-700";
  }
};

const filterRentalsByTab = (
  rentals: Rental[],
  activeTab: (typeof tabs)[number],
): Rental[] => {
  if (activeTab === "All Properties") {
    return rentals;
  }

  return rentals.filter(
    (rental) => rental.status.toLowerCase() === activeTab.toLowerCase(),
  );
};

const Page = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]>("All Properties");
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    mutate: deleteRentalMutation,
    isPending: isDeletingRental,
    variables: deletingRentalId,
  } = useDeleteRental();

  const handleDeleteRental = async (rental: Rental) => {
    const result = await Swal.fire({
      title: "Delete property?",
      text: `You are about to delete "${rental.title}". This action cannot be undone.`,
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

    deleteRentalMutation(rental.id);
  };

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const data = await rentalApi.getAllRentals();
        const currentUserId = getCurrentUserId();

        setRentals(
          currentUserId
            ? data.filter((rental) => rental.UserId === currentUserId)
            : data,
        );
      } catch (err: any) {
        console.error("Failed to fetch landlord rentals:", err);
        setError(
          err.response?.data?.message || "Failed to load your property listings.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const filteredRentals = filterRentalsByTab(rentals, activeTab);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-[#FBFBFC] min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#162B4C] tracking-tight">
              My Properties
            </h1>
            <p className="text-gray-400 text-[13px] mt-0.5">
              Manage your property listings
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/landlord/upload-listings")}
            className="bg-[#43A047] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] flex items-center gap-2 hover:bg-green-700 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus size={18} /> Add New Property
          </button>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all border ${activeTab === tab
                  ? "bg-[#43A047] text-white border-[#43A047]"
                  : "bg-white text-gray-400 border-gray-100 hover:bg-gray-50"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[#43A047]" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-500 text-sm rounded-2xl p-4">
            {error}
          </div>
        ) : filteredRentals.length === 0 ? (
          <div className="bg-white rounded-[1.2rem] border border-gray-100 p-10 text-center">
            <p className="text-gray-500 font-medium">
              No properties found for this filter yet.
            </p>
            <button
              type="button"
              onClick={() => router.push("/landlord/upload-listings")}
              className="mt-4 text-[#43A047] font-semibold hover:underline"
            >
              Upload a new listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRentals.map((rental) => (
              <div
                key={rental.id}
                className="bg-white rounded-[1.2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300"
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  {rental.images[0] ? (
                    <Image
                      src={rental.images[0]}
                      alt={rental.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
                      No image
                    </div>
                  )}

                  <div
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider shadow-sm ${getStatusClasses(
                      rental.status,
                    )}`}
                  >
                    {rental.status}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-[15px] text-[#162B4C] mb-0.5">
                    {rental.title}
                  </h3>
                  <p className="flex items-center gap-1 text-gray-400 text-[11px] mb-3">
                    <MapPin size={11} /> {rental.location}
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center gap-1.5 text-[#43A047] text-[11px] font-semibold capitalize">
                      <Home size={13} className="text-[#43A047]" />
                      {rental.propertyType}
                    </span>
                    <span className="text-[#43A047] text-[11px] font-semibold capitalize">
                      {rental.priceType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 pt-3.5 gap-3">
                    <div>
                      <p className="text-gray-300 text-[9px] font-bold uppercase">
                        Rent
                      </p>
                      <p className="text-[#43A047] font-bold text-base">
                        N{Number(rental.price).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => router.push(`/landlord/edit-property/${rental.id}`)}
                        className="px-3 py-1.5 border border-gray-100 rounded-lg text-gray-500 text-[11px] font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRental(rental)}
                        disabled={
                          isDeletingRental && deletingRentalId === rental.id
                        }
                        className="px-3 py-1.5 border bg-red-600 rounded-lg text-white text-[11px] font-bold hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isDeletingRental && deletingRentalId === rental.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push(getPropertyDetailsPath(rental))}
                        className="px-3 py-1.5 bg-[#43A047] text-white rounded-lg text-[11px] font-bold hover:bg-green-700 transition-all shadow-sm cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Page;

"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Eye,
  Trash2,
  Lock,
} from "lucide-react";
import {
  useAdminRentals,
  useDeleteAdminRental,
  useLockedAdminRentals,
} from "@/app/api/features/admin";
import { getPropertyDetailsPath } from "@/app/lib/property-routes";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const filterTabs = [
  { label: "All Properties", value: "all" },
  { label: "Available", value: "available" },
  { label: "Occupied", value: "occupied" },
  { label: "Under Review", value: "under-review" },
] as const;

const getPropertyStatus = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "available") {
    return "Available";
  }

  if (normalizedStatus === "pending") {
    return "Under Review";
  }

  return "Occupied";
};

const getStatusStyles = (status: ReturnType<typeof getPropertyStatus>) => {
  switch (status) {
    case "Available":
      return "bg-blue-50 text-blue-600";
    case "Occupied":
      return "bg-green-50 text-green-600";
    case "Under Review":
      return "bg-orange-50 text-orange-600";
    default:
      return "bg-gray-50 text-gray-600";
  }
};

const Page = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: rentals = [], isLoading, isError, error } = useAdminRentals();
  const { data: lockedRentals = [] } = useLockedAdminRentals();
  const { mutate: deleteRental, isPending: isDeletingRental } =
    useDeleteAdminRental();

  const stats = useMemo(() => {
    const available = rentals.filter(
      (rental) => getPropertyStatus(rental.status) === "Available",
    ).length;
    const occupied = rentals.filter(
      (rental) => getPropertyStatus(rental.status) === "Occupied",
    ).length;
    const underReview = rentals.filter(
      (rental) => getPropertyStatus(rental.status) === "Under Review",
    ).length;

    return {
      total: rentals.length,
      available,
      occupied,
      underReview,
    };
  }, [rentals]);

  const filteredProperties = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return rentals.filter((rental) => {
      const computedStatus = getPropertyStatus(rental.status);
      const matchesFilter =
        activeFilter === "all" ||
        computedStatus.toLowerCase().replace(/\s+/g, "-") === activeFilter;
      const matchesSearch =
        !query ||
        rental.title.toLowerCase().includes(query) ||
        rental.location.toLowerCase().includes(query) ||
        rental.landlordName.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, rentals, searchQuery]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Property Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Manage all properties on the platform
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
            <p className="text-xs md:text-sm text-gray-500 mb-1">
              Total Properties
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">
              {stats.total.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
            <p className="text-xs md:text-sm text-gray-500 mb-1">Available</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">
              {stats.available.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
            <p className="text-xs md:text-sm text-gray-500 mb-1">Occupied</p>
            <p className="text-xl md:text-2xl font-bold text-blue-600">
              {stats.occupied.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
            <p className="text-xs md:text-sm text-gray-500 mb-1">
              Currently Locked
            </p>
            <p className="text-xl md:text-2xl font-bold text-orange-500">
              {lockedRentals.length.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search properties by name, location, or landlord..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg md:rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#43A047] focus:border-transparent"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg md:rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => {
              const count =
                tab.value === "all"
                  ? stats.total
                  : tab.value === "available"
                    ? stats.available
                    : tab.value === "occupied"
                      ? stats.occupied
                      : stats.underReview;

              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === tab.value
                      ? "bg-[#43A047] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                  <span className="ml-1.5 text-xs opacity-80">
                    ({count.toLocaleString()})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm text-gray-500">
            Loading properties...
          </div>
        ) : isError ? (
          <div className="text-center py-12 bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm text-red-500">
            {error.message || "Unable to load properties."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {filteredProperties.map((property) => {
              const status = getPropertyStatus(property.status);
              const propertyPath = getPropertyDetailsPath(property);

              return (
                <div
                  key={property.id}
                  className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-40 md:h-48 w-full bg-slate-100">
                    {property.images[0] ? (
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-4 md:p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900">
                        {property.title}
                      </h3>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusStyles(
                          status,
                        )}`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <MapPin size={14} className="flex-shrink-0" />
                      <span>{property.location}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                      <span className="font-semibold text-gray-900">
                        N{Number(property.price).toLocaleString()}/{property.priceType}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span>{property.images.length} images</span>
                      <span className="text-gray-300">•</span>
                      <span>{property.lockedByCount} lock(s)</span>
                    </div>

                    <p className="text-sm text-gray-500">
                      Landlord: {property.landlordName}
                    </p>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        onClick={() => router.push(propertyPath)}
                      >
                        <Eye size={14} />
                        View
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg text-sm font-medium transition-colors cursor-default">
                        <Lock size={14} />
                        {property.lockedByCount} Locked
                      </button>
                      <button
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors cursor-pointer"
                        disabled={isDeletingRental}
                        onClick={async () => {
                          const result = await Swal.fire({
                            title: "Delete property?",
                            text: `You are about to delete "${property.title}". This action cannot be undone.`,
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

                          deleteRental(property.id, {
                            onSuccess: () => {
                              toast.success("Property deleted successfully.");
                            },
                            onError: (mutationError) => {
                              toast.error(
                                mutationError.message ||
                                  "Unable to delete this property.",
                              );
                            },
                          });
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && !isError && filteredProperties.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm md:text-base">
              No properties found matching your criteria.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-sm text-gray-500">
            Showing {filteredProperties.length.toLocaleString()} of{" "}
            {stats.total.toLocaleString()} properties
          </p>
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            Live data from `/admin/rentals`
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Page;

"use client";

import React, { useState, useMemo } from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  properties,
  propertyStats,
  filterTabs,
  Property,
} from "@/app/super-admin/properties/data/properties";

const getStatusStyles = (status: Property["status"]) => {
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
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProperties = useMemo(() => {
    let filtered = properties;

    if (activeFilter !== "all") {
      filtered = filtered.filter(
        (p) => p.status.toLowerCase().replace(" ", "-") === activeFilter,
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query) ||
          p.landlord.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [activeFilter, searchQuery]);

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
              {propertyStats.total.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
            <p className="text-xs md:text-sm text-gray-500 mb-1">Available</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">
              {propertyStats.available.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
            <p className="text-xs md:text-sm text-gray-500 mb-1">Occupied</p>
            <p className="text-xl md:text-2xl font-bold text-blue-600">
              {propertyStats.occupied.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
            <p className="text-xs md:text-sm text-gray-500 mb-1">
              Under Review
            </p>
            <p className="text-xl md:text-2xl font-bold text-orange-500">
              {propertyStats.underReview.toLocaleString()}
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg md:rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#43A047] focus:border-transparent"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg md:rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
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
                {tab.count !== null && (
                  <span className="ml-1.5 text-xs opacity-80">
                    ({tab.count.toLocaleString()})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className={`h-40 md:h-48 ${property.image} w-full`} />

              {/* Content */}
              <div className="p-4 md:p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">
                    {property.title}
                  </h3>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusStyles(
                      property.status,
                    )}`}
                  >
                    {property.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <MapPin size={14} className="flex-shrink-0" />
                  <span>{property.location}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {property.price}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span>{property.imageCount} images</span>
                  <span className="text-gray-300">•</span>
                  <span>{property.tenantCount} tenant(s)</span>
                </div>

                <p className="text-sm text-gray-500">
                  Landlord: {property.landlord}
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                    <Eye size={14} />
                    View
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm md:text-base">
              No properties found matching your criteria.
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-sm text-gray-500">
            Showing 1-{filteredProperties.length} of{" "}
            {propertyStats.total.toLocaleString()} properties
          </p>
          <div className="flex items-center gap-1.5">
            <button
              className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === 1
                    ? "bg-[#43A047] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Page;

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HiOutlineHeart } from "react-icons/hi";
import { CheckCircle, Lock } from "lucide-react";
import { useFetchProperties } from "@/app/api/features/property";
import { useLikeRental } from "@/app/api";
import { containerVariants, itemVariants } from "@/app/components/animation";
import { getPropertyDetailsPath } from "@/app/lib/property-routes";
import { hasAccessToken } from "@/app/lib/auth";

const getStatusStyle = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-50 text-[#43A047] border border-green-100";
    case "pending":
      return "bg-amber-50 text-[#FFCD36] border border-amber-100";
    case "rented":
    case "locked":
      return "bg-blue-50 text-[#4B8EFF] border border-blue-100";
    default:
      return "bg-gray-50 text-gray-500 border border-gray-100";
  }
};

const Listing = () => {
  const router = useRouter();
  const isLoggedIn = hasAccessToken();
  const { mutate: likeRental } = useLikeRental();
  const {
    data: properties = [],
    isLoading,
    isError,
    error,
  } = useFetchProperties();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-56 md:h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div id="listing">
      <div className="mb-20 mx-auto max-w-360 px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 mx-auto text-center">
          <span className="text-green-600 font-bold text-base md:text-xl tracking-wide">
            Featured listings
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4 text-[#1A1C1F]">
            Simple. Transparent. Stress-free
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg">
            {isLoggedIn
              ? "Explore top-rated rentals and properties from trusted landlords in your area"
              : "Log in to explore top-rated rentals and properties from trusted landlords"}
          </p>
        </div>

        {!isLoggedIn ? (
          <div className="text-center py-8 mb-8">
            <p className="text-gray-400 text-base mb-4">
              Sign in to view available listings
            </p>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#34A853] text-white font-semibold py-3 px-8 rounded-full shadow-lg"
              >
                Log In to Browse
              </motion.button>
            </Link>
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            <p>{error.message || "Unable to load listings."}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-base">No listings available</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {properties.slice(0, 9).map((item, i) => {
              const propertyPath = getPropertyDetailsPath(item);

              return (
                <motion.div
                  key={item.id}
                  custom={i}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-56 md:h-64 w-full overflow-hidden group">
                    <Link href={propertyPath} className="block h-full w-full">
                      {item.images && item.images.length > 0 ? (
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          className="object-cover rounded-3xl p-2 transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded-3xl flex items-center justify-center">
                          <span className="text-gray-400 text-base md:text-sm">
                            No Image
                          </span>
                        </div>
                      )}
                    </Link>

                    <div
                      className={`absolute top-5 left-5 z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize shadow-sm ${getStatusStyle(
                        item.status,
                      )}`}
                    >
                      <CheckCircle size={12} />
                      {item.status}
                    </div>

                    <button
                      type="button"
                      className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#162B4C] shadow-sm transition hover:text-red-500 cursor-pointer"
                      aria-label={`Save ${item.title}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (!hasAccessToken()) {
                          router.push("/login");
                          return;
                        }

                        likeRental(String(item.id));
                      }}
                    >
                      <HiOutlineHeart
                        size={20}
                        className="transition-all duration-200"
                      />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-gray-900 font-bold text-lg md:text-xl">
                          N{Number(item.price).toLocaleString()}
                          <span className="text-sm font-normal text-gray-400">
                            / {item.priceType}
                          </span>
                        </p>
                        <h3 className="text-gray-800 font-semibold text-lg">
                          {item.title}
                        </h3>
                      </div>

                      <Link href={propertyPath}>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          whileHover={{ scale: 1.05 }}
                          className="bg-[#E8F5E9] text-[#43A047] text-sm md:text-xs font-bold px-4 py-1.5 rounded-full cursor-pointer"
                        >
                          View
                        </motion.button>
                      </Link>
                    </div>

                    <p className="text-gray-400 text-base md:text-sm mb-4 leading-relaxed">
                      {item.description || "No description provided yet."}
                    </p>

                    <div className="flex flex-wrap gap-4 border-t border-gray-50 pt-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/shawer.png"
                          alt="property type"
                          width={16}
                          height={16}
                        />
                        <span className="text-sm md:text-xs text-gray-500 font-medium">
                          {item.propertyType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Image
                          src="/bed.png"
                          alt="location"
                          width={16}
                          height={16}
                        />
                        <span className="text-sm md:text-xs text-gray-500 font-medium">
                          {item.location}
                        </span>
                      </div>
                    </div>

                    {!isLoggedIn && (
                      <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-400"
                      >
                        <Lock size={14} />
                        Sign in to continue
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <div className="flex justify-center w-full">
          <Link href="/tenant/homepage">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#34A853] hover:bg-green-700 text-white font-semibold text-base py-2 px-8 rounded-full transition duration-300 mt-8 cursor-pointer shadow-lg"
            >
              browse Listings <span className="text-sm"> &rarr;</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Listing;

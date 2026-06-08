"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import { CheckCircle, Lock } from "lucide-react";
import { useFetchProperties } from "@/app/api/features/property";
import { useLikeRental, useUnlikeRental } from "@/app/api";
import { containerVariants, itemVariants } from "@/app/components/animation";
import { getPropertyDetailsPath } from "@/app/lib/property-routes";
import { hasAccessToken } from "@/app/lib/auth";
import { House, MapPin } from 'lucide-react';

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
  const [likedPropertyIds, setLikedPropertyIds] = useState<Set<string>>(
    () => new Set(),
  );
  const hasInitializedRef = useRef(false);
  const { mutate: likeRental } = useLikeRental();
  const { mutate: unlikeRental } = useUnlikeRental();
  const {
    data: properties = [],
    isLoading,
    isError,
    error,
  } = useFetchProperties({ recentOnly: true });

  useEffect(() => {
    if (properties.length > 0 && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setLikedPropertyIds(
        new Set(
          properties
            .filter((property) => property.liked)
            .map((property) => String(property.id)),
        ),
      );
    }
  }, []);

  const handleLikeToggle = (propertyId: string) => {
    if (!hasAccessToken()) {
      router.push("/login");
      return;
    }

    const wasLiked = likedPropertyIds.has(propertyId);

    setLikedPropertyIds((previousIds) => {
      const nextIds = new Set(previousIds);

      if (wasLiked) {
        nextIds.delete(propertyId);
      } else {
        nextIds.add(propertyId);
      }

      return nextIds;
    });

    const mutation = wasLiked ? unlikeRental : likeRental;

    mutation(propertyId, {
      onError: () => {
        setLikedPropertyIds((previousIds) => {
          const nextIds = new Set(previousIds);

          if (wasLiked) {
            nextIds.add(propertyId);
          } else {
            nextIds.delete(propertyId);
          }

          return nextIds;
        });
      },
    });
  };

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
            Explore recent rentals and properties from trusted landlords in your
            area.
          </p>
        </div>

        {isError ? (
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
            {properties.slice(0, 10).map((item, i) => {
              const propertyPath = getPropertyDetailsPath(item);
              const viewHref = isLoggedIn ? propertyPath : "/login";
              const isLiked = likedPropertyIds.has(String(item.id));

              return (
                <motion.div
                  key={item.id}
                  onClick={() => router.push(getPropertyDetailsPath(item))}
                  custom={i}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-56 md:h-64 w-full overflow-hidden group">
                    <div className="block h-full w-full">
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
                    </div>

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
                        handleLikeToggle(String(item.id));
                      }}
                    >
                      {isLiked ? (
                        <HiHeart
                          size={22}
                          className="text-red-500 transition-all duration-200"
                        />
                      ) : (
                        <HiOutlineHeart
                          size={22}
                          className="transition-all duration-200"
                        />
                      )}
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


                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-[#E8F5E9] text-[#43A047] text-sm md:text-xs font-bold px-4 py-1.5 rounded-full cursor-pointer"
                      >
                        View
                      </motion.button>

                    </div>

                    <p className="text-gray-400 text-base md:text-sm mb-4 leading-relaxed">
                      {item.description || "No description provided yet."}
                    </p>

                    <div className="flex flex-wrap gap-4 border-t border-gray-50 pt-4">
                      <div className="flex items-center gap-2">
                        <House size={16} />
                        <span className="text-sm md:text-xs text-gray-500 font-medium">
                          {item.propertyType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span className="text-sm md:text-xs text-gray-500 font-medium">
                          {item.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <div className="flex justify-center w-full">
          <Link href="/properties">
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

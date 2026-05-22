"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import { useFetchProperties } from "@/app/api/features/property";
import { useLikeRental } from "@/app/api";
import { containerVariants, itemVariants } from "@/app/components/animation";
import { getPropertyDetailsPath } from "@/app/lib/property-routes";
import { hasAccessToken } from "@/app/lib/auth";
import { CheckCircle, Lock, Heart } from "lucide-react";


const Listing = () => {
  const router = useRouter();
  const { mutate: likeRental } = useLikeRental();

  const {
    data: properties = [],
    isLoading,
    isError,
    error,
  } = useFetchProperties();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-50 text-[#43A047] border border-green-100";
      case "pending":
        return "bg-amber-50 text-[#FFCD36] border border-amber-100";
      case "rented":
        return "bg-blue-50 text-[#4B8EFF] border border-blue-100";
      case "locked":
        return "bg-blue-50 text-[#4B8EFF] border border-blue-100";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  return (
    <div id="listing">
      <div className="mb-20 mx-auto max-w-360 px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 mx-auto text-center">
          <span className="text-green-600 font-bold text-xl tracking-wide">
            Featured listings
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-[#1A1C1F]">
            Simple. Transparent. Stress-free
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Explore top-rated rentals and properties from trusted landlords in your area
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            <p>{error.message || "Unable to load listings."}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No listings available</p>
          </div>
        ) : (

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {properties.slice(0, 9).map((item, i) => (
              <motion.div
                key={item.id}
                custom={i}
                variants={itemVariants}
                whileHover={{ y: -10 }}

                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 w-full overflow-hidden group">

                  {item.images && item.images.length > 0 ? (
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      className="object-cover rounded-3xl p-2 transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-3xl flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                  {item.status === "available" && <div className="absolute top-5 left-8 bg-[#4CAF50] px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-2 shadow-lg capitalize">
                    <CheckCircle size={14} /> {item.status}
                  </div>}
                  {item.status === "rented" && <div className="absolute top-5 left-8 bg-[#4CAF50] px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-2 shadow-lg capitalize">
                    <CheckCircle size={14} /> {item.status}
                  </div>}
                  {item.status === "pending" && <div className="absolute top-5 left-8 bg-[#4CAF50] px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-2 shadow-lg capitalize">
                    <CheckCircle size={14} /> {item.status}
                  </div>}
                  {item.status === "locked" && <div className="absolute top-5 left-8 bg-[#4CAF50] px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-2 shadow-lg capitalize">
                    <Lock size={14} /> {item.status}
                  </div>}

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
                      likeRental(String(item.id))
                    }}
                  >
                    {item.liked === true ? <Heart size={20} className="transition-all duration-200 text-red-500" /> : <HiOutlineHeart size={20} className="transition-all duration-200 text-gray-500" />}
                    {/* <HiOutlineHeart size={20} className={`transition-all duration-200 fill-current ${item.liked === true ? "text-red-500" : ""}`} /> */}
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-gray-900 font-bold text-xl">
                        ₦{Number(item.price).toLocaleString()}
                        <span className="text-sm font-normal text-gray-400">
                          / {item.priceType}
                        </span>
                      </p>
                      <h3 className="text-gray-800 font-semibold text-lg">
                        {item.title}
                      </h3>
                    </div>


                    <Link href={getPropertyDetailsPath(item)}>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-[#E8F5E9] text-[#43A047] text-xs font-bold px-4 py-1.5 rounded-full cursor-pointer"
                      >
                        View
                      </motion.button>
                    </Link>

                  </div>

                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-4 border-t border-gray-50 pt-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/shawer.png"
                        alt="bath"
                        width={16}
                        height={16}
                      />
                      <span className="text-xs text-gray-500 font-medium">
                        {item.propertyType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Image src="/bed.png" alt="bed" width={16} height={16} />
                      <span className="text-xs text-gray-500 font-medium">
                        {item.location}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

            ))}
          </motion.div>
        )}

        <div className="flex justify-center w-full">
          <Link href="/properties">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#34A853] hover:bg-green-700 text-white font-semibold py-2 px-8 rounded-full transition duration-300 mt-8 cursor-pointer shadow-lg"
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

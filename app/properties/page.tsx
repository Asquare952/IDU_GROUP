"use client";
import React, { useState } from "react";
import propertiesLocal from "@/app/components/properties";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const CATEGORIES = ["All", "Bungalow", "Duplex", "Apartment"];

export default function AllPropertiesPage() {
  const [tempSearch, setTempSearch] = useState("");
  const [finalSearch, setFinalSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties-list", finalSearch, selectedCategory],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const allProps = propertiesLocal as any[];

      return allProps.filter((item) => {
        const searchTerm = finalSearch.toLowerCase().trim();
        const selectedCat = selectedCategory.toLowerCase().trim();

        const itemTitle = (item.title || "").toLowerCase();
        const itemCat = (item.category || "").toLowerCase();
        const matchesSearch =
          searchTerm === "" || itemTitle.includes(searchTerm);

        const matchesCategory =
          selectedCategory === "All" || itemCat === selectedCat;

        return matchesSearch && matchesCategory;
      });
    },
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6 md:p-12 lg:p-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row gap-4 bg-white p-3 rounded-[32px] shadow-sm mb-6 items-center">
            <div className="relative flex-1 w-full">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search property name (e.g. Bungalow)..."
                className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-[24px] outline-none text-gray-700"
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
              />
            </div>

            {/* <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-gray-100 px-10 py-4 rounded-[24px] font-bold text-gray-600 outline-none cursor-pointer pr-12"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                size={18}
              />
            </div> */}

            <button
              onClick={() => setFinalSearch(tempSearch)}
              className="w-full md:w-auto px-10 py-4 bg-[#4CAF50] text-white rounded-[24px] font-bold hover:bg-[#43A047] transition-all active:scale-95"
            >
              Search
            </button>
          </div>
          <div className="flex gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setFinalSearch(tempSearch);
                }}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#4CAF50] text-white shadow-lg shadow-green-100"
                    : "bg-white text-gray-500 border border-gray-100 hover:border-[#4CAF50]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-[35px] overflow-hidden shadow-sm border border-gray-100 p-2"
                >
                  {/* Image Skeleton */}
                  <div className="relative h-64 w-full bg-gray-100 animate-pulse rounded-[28px]" />
                  <div className="p-5 pt-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-3 w-2/3">
                        <div className="h-6 w-24 bg-gray-100 animate-pulse rounded-md" />{" "}
                        {/* Price */}
                        <div className="h-5 w-full bg-gray-50 animate-pulse rounded-md" />{" "}
                        {/* Title */}
                      </div>
                      <div className="h-8 w-16 bg-gray-100 animate-pulse rounded-full" />{" "}
                      {/* Button */}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-3 w-3 bg-gray-100 animate-pulse rounded-full" />
                      <div className="h-3 w-32 bg-gray-50 animate-pulse rounded-md" />{" "}
                      {/* Location */}
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="h-3 w-full bg-gray-50/50 animate-pulse rounded-md" />
                      <div className="h-3 w-4/5 bg-gray-50/50 animate-pulse rounded-md" />
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                      <div className="h-4 w-16 bg-gray-50 animate-pulse rounded-md" />
                      <div className="h-4 w-16 bg-gray-50 animate-pulse rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {properties && properties.length > 0 ? (
                  properties.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={item.id}
                      className="bg-white rounded-[35px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="relative h-64 w-full overflow-hidden group">
                        <Image
                          src={item.img}
                          alt={item.title}
                          fill
                          className="object-cover rounded-3xl p-2 transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-gray-900 font-bold text-xl">
                              {item.price}
                              <span className="text-sm font-normal text-gray-400">
                                / 2 days ago
                              </span>
                            </p>
                            <h3 className="text-gray-800 font-semibold text-lg">
                              {item.title}
                            </h3>
                          </div>
                          <Link href={`/properties/${item.id}`}>
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
                          Cozy rooms, large jacuzzi, spacious kitchen.
                          Convenient lifestyle living.
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
                              2 bathrooms
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Image
                              src="/bed.png"
                              alt="bed"
                              width={16}
                              height={16}
                            />
                            <span className="text-xs text-gray-500 font-medium">
                              5 bedrooms
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-gray-400 text-lg font-medium">
                      No results found.
                    </p>
                    <button
                      onClick={() => {
                        setFinalSearch("");
                        setTempSearch("");
                      }}
                      className="mt-4 text-[#4CAF50] font-bold hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

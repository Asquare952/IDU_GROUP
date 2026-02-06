"use client";
import React, { useState } from "react";
import properties from "@/app/components/properties";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";

export default function AllPropertiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredProperties = properties.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 lg:p-20">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Explore All Listings
          </h1>
          <p className="text-gray-500 mb-8 font-medium">
            Discover {properties.length} verified properties waiting for you.
          </p>

          <div className="flex flex-col md:flex-row gap-4 bg-white p-3 rounded-[32px] shadow-sm border border-gray-100 items-center">
            <div className="relative w-full flex-1">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by property name (e.g., Bungalow)..."
                className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-[24px] outline-none focus:ring-2 focus:ring-[#4CAF50]/20 transition-all text-gray-700"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="hidden md:flex items-center gap-2 px-6 py-4 bg-gray-100 text-gray-600 rounded-[24px] font-bold hover:bg-gray-200 transition-all cursor-pointer">
              <SlidersHorizontal size={18} />
              Filters
            </button>

            <button className="w-full md:w-auto px-10 py-4 bg-[#4CAF50] text-white rounded-[24px] font-bold hover:bg-[#43A047] shadow-lg shadow-green-100 transition-all cursor-pointer">
              Search
            </button>
          </div>
        </div>
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProperties.length > 0 ? (
              filteredProperties.map((item) => (
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
                            / year
                          </span>
                        </p>
                        <h3 className="text-gray-800 font-semibold text-lg flex items-center gap-1">
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

                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-4">
                      <MapPin size={12} className="text-[#4CAF50]" />
                      Lagos, Nigeria
                    </div>

                    <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">
                      Cozy rooms, large jacuzzi, spacious kitchen. Convenient
                      lifestyle living at its best.
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
                          2 Bathrooms
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
                          5 Bedrooms
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 text-lg">
                  No properties found matching "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-[#4CAF50] font-bold underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

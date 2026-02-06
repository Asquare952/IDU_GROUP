"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import properties from "@/app/components/properties";
import { containerVariants, itemVariants } from "@/app/components/animation";

const Listing = () => {
  return (
    <section id="listing">
      <div className="mb-20 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 mx-auto text-center">
          <span className="text-green-600 font-bold text-xl tracking-wide">
            Featured listings
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-[#1A1C1F]">
            Simple. Transparent. Stress-free
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Explore top-rated rentals and properties from trusted landlords in
            your area
          </p>
        </div>

        {/* Grid Section */}
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
                        {" "}
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
                  Cozy rooms, large jacuzzi, spacious kitchen. Convenient
                  lifestyle living.
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
                    <Image src="/bed.png" alt="bed" width={16} height={16} />
                    <span className="text-xs text-gray-500 font-medium">
                      5 bedrooms
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

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
    </section>
  );
};

export default Listing;

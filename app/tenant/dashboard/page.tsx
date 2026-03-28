"use client"

import { DashMetrics, Safetytips } from "@/app/components/Tenant-Dashboard/config/DashboardDatas"
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";
import Image from "next/image";
import { motion } from "framer-motion";
import properties from "@/app/components/properties";
import { containerVariants, itemVariants } from "@/app/components/animation";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

const page = () => {
  const router = useRouter();
  const isLoggedIn = false;
  return (
    <DashboardLayout>
      <section className=" flex flex-col gap-8 px-2.5 py-2.5">
        <div className="flex h-full">
          <div className="flex-8 card-bg rounded-tl-2xl rounded-bl-2xl"></div>
          <div className=" flex flex-col gap-5 flex-9 shadow-xl rounded-tr-2xl rounded-br-2xl bg-white p-4">
            <div className="flex items-center gap-1.5 mt-3">
              <div className=" bg-[#43A047] text-white py-1 px-1.5 rounded-lg">
                🔒 <span className=" text-sm font-medium">Active Lock</span>
              </div>
              <div className=" ">
                <span className="text-sm bg-red-200 py-1.5 px-1.5 rounded-lg text-red-700">
                  36 hours remaining
                </span>
              </div>
            </div>

            <div className=" flex flex-col gap-1.5">
              <h2 className=" text-4xl font-bold mb-4.5">
                2 Bedroom Apartment – Yaba
              </h2>
              <p className="text-sm md:text-xl flex items-center gap-1 text-gray-500 font-medium">
                <MapPin className="w-6 h-6 text-green-500" />
                15 Ajayi Road, Yaba, Lagos
              </p>
            </div>
            <h3 className=" text-[#43A047] text-5xl font-bold">
              ₦850,000<span className=" text-gray-400 text-sm md:text-2xl">/year</span>
            </h3>
            <div className="flex items-center gap-1">
              <button className="bg-green-600 border-2 border-[#43A047] text-[#ffffff] px-16 py-3 rounded-md cursor-pointer hover:bg-[#ffffff] hover:text-green-600">
                View Details
              </button>
              <button className="bg-white border-2 border-[#43A047] text-[#43A047] px-16 py-3 rounded-md cursor-pointer hover:bg-[#43A047] hover:text-white">
                Contact Landlord
              </button>
            </div>
          </div>
        </div>
        {/* metrics */}
        <div className=" grid grid-cols-2 lg:grid-cols-4 gap-2 ">
          {DashMetrics.map((item) => {
            const { id, name, figure, icon: Icon } = item;
            return (
              <div
                key={id}
                className=" flex flex-col gap-2 bg-[#FFFFFF] py-2 px-3 rounded-2xl"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex flex-col gap-1">
                    <h2 className=" font-bold  xl:text-4xl text-[#162B4C]">
                      {figure}
                    </h2>
                    <h3>{name}</h3>
                  </div>
                  <Icon />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3.5">
          <h2 className=" text-2xl font-semibold">Recommended Houses</h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {properties.slice(0, 3).map((item, i) => (
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
                    className="object-cover rounded-3xl p-3 transition-transform duration-500 group-hover:scale-110"
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
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        if (!isLoggedIn) {
                          router.push("/signup");
                        } else {
                          router.push(`/properties/${item.id}`);
                        }
                      }}
                      className="bg-[#E8F5E9] text-[#43A047] text-xs font-bold px-4 py-1.5 rounded-full cursor-pointer"
                    >
                      View
                    </motion.button>
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
        </div>

        <div className="flex flex-col gap-3.5">
          <h2 className=" text-2xl font-semibold">RentULO Safety Tips</h2>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 ">
            {Safetytips.map((items) => {
              const { id, name, desc, icon } = items;
              return (
                <div
                  key={id}
                  className=" flex flex-col gap-2 bg-[#FFFFFF] py-2 px-4 rounded-2xl"
                >
                  <div className="flex items-center gap-1">
                    <span className=" text-xl">{icon}</span>
                    <h2 className=" text-[18px] font-semibold">{name}</h2>
                  </div>
                  <p className=" text-[15px] w-75">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default page

"use client";

import {
  DashMetrics,
  Safetytips,
  SafetyAction,
  ActiveProperty,
} from "@/app/components/Tenant-Dashboard/config/DashboardDatas";
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";
import Image from "next/image";
import { motion } from "framer-motion";
import properties from "@/app/components/properties";
import { containerVariants, itemVariants } from "@/app/components/animation";
import { useRouter } from "next/navigation";
import {
  MapPin,
  ShieldAlert,
  X,
  AlertTriangle,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const page = () => {
  const router = useRouter();
  const isLoggedIn = false;
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === ActiveProperty.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? ActiveProperty.images.length - 1 : prev - 1,
    );
  };
  return (
    <DashboardLayout>
      <section className=" flex flex-col gap-8 px-2.5 py-2.5">
        <div className="flex flex-col lg:flex-row w-full bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-50">
          <div className="relative h-72 md:h-96 lg:h-auto lg:w-[45%] group bg-gray-100">
            <Image
              src={ActiveProperty.images[currentSlide]}
              alt="Side of the house"
              fill
              className="object-cover transition-all duration-500"
            />

            {/* Image Counter 1 / 8 */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-10 border border-white/10">
              {currentSlide + 1} / {ActiveProperty.images.length}
            </div>

            <div className="absolute inset-0 flex items-center justify-between px-4 z-20 pointer-events-none">
              <button
                onClick={prevSlide}
                className="pointer-events-auto bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg text-[#162B4C] hover:bg-white hover:scale-110 transition-all active:scale-95"
              >
                <ChevronLeft size={22} strokeWidth={2.5} />
              </button>

              <button
                onClick={nextSlide}
                className="pointer-events-auto bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg text-[#162B4C] hover:bg-white hover:scale-110 transition-all active:scale-95"
              >
                <ChevronRight size={22} strokeWidth={2.5} />
              </button>
            </div>

            {/*Pagination Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-black/50 backdrop-blur-md px-3 py-1.5  rounded-full z-10">
              {ActiveProperty.images.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 cursor-pointer rounded-full h-1.5 ${
                    index === currentSlide
                      ? "w-4 bg-white shadow-md"
                      : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5 p-6 md:p-10 lg:w-[55%]">
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-[#43A047] text-white py-2 px-4 rounded-xl flex items-center gap-2">
                <Lock size={14} />
                <span className="text-xs font-bold uppercase">Active Lock</span>
              </div>
              <div className="bg-red-50 text-red-600 py-1.5 px-4 rounded-xl border border-red-100">
                <span className="text-xs font-bold uppercase">
                  {ActiveProperty.hoursRemaining} remaining
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl md:text-4xl font-bold text-[#162B4C] leading-tight">
                {ActiveProperty.title}
              </h2>
              <p className="flex items-center gap-2 text-gray-500 font-medium">
                <MapPin size={18} className="text-[#43A047]" />
                {ActiveProperty.location}
              </p>
            </div>

            <h3 className="text-[#43A047] text-4xl md:text-5xl font-extrabold">
              {ActiveProperty.price}
              <span className="text-gray-400 text-lg md:text-2xl font-normal ml-2">
                /year
              </span>
            </h3>

            {/* Progress Bar */}
            <div className="mt-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                  Lock Progress
                </span>
                <span className="text-[#1B401C] text-sm font-bold">
                  {ActiveProperty.lockProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#43A047] h-full rounded-full transition-all duration-1000"
                  style={{ width: `${ActiveProperty.lockProgress}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button className="w-full sm:w-auto bg-[#43A047] text-white px-10 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-green-100 transition-all active:scale-95">
                View Details
              </button>
              <button className="w-full sm:w-auto bg-white border-2 border-gray-100 text-[#162B4C] px-10 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95">
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

        <div className="flex flex-col gap-3.5 mt-4">
          <h2 className="text-2xl font-semibold px-1">RentULO Safety Tips</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Safetytips.map((items) => {
              const { id, name, desc, icon: IconComponent } = items;
              return (
                <div
                  key={id}
                  className="flex flex-col gap-2 bg-[#FFFFFF] py-4 px-4 rounded-2xl border border-gray-50 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <IconComponent size={24} className="text-[#43A047]" />
                    <h2 className="text-[17px] font-bold text-[#162B4C] leading-tight">
                      {name}
                    </h2>
                  </div>
                  <p className="text-[14px] text-gray-500 leading-relaxed max-w-[95%]">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-6 flex flex-col gap-3">
          {isSafetyOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-end p-6 md:p-10">
              <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[360px] overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
                <div className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-red-50 p-3 rounded-2xl">
                      <ShieldAlert className="text-[#FF3B30]" size={24} />
                    </div>
                    <button
                      onClick={() => setIsSafetyOpen(false)}
                      className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <h3 className="text-2xl font-bold text-[#162B4C] leading-tight">
                    Safety Assistance
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    If you feel unsafe or suspect a scam, choose an immediate
                    action below.
                  </p>
                </div>
                <div className="p-6 flex flex-col gap-3">
                  {SafetyAction.map((action) => (
                    <button
                      key={action.id}
                      className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer
                       ${
                         action.variant === "danger"
                           ? "bg-[#FF3B30] text-white hover:bg-red-700"
                           : action.variant === "Success" ||
                               action.variant === "success"
                             ? "bg-[#43A047] text-white hover:bg-green-700"
                             : "bg-[#F2F2F7] text-[#162B4C] hover:bg-gray-200"
                       }`}
                    >
                      <action.icon size={20} />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsSafetyOpen(true)}
          className="fixed bottom-10 right-10 bg-[#FF3B30] text-white p-5 rounded-full shadow-2xl hover:bg-red-700 transition-all z-40 active:scale-90"
        >
          <AlertTriangle size={32} />
        </button>
      </section>
    </DashboardLayout>
  );
};

export default page;

"use client";

import {
  DashMetrics,
  Safetytips,
  SafetyAction,
} from "@/app/components/Tenant-Dashboard/config/DashboardDatas";
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";
import Image from "next/image";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/app/components/animation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import {
  MapPin,
  ShieldAlert,
  X,
  AlertTriangle,
  Lock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  House,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useFetchProperties } from "@/app/api/features/property/property.queries";
import {
  useLikeRental,
  useLockedRentals,
  useUnlikeRental,
} from "@/app/api/features/progress/progress.queries";
import { getPropertyDetailsPath } from "@/app/lib/property-routes";
import { hasAccessToken } from "@/app/lib/auth";
import type { Rental } from "@/app/api/features/rental";

const formatRentPrice = (price: string | number) => {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return String(price || "Price unavailable");
  }

  return `N${numericPrice.toLocaleString()}`;
};

const getRentPeriod = (priceType: string) =>
  priceType ? `/${priceType}` : "/year";

const getActiveLockProgress = (rental?: Rental) => (rental ? 100 : 0);

const Page = () => {
  const router = useRouter();
  const isLoggedIn = true;
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [likedPropertyIds, setLikedPropertyIds] = useState<Set<string>>(
    () => new Set(),
  );
  const hasInitializedRef = useRef(false);
  const { data: properties } = useFetchProperties({ recentOnly: false });
  const {
    data: lockedRentals = [],
    isLoading: isLoadingLockedRentals,
    isError: isLockedRentalsError,
    error: lockedRentalsError,
  } = useLockedRentals();
  const { mutate: likeRental } = useLikeRental();
  const { mutate: unlikeRental } = useUnlikeRental();
  const activeLockedRental = lockedRentals[0];
  const activeLockImages = activeLockedRental?.images ?? [];
  const activeLockProgress = getActiveLockProgress(activeLockedRental);

  useEffect(() => {
    if ((properties ?? []).length > 0 && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setLikedPropertyIds(
        new Set(
          (properties ?? [])
            .filter((property) => property.liked)
            .map((property) => String(property.id)),
        ),
      );
    }
  }, [properties]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [activeLockedRental?.id]);

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

  const nextSlide = () => {
    if (activeLockImages.length <= 1) {
      return;
    }

    setCurrentSlide((prev) =>
      prev === activeLockImages.length - 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = () => {
    if (activeLockImages.length <= 1) {
      return;
    }

    setCurrentSlide((prev) =>
      prev === 0 ? activeLockImages.length - 1 : prev - 1,
    );
  };

  return (
    <DashboardLayout>
      <section className="flex flex-col gap-8 px-2.5 py-2.5">
        {isLoadingLockedRentals ? (
          <div className="flex min-h-[360px] w-full items-center justify-center rounded-[2rem] border border-gray-50 bg-white shadow-xl">
            <div className="flex flex-col items-center gap-3 text-[#43A047]">
              <Loader2 size={32} className="animate-spin" />
              <p className="text-sm font-bold text-gray-500">
                Loading your active lock...
              </p>
            </div>
          </div>
        ) : isLockedRentalsError ? (
          <div className="flex min-h-[320px] w-full flex-col justify-center gap-4 rounded-[2rem] border border-red-100 bg-red-50 p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#162B4C]">
                Unable to load active lock
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-red-600">
                {(lockedRentalsError as Error)?.message ||
                  "Please refresh the page or try again shortly."}
              </p>
            </div>
          </div>
        ) : activeLockedRental ? (
          <div className="flex w-full flex-col overflow-hidden rounded-[2rem] border border-gray-50 bg-white shadow-xl lg:flex-row group">
            <div className="relative h-72 overflow-hidden bg-gray-100 md:h-96 lg:h-auto lg:w-[45%]">
              <Link
                href={getPropertyDetailsPath(activeLockedRental)}
                className="block h-full w-full"
              >
                {activeLockImages[currentSlide] ? (
                  <Image
                    src={activeLockImages[currentSlide]}
                    alt={activeLockedRental.title || "Locked property"}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-400">
                    No image uploaded
                  </div>
                )}
              </Link>

              {activeLockImages.length > 0 && (
                <div className="absolute top-4 right-4 z-10 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">
                  {currentSlide + 1} / {activeLockImages.length}
                </div>
              )}

              {activeLockImages.length > 1 && (
                <>
                  <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-between px-4">
                    <button
                      type="button"
                      onClick={prevSlide}
                      className="pointer-events-auto rounded-full bg-white/80 p-2 text-[#162B4C] shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white active:scale-95"
                    >
                      <ChevronLeft size={22} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      className="pointer-events-auto rounded-full bg-white/80 p-2 text-[#162B4C] shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white active:scale-95"
                    >
                      <ChevronRight size={22} strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md">
                    {activeLockImages.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentSlide === index
                            ? "w-8 bg-[#43A047]"
                            : "w-2 bg-white/60 hover:bg-white"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col gap-5 p-6 md:p-10 lg:w-[55%]">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl bg-[#43A047] px-4 py-2 text-white">
                  <Lock size={14} />
                  <span className="text-xs font-bold uppercase">
                    Active Lock
                  </span>
                </div>
                <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-1.5 text-green-700">
                  <span className="text-xs font-bold uppercase">
                    {lockedRentals.length > 1
                      ? `${lockedRentals.length} locked houses`
                      : "Current locked house"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <Link href={getPropertyDetailsPath(activeLockedRental)}>
                  <h2 className="cursor-pointer text-2xl font-bold leading-tight text-[#162B4C] transition-colors hover:text-[#43A047] md:text-4xl">
                    {activeLockedRental.title || "Locked property"}
                  </h2>
                </Link>
                <p className="flex items-center gap-2 font-medium text-gray-500">
                  <MapPin size={18} className="text-[#43A047]" />
                  {activeLockedRental.location || "Location unavailable"}
                </p>
              </div>

              <h3 className="text-4xl font-extrabold text-[#43A047] md:text-5xl">
                {formatRentPrice(activeLockedRental.price)}
                <span className="ml-2 text-lg font-normal text-gray-400 md:text-2xl">
                  {getRentPeriod(activeLockedRental.priceType)}
                </span>
              </h3>

              <div className="mt-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Lock Status
                  </span>
                  <span className="text-sm font-bold text-[#1B401C]">
                    {activeLockProgress}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#43A047] transition-all duration-1000"
                    style={{ width: `${activeLockProgress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={getPropertyDetailsPath(activeLockedRental)}
                  className="w-full sm:w-auto"
                >
                  <button className="w-full cursor-pointer rounded-2xl bg-[#43A047] px-10 py-4 font-bold text-white transition-all hover:shadow-lg hover:shadow-green-100 active:scale-95">
                    View Details
                  </button>
                </Link>
                <Link href="/tenant/locked-house" className="w-full sm:w-auto">
                  <button className="w-full cursor-pointer rounded-2xl border-2 border-gray-100 bg-white px-10 py-4 font-bold text-[#162B4C] transition-all hover:bg-gray-50 active:scale-95">
                    View My Locks
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          null
          // <div className="flex min-h-[320px] w-full flex-col justify-center gap-5 rounded-[2rem] border border-gray-50 bg-white p-8 shadow-xl">
          //   <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F5E9] text-[#43A047]">
          //     <Lock size={26} />
          //   </div>
          //   <div>
          //     <h2 className="text-2xl font-bold text-[#162B4C]">
          //       No active locked house yet
          //     </h2>
          //     <p className="mt-2 max-w-2xl text-sm text-gray-500">
          //       When you lock a property, the latest active lock will appear
          //       here so you can jump back into it quickly.
          //     </p>
          //   </div>
          //   <div className="flex flex-col gap-3 sm:flex-row">
          //     <Link href="/tenant/saved-house" className="w-full sm:w-auto">
          //       <button className="w-full cursor-pointer rounded-2xl bg-[#43A047] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-green-700 active:scale-95">
          //         View Saved Houses
          //       </button>
          //     </Link>
          //     <Link href="/properties" className="w-full sm:w-auto">
          //       <button className="w-full cursor-pointer rounded-2xl border border-gray-200 px-6 py-3 text-sm font-bold text-[#162B4C] transition-all hover:bg-gray-50 active:scale-95">
          //         Browse Properties
          //       </button>
          //     </Link>
          //   </div>
          // </div>
        )}

        {/* Metrics Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {DashMetrics.map((item) => {
            const { id, name, figure, icon: Icon } = item;
            return (
              <div
                key={id}
                className="flex flex-col gap-2 bg-[#FFFFFF] py-2 px-3 rounded-2xl shadow-sm border border-gray-50"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex flex-col gap-1">
                    <h2 className="font-bold xl:text-4xl text-[#162B4C]">
                      {figure}
                    </h2>
                    <h3 className="text-sm text-gray-500">{name}</h3>
                  </div>
                  <Icon className="text-[#43A047]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommended Houses Section */}
        <div className="flex flex-col gap-3.5">
          <h2 className="text-2xl font-bold">Recommended Houses</h2>
          {properties?.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No listings available at the moment</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {properties?.slice(0, 3).map((item, i) => (
                <motion.div
                  key={item.id}
                  onClick={() => (getPropertyDetailsPath(item))}
                  custom={i}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative h-56 md:h-64 w-full overflow-hidden cursor-pointer">
                    <Link
                      href={getPropertyDetailsPath(item)}
                      className="block h-full w-full"
                    >
                      {item.images && item.images.length > 0 ? (
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          className="object-cover rounded-3xl p-3 transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-3xl p-3 flex items-center justify-center text-gray-400 text-sm">
                          No Image
                        </div>
                      )}
                    </Link>
                    <button
                      type="button"
                      className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#162B4C] shadow-sm transition hover:text-red-500 cursor-pointer"
                      aria-label={`Save ${item.title}`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleLikeToggle(String(item.id));
                      }}
                    >
                      {likedPropertyIds.has(String(item.id)) ? (
                        <HiHeart size={22} className="text-red-500" />
                      ) : (
                        <HiOutlineHeart size={22} />
                      )}
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-gray-900 font-bold text-xl">
                          ₦{Number(item.price).toLocaleString()}
                          <span className="text-sm font-normal text-gray-400">
                            {" "}
                            / {item.priceType}
                          </span>
                        </p>
                        <div>
                          <h3 className="text-gray-800 font-semibold text-lg hover:text-[#43A047] transition-colors cursor-pointer">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-[#E8F5E9] text-[#43A047] text-xs font-bold px-4 py-1.5 rounded-full cursor-pointer"
                      >
                        View
                      </motion.button>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-4 border-t border-gray-50 pt-4">
                      <div className="flex items-center gap-2">
                        <House size={16} className="text-gray-400" />
                        <span className="text-xs text-gray-500 font-medium">
                          {item.propertyType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
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
        </div>
        <div className="flex flex-col gap-3.5 mt-4">
          <h2 className="text-2xl font-bold px-1">RentULO Safety Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Safetytips.map((items) => (
              <div
                key={items.id}
                className="flex flex-col gap-2 bg-white py-4 px-4 rounded-2xl border border-gray-50 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <items.icon size={24} className="text-[#43A047]" />
                  <h2 className="text-[17px] font-bold text-[#162B4C] leading-tight">
                    {items.name}
                  </h2>
                </div>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  {items.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
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
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <h3 className="text-2xl font-bold text-[#162B4C]">
                  Safety Assistance
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  If you feel unsafe or suspect a scam, choose an action.
                </p>
              </div>
              <div className="p-6 flex flex-col gap-3">
                {SafetyAction.map((action) => (
                  <button
                    key={action.id}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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

export default Page;

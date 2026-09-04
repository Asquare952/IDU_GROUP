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
  Heart,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useFetchProperties } from "@/app/api/features/property/property.queries";
import {
  useLikeRental,
  useLockedRentals,
  useUnlikeRental,
  useLikedRentals,
  useBookedRentals,
} from "@/app/api/features/progress/progress.queries";
import { getPropertyDetailsPath } from "@/app/lib/property-routes";
import { hasAccessToken } from "@/app/lib/auth";
import type { Rental } from "@/app/api/features/rental";
import type { DashboardMetrics as DashboardMetricsType } from "@/app/components/Tenant-Dashboard/types";

const formatRentPrice = (price: string | number) => {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return String(price || "Price unavailable");
  }

  return `N${numericPrice.toLocaleString()}`;
};

const getRentPeriod = (priceType: string) =>
  priceType ? `/${priceType}` : "/year";

const formatAmount = (amount: number | string) =>
  `N${Number(amount || 0).toLocaleString()}`;

const getActiveLockProgress = (rental?: Rental) => (rental ? 100 : 0);

const LOCK_DURATION_MS = 24 * 60 * 60 * 1000;

const formatRemainingTime = (milliseconds: number) => {
  const totalMinutes = Math.max(0, Math.ceil(milliseconds / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes.toString().padStart(2, "0")}m remaining`;
};

const Page = () => {
  const router = useRouter();
  const isLoggedIn = true;
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rentedApartmentSlide, setRentedApartmentSlide] = useState(0);
  const [rentedImageSlide, setRentedImageSlide] = useState(0);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
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
  const { data: likedRentals = [] } = useLikedRentals();
  const { data: bookedRentals = [] } = useBookedRentals();
  const { mutate: likeRental } = useLikeRental();
  const { mutate: unlikeRental } = useUnlikeRental();
  const activeLockedRental = lockedRentals[0];
  const activeLockImages = activeLockedRental?.images ?? [];
  const activeLockProgress = getActiveLockProgress(activeLockedRental);
  const rentedApartments = bookedRentals.filter(
    (rental) => rental.status.toLowerCase() === "rented",
  );
  const activeRentedApartment = rentedApartments[rentedApartmentSlide];
  const rentedImages = activeRentedApartment?.images ?? [];

  const dashMetrics = useMemo<DashboardMetricsType[]>(
    () => [
      {
        id: 1,
        name: "Saved house",
        figure: likedRentals?.length || 0,
        icon: Heart,
      },
      {
        id: 4,
        name: "Active Locks",
        figure: lockedRentals?.length || 0,
        icon: Lock,
      },
    ],
    [likedRentals, lockedRentals],
  );

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

  useEffect(() => {
    if (!activeLockedRental?.lockedAt) {
      return;
    }

    const timer = window.setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [activeLockedRental?.lockedAt]);

  useEffect(() => {
    setRentedApartmentSlide(0);
    setRentedImageSlide(0);
  }, [bookedRentals.length]);

  useEffect(() => {
    setRentedImageSlide(0);
  }, [activeRentedApartment?.id]);

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

  const lockStartedAt = activeLockedRental?.lockedAt
    ? Date.parse(activeLockedRental.lockedAt)
    : NaN;
  const lockExpiresAt = Number.isNaN(lockStartedAt)
    ? NaN
    : lockStartedAt + LOCK_DURATION_MS;
  const lockMillisecondsRemaining = Number.isNaN(lockExpiresAt)
    ? 0
    : Math.max(0, lockExpiresAt - currentTime);
  const lockProgress = Number.isNaN(lockExpiresAt)
    ? 0
    : Math.min(
        100,
        Math.max(0, (lockMillisecondsRemaining / LOCK_DURATION_MS) * 100),
      );

  return (
    <DashboardLayout>
      <section className="flex flex-col gap-8 px-7 py-2.5">
        {activeLockedRental ? (
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative min-h-[260px] bg-slate-100 lg:min-h-[340px]">
                {activeLockImages[currentSlide] ? (
                  <Image
                    src={activeLockImages[currentSlide]}
                    alt={activeLockedRental.title}
                    fill
                    className="object-cover"
                  />
                ) : null}
                {activeLockImages.length > 1 ? (
                  <>
                    <button
                      type="button"
                      aria-label="Previous locked house image"
                      onClick={prevSlide}
                      className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#162B4C] shadow-md"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next locked house image"
                      onClick={nextSlide}
                      className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#162B4C] shadow-md"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                ) : null}
              </div>
              <div className="flex flex-col justify-center p-7 md:p-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase text-[#43A047]">
                    Active Lock
                  </span>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase text-orange-600">
                    {lockMillisecondsRemaining > 0
                      ? formatRemainingTime(lockMillisecondsRemaining)
                      : "Lock expired"}
                  </span>
                </div>
                <h2 className="mt-5 text-2xl font-bold text-[#162B4C] md:text-3xl">
                  {activeLockedRental.title}
                </h2>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin size={16} />
                  {activeLockedRental.location}
                </p>
                <p className="mt-5 text-3xl font-bold text-[#43A047]">
                  {formatRentPrice(activeLockedRental.price)}
                  <span className="ml-1 text-base font-normal text-slate-400">
                    {getRentPeriod(activeLockedRental.priceType)}
                  </span>
                </p>
                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-xs font-bold uppercase text-slate-500">
                    <span>Lock progress</span>
                    <span>{Math.round(lockProgress)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#43A047] transition-[width] duration-1000"
                      style={{ width: `${lockProgress}%` }}
                    />
                  </div>
                  <p className="mt-3 rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
                    {lockMillisecondsRemaining > 0
                      ? `You have ${formatRemainingTime(lockMillisecondsRemaining)} before your locked house expires.`
                      : "Your locked house has expired."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {activeRentedApartment ? (
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative min-h-[280px] bg-slate-100 lg:min-h-[360px]">
                {rentedImages.length > 0 ? (
                  <Image
                    src={rentedImages[rentedImageSlide]}
                    alt={activeRentedApartment.title}
                    fill
                    className="object-cover"
                  />
                ) : null}
                {rentedImages.length > 1 ? (
                  <>
                    <button
                      type="button"
                      aria-label="Previous rented apartment image"
                      onClick={() =>
                        setRentedImageSlide((slide) =>
                          slide === 0 ? rentedImages.length - 1 : slide - 1,
                        )
                      }
                      className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#162B4C] shadow-md"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next rented apartment image"
                      onClick={() =>
                        setRentedImageSlide((slide) =>
                          slide === rentedImages.length - 1 ? 0 : slide + 1,
                        )
                      }
                      className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#162B4C] shadow-md"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/40 px-3 py-2">
                      {rentedImages.map((image, index) => (
                        <button
                          key={`${image}-${index}`}
                          type="button"
                          aria-label={`Show rented apartment image ${index + 1}`}
                          onClick={() => setRentedImageSlide(index)}
                          className={`h-2 w-2 rounded-full ${index === rentedImageSlide ? "bg-white" : "bg-white/50"}`}
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>

              <div className="flex flex-col justify-center p-7 md:p-10">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase text-[#43A047]">
                    Rented Apartment
                  </span>
                  {rentedApartments.length > 1 ? (
                    <span className="text-xs font-medium text-slate-400">
                      {rentedApartmentSlide + 1} / {rentedApartments.length}
                    </span>
                  ) : null}
                </div>
                <h2 className="text-2xl font-bold text-[#162B4C] md:text-3xl">
                  {activeRentedApartment.title}
                </h2>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin size={16} />
                  {activeRentedApartment.location}
                </p>
                <p className="mt-5 text-3xl font-bold text-[#43A047]">
                  {formatRentPrice(activeRentedApartment.price)}
                  <span className="ml-1 text-base font-normal text-slate-400">
                    {getRentPeriod(activeRentedApartment.priceType)}
                  </span>
                </p>
                <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-slate-100 pt-4 text-sm">
                  <div className="flex justify-between gap-3 text-slate-500">
                    <span>Basic rent</span>
                    <span className="font-semibold text-slate-800">
                      {formatAmount(activeRentedApartment.price)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3 text-slate-500">
                    <span>Caution fee</span>
                    <span className="font-semibold text-slate-800">
                      {formatAmount(activeRentedApartment.cautionFee)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3 text-slate-500">
                    <span>Legal fee</span>
                    <span className="font-semibold text-slate-800">
                      {formatAmount(activeRentedApartment.legalFee)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3 text-slate-500">
                    <span>Brokerage fee</span>
                    <span className="font-semibold text-slate-800">
                      {formatAmount(activeRentedApartment.brokeFee)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3 text-slate-500">
                    <span>Service charge</span>
                    <span className="font-semibold text-slate-800">
                      {formatAmount(activeRentedApartment.mgtServiceCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3 border-t border-slate-100 pt-2 font-bold text-[#162B4C]">
                    <span>Total package</span>
                    <span>
                      {formatAmount(
                        Number(activeRentedApartment.price || 0) +
                          Number(activeRentedApartment.cautionFee || 0) +
                          Number(activeRentedApartment.legalFee || 0) +
                          Number(activeRentedApartment.brokeFee || 0) +
                          Number(activeRentedApartment.mgtServiceCharge || 0),
                      )}
                    </span>
                  </div>
                </div>
                {rentedApartments.length > 1 ? (
                  <div className="mt-6 flex gap-2">
                    <button
                      type="button"
                      aria-label="Previous rented apartment"
                      onClick={() =>
                        setRentedApartmentSlide((slide) =>
                          slide === 0 ? rentedApartments.length - 1 : slide - 1,
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-[#162B4C]"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next rented apartment"
                      onClick={() =>
                        setRentedApartmentSlide((slide) =>
                          slide === rentedApartments.length - 1 ? 0 : slide + 1,
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-[#162B4C]"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* Metrics Section */}
        <div className="grid grid-cols-2 gap-2">
          {dashMetrics.map((item) => {
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
              {properties?.slice(0, 3).map((item, i) => {
                const handleCardClick = () => {
                  router.push(getPropertyDetailsPath(item));
                };

                return (
                  <motion.div
                    key={item.id}
                    onClick={handleCardClick}
                    custom={i}
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  >
                    <div className="relative h-56 md:h-64 w-full overflow-hidden cursor-pointer">
                      <div
                        // href={getPropertyDetailsPath(item)}
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
                      </div>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick();
                          }}
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
                );
              })}
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
              <div className="p-6 flex flex-col gap-4">
                {SafetyAction.map((action) => (
                  <button
                    key={action.id}
                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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

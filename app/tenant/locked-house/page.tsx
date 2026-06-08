"use client";

import React, { Suspense, useEffect, useState } from "react";
import {
  steps,
  ImportantNoticeData,
  SafetyAction,
} from "@/app/components/Tenant-Dashboard/config/DashboardDatas";
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";
import {
  MapPin,
  Clock,
  Calendar,
  MessageSquare,
  AlertTriangle,
  X,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useLockedRentals, useVerifyLockPayment } from "@/app/api";
import type { Rental } from "@/app/api";
import {
  clearPendingLockPayment,
  getPendingLockPaymentReference,
} from "@/app/lib/lock-payment";

const getPaymentReference = (searchParams: URLSearchParams) =>
  searchParams.get("reference") ||
  searchParams.get("trxref") ||
  searchParams.get("transaction_reference") ||
  getPendingLockPaymentReference();

const LockedHouseContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [verifiedReference, setVerifiedReference] = useState<string | null>(
    null,
  );

  const {
    data: lockedRentals = [],
    isLoading,
    isError,
    error,
  } = useLockedRentals();
  const {
    mutate: verifyPayment,
    isPending: isVerifyingPayment,
  } = useVerifyLockPayment();

  useEffect(() => {
    const reference = getPaymentReference(searchParams);

    if (!reference || reference === verifiedReference) {
      return;
    }

    setVerifiedReference(reference);
    verifyPayment(reference, {
      onSuccess: (data) => {
        clearPendingLockPayment();
        toast.success(data.message || "Payment verified successfully.");
        router.replace("/tenant/locked-house");
      },
      onError: (verifyError) => {
        toast.error(verifyError.message || "Payment verification failed.");
      },
    });
  }, [router, searchParams, verifiedReference, verifyPayment]);

  return (
    <DashboardLayout>
      <section className="flex flex-col gap-8 px-4 py-6 bg-[#F8F9FA] min-h-screen">
        <div className="flex flex-col gap-1 p-3">
          <h2 className="text-3xl font-bold text-[#162B4C]">My Lock</h2>
          <p className="text-gray-500">Track your reservation and next steps</p>
        </div>

        {isVerifyingPayment && (
          <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-semibold text-green-700">
            <Loader2 size={18} className="animate-spin" />
            Verifying your payment...
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin text-[#43A047]" />
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
            {(error as Error).message || "Unable to load locked houses."}
          </div>
        ) : lockedRentals.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-bold text-[#162B4C]">
              No locked house yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Once your lock payment is verified, the house will appear here.
            </p>
            <button
              type="button"
              onClick={() => router.push("/tenant/saved-house")}
              className="mt-5 rounded-xl bg-[#43A047] px-5 py-3 text-sm font-bold text-white hover:bg-green-700"
            >
              View saved houses
            </button>
          </div>
        ) : (
          lockedRentals.map((item) => (
            <LockedRentalCard key={item.id} item={item} />
          ))
        )}

        {/* <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 p-8 gap-8">
          <h2 className="font-bold text-2xl text-[#162B4C]">
            Application Progress
          </h2>

          <div className="flex flex-col">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="relative flex gap-6 pb-10 last:pb-0"
              >
                {index !== steps.length - 1 && (
                  <div className="absolute left-[15px] top-[30px] w-[2px] h-full bg-gray-200" />
                )}

                <div
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    step.status === "completed"
                      ? "bg-[#43A047] border-[#43A047] text-white"
                      : "bg-white border-gray-200 text-gray-400"
                  }`}
                >
                  {step.status === "completed" ? (
                    <span className="text-xs font-bold">✓</span>
                  ) : (
                    <span className="text-xs font-bold">{step.id}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <h3
                    className={`font-bold text-xl lg:text-2xl ${
                      step.status === "completed"
                        ? "text-[#162B4C]"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </h3>

                  {step.subtitle && (
                    <p className="text-sm text-gray-500">{step.subtitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div> */}


        {/* {lockedRentals.length === 0 ? "" : <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <button className="flex items-center justify-center gap-3 bg-[#43A047] border-2 border-[#43A047] text-white py-4 px-6 rounded-xl cursor-pointer hover:bg-white hover:text-green-600">
            <Calendar size={20} />
            <span>Continue Application</span>
          </button>

          <button className="flex items-center justify-center gap-3 border-2 border-[#43A047] text-[#43A047] hover:bg-[#43A047] hover:text-white py-4 px-6 rounded-xl font-bold transition-all active:scale-95">
            <Clock size={20} />
            <span>Reschedule Inspection</span>
          </button>

          <button className="flex items-center justify-center gap-3 border-2 border-[#43A047] text-[#43A047] hover:bg-[#43A047] hover:text-white py-4 px-6 rounded-xl font-bold transition-all active:scale-95">
            <MessageSquare size={20} />
            <span>Chat with Landlord</span>
          </button>
        </div>} */}
        

        <div className="mt-4 p-6 bg-[#fff9E6] border border-[#ffd966] rounded-[1.5rem] flex gap-4 items-start shadow-sm">
          <div className="text-[#b45309] mt-1">
            <ImportantNoticeData.icon size={24} />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="font-bold text-[#92400E] mb-1">
              {ImportantNoticeData.title}
            </h4>

            <p className="text-[#B45309] leading-relaxed font-medium">
              {ImportantNoticeData.message}
            </p>
          </div>
        </div>

        {isSafetyOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-end p-6 md:p-10">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[360px] overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
              <div className="p-8 pb-4">
                <div className="flex justify-between items-start">
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

                <h3 className="text-2xl font-bold text-[#162B4C] leading-tight mt-4">
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

const LockedRentalCard = ({ item }: { item: Rental }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = item.images.length > 0 ? item.images : [];
  const activeImage = images[currentSlide];
  const landlordName = item.User
    ? `${item.User.first_name} ${item.User.last_name}`.trim()
    : "Landlord";

  const nextSlide = () => {
    if (images.length <= 1) return;
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (images.length <= 1) return;
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[550px] bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
      <div className="relative h-72 md:h-96 lg:h-auto lg:w-[45%] bg-gray-200 overflow-hidden">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={`${item.title} view`} 
            fill
            className="object-cover transition-all duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-400">
            No image uploaded
          </div>
        )}

        {images.length > 0 && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-10">
            {currentSlide + 1} / {images.length}
          </div>
        )}

        {images.length > 1 && (
          <>
            <div className="absolute inset-0 flex items-center justify-between px-4 z-20 pointer-events-none">
              <button
                type="button"
                onClick={prevSlide}
                className="pointer-events-auto bg-white/90 p-2 rounded-full shadow-lg text-[#162B4C] hover:scale-110 transition-all"
              >
                <ChevronLeft size={22} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="pointer-events-auto bg-white/90 p-2 rounded-full shadow-lg text-[#162B4C] hover:scale-110 transition-all"
              >
                <ChevronRight size={22} strokeWidth={2.5} />
              </button>
            </div>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentSlide
                      ? "w-4 bg-[#43A047]"
                      : "w-1.5 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-5 flex-1 p-6 md:p-10">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-3xl md:text-4xl font-bold text-[#162B4C] leading-tight">
            {item.title}
          </h2>
          <p className="text-gray-500 flex items-center gap-1 font-medium">
            <MapPin className="w-5 h-5 text-[#43A047]" />
            {item.location || "Location unavailable"}
          </p>
        </div>

        <div className="bg-[#98E682] rounded-2xl p-6 my-2 shadow-inner">
          <div className="flex items-center gap-2 mb-2 text-[#1B401C]">
            <Clock size={20} />
            <span className="font-bold uppercase text-[10px] tracking-widest">
              Lock Status
            </span>
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-[#1B401C]">
            Active
          </h3>
          <div className="w-full bg-white/30 h-2.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-[#1B401C] h-full rounded-full w-3/4" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              Rent Price
            </p>
            <h3 className="text-[#43A047] text-2xl font-bold">
              N{Number(item.price).toLocaleString()}
              <span className="text-xs font-normal ml-1">
                /{item.priceType}
              </span>
            </h3>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              Property Type
            </p>
            <h3 className="text-[#162B4C] text-2xl font-bold capitalize">
              {item.propertyType || "Rental"}
            </h3>
          </div>
        </div>

        <div className="mt-auto bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-gray-100">
          <div>
            <p className="text-gray-400 text-[9px] font-bold uppercase">
              Landlord
            </p>
            <p className="font-bold text-[#162B4C]">{landlordName}</p>
          </div>
          {item.User?.Profile?.verified === true && (
            <span className="flex items-center gap-1 text-green-600 text-[10px] font-bold border border-green-200 bg-white px-3 py-1.5 rounded-full">
              <CheckCircle2 size={12} /> VERIFIED
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Page = () => (
  <Suspense fallback={null}>
    <LockedHouseContent />
  </Suspense>
);

export default Page;

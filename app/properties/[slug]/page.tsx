"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  MapPin,
  Home,
  Loader2,
  Shield,
  Zap,
  Droplets,
  Leaf,
  Lock,
  MessageSquare,
  User,
  CalendarDays,
} from "lucide-react";
import Image from "next/image";
import Navbar from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import {
  useBookProperty,
  useFetchPropertyBySlug,
} from "@/app/api/features/property";
import {
  useInitializeLockPayment,
  useVerifyLockPayment,
  useInitializeRentPayment,
  useVerifyRentPayment,
} from "@/app/api/features/progress/progress.queries";
import { useCreateConversation } from "@/app/api/features/chat/chat.queries";
import { sanitizeConversationId } from "@/app/api/features/chat/chat.api";
import { hasAccessToken } from "@/app/lib/auth";
import {
  buildLockPaymentPayload,
  storePendingLockPayment,
} from "@/app/lib/lock-payment";
import {
  buildRentPaymentPayload,
  storePendingRentPayment,
} from "@/app/lib/rent-payment";
import { toast } from "react-toastify";
import { useAuth } from "@/app/components/context/AuthContext";

function PropertyDesktopViewContent() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuth();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllTips, setShowAllTips] = useState(false);
  const [verifiedReference, setVerifiedReference] = useState<string | null>(
    null,
  );
  const { mutate: handleBook, isPending } = useBookProperty();
  const { mutate: createConversation } = useCreateConversation();
  const initializeLockPayment = useInitializeLockPayment();
  const initializeRentPayment = useInitializeRentPayment();
  const { mutate: verifyPayment, isPending: isVerifyingPayment } =
    useVerifyLockPayment();
  const { mutate: verifyRentPayment, isPending: isVerifyingRentPayment } =
    useVerifyRentPayment();

  // const {
  //   data: property,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: ["property", slug],
  //   queryFn: () => fetchPropertyBySlug(slug!),
  //   enabled: Boolean(slug),
  // });

  const { data: property, isLoading, isError, error } = useFetchPropertyBySlug(slug!);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [slug]);

  useEffect(() => {
    const reference =
      searchParams.get("reference") ||
      searchParams.get("trxref") ||
      searchParams.get("transaction_reference");

    if (!reference || reference === verifiedReference || !hasAccessToken()) {
      return;
    }

    setVerifiedReference(reference);
    verifyPayment(reference, {
      onSuccess: (data) => {
        toast.success(data.message || "Payment verified successfully.");
        router.replace("/tenant/locked-house");
      },
      onError: (error) => {
        toast.error(error.message || "Payment verification failed.");
      },
    });
  }, [router, searchParams, slug, verifiedReference, verifyPayment]);

  useEffect(() => {
    const reference =
      searchParams.get("reference") ||
      searchParams.get("trxref") ||
      searchParams.get("transaction_reference");

    if (!reference || reference === verifiedReference || !hasAccessToken()) {
      return;
    }

    setVerifiedReference(reference);
    verifyRentPayment(reference, {
      onSuccess: (data) => {
        toast.success(data.message || "Payment verified successfully.");
        router.replace("/tenant/payment-success");
      },
      onError: (error) => {
        toast.error(error.message || "Payment verification failed.");
      },
    });
  }, [router, searchParams, slug, verifiedReference, verifyRentPayment]);

  const showFooter = !isLoggedIn;

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-[#4CAF50]" />
        </div>
        {showFooter ? <Footer /> : null}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
          <p className="text-red-500 text-lg">
            {(error as Error).message || "Failed to load this property."}
          </p>
          <button
            type="button"
            onClick={() => router.push("/properties")}
            className="mt-4 text-[#4CAF50] font-semibold hover:underline"
          >
            Back to listings
          </button>
        </div>
        {showFooter ? <Footer /> : null}
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
          <p className="text-gray-600 text-lg">Property not found.</p>
          <button
            type="button"
            onClick={() => router.push("/properties")}
            className="mt-4 text-[#4CAF50] font-semibold hover:underline"
          >
            Back to listings
          </button>
        </div>
        {showFooter ? <Footer /> : null}
      </div>
    );
  }

  const activeImage = property.images[currentImageIndex] ?? property.images[0];
  const galleryImages = activeImage
    ? [
      activeImage,
      ...property.images.filter((_, index) => index !== currentImageIndex),
    ].slice(0, 5)
    : [];
  const landlordName = property.User
    ? `${property.User.first_name} ${property.User.last_name}`.trim()
    : "Verified Landlord";

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="mb-6 text-sm text-gray-500 font-medium">
          Properties / <span className="text-gray-900">{property.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 gap-2 overflow-hidden lg:h-[430px] lg:grid-cols-[1.35fr_1fr]">
              <div className="group relative h-[280px] w-full overflow-hidden bg-slate-100 lg:h-full">
                {galleryImages[0] ? (
                  <Image
                    src={galleryImages[0]}
                    alt={property.title}
                    fill
                    priority
                    className="object-cover opacity-95 transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg text-slate-400">
                    No image uploaded yet
                  </div>
                )}

                <div className="absolute left-5 top-5 rounded bg-white px-4 py-3 text-sm font-black text-gray-900 shadow-lg">
                  From N{Number(property.price).toLocaleString()} /{" "}
                  <span className="lowercase">{property.priceType}</span>
                </div>
              </div>

              {galleryImages.length > 1 && (
                <div className="grid h-[280px] grid-cols-2 gap-2 lg:h-full">
                  {galleryImages.slice(1).map((image, index) => {
                    const realImageIndex = property.images.findIndex(
                      (propertyImage) => propertyImage === image,
                    );

                    return (
                      <button
                        key={`${property.id}-gallery-${image}-${index}`}
                        type="button"
                        onClick={() =>
                          setCurrentImageIndex(
                            realImageIndex >= 0 ? realImageIndex : index + 1,
                          )
                        }
                        className="relative overflow-hidden bg-slate-100"
                      >
                        <Image
                          src={image}
                          alt={`${property.title} ${index + 2}`}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className=" grid grid-cols-2 gap-1.5">
              {property.videos.map((video, index) => (
                <div key={index} className="rounded-xl">
                  <video
                    src={video}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-8 rounded-[32px] grid grid-cols-2 md:grid-cols-3 gap-4">
              <Spec
                icon={<MapPin className="text-[#4CAF50]" />}
                label="Location"
                value={property.location}
              />
              <Spec
                icon={<Home className="text-[#4CAF50]" />}
                label="Type"
                value={property.propertyType}
              />
              <Spec
                icon={<Shield className="text-[#4CAF50]" />}
                label="Status"
                value={property.status}
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-black text-gray-900">Description</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {property.description || "No description provided yet."}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-black text-gray-900">Amenities</h2>
              <ul className="flex flex-col gap-2 list-disc list-inside">
                {property.amenities.map((amenity, index) => (
                  <li key={index} className="text-gray-600 leading-relaxed text-lg">
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 bg-blue-50 p-6 rounded-[32px] border border-blue-100">
              <h2 className="text-2xl font-black text-gray-900">Safety Tips</h2>
              {(showAllTips
                ? [
                  "Ensure you meet the landlord or agent in an open location.",
                  "Always verify ownership before making any payment.",
                  "Be cautious of deals that seem too good to be true.",
                  "Use secure payment methods and keep your receipts.",
                ]
                : ["Ensure you meet the landlord or agent in an open location."]
              ).map((tip, index) => (
                <p
                  key={index}
                  className="text-gray-600 leading-relaxed text-lg"
                >
                  {index + 1}. {tip}
                </p>
              ))}
              <button
                type="button"
                onClick={() => setShowAllTips(!showAllTips)}
                className="text-[#4CAF50] font-semibold hover:underline"
              >
                {showAllTips ? "Show Less Tips" : "See Full Tips"}
              </button>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-xl font-bold mb-6">Listing Highlights</h3>
              <div className="flex flex-wrap gap-8">
                <Amenity
                  icon={<Zap />}
                  label={`${property.priceType} pricing`}
                />
                <Amenity
                  icon={<Shield />}
                  label={`${property.status} listing`}
                />
                <Amenity icon={<Droplets />} label="Image gallery included" />
                <Amenity icon={<Leaf />} label="Direct rental posting" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-10 space-y-6">
              <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-xl shadow-gray-200/50">
                <div className="flex items-center gap-3 mb-6 bg-green-50 p-3 rounded-2xl border border-green-100">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-700 font-bold text-sm uppercase">
                    {property.status} listing
                  </span>
                </div>

                <div className="mb-8">
                  <p className="text-gray-400 text-sm font-medium mb-1">Rent</p>
                  <h1 className="text-4xl font-black text-gray-900">
                    N{Number(property.price).toLocaleString()}
                    <span className="text-lg font-normal text-gray-500 capitalize">
                      /{property.priceType}
                    </span>
                  </h1>
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (!hasAccessToken()) {
                        router.push("/login");
                        return;
                      }

                      const rentalId = String(property.id);

                      initializeRentPayment.mutate(
                        buildRentPaymentPayload(rentalId),
                        {
                          onSuccess: (data) => {
                            storePendingRentPayment({
                              reference: data.reference,
                              rentalId,
                            });

                            window.location.href = data.authorizationUrl;
                          },
                          onError: (error) => {
                            toast.error(
                              error.message ||
                              "Unable to start payment. Please try again.",
                            );
                          },
                        },
                      );
                    }}
                    disabled={
                      isPending ||
                      initializeRentPayment.isPending ||
                      isVerifyingPayment
                    }
                    className="flex items-center justify-center gap-3 w-full bg-green-600 border-2 border-none text-white font-black py-5 rounded-[24px] hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-orange-100 uppercase mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock className="inline-block mr-2" />
                    <span>
                      {initializeRentPayment.isPending || isVerifyingPayment
                        ? "Processing..."
                        : "Rent This House"}
                    </span>
                  </button>

                  {/*  */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!hasAccessToken()) {
                        router.push("/login");
                        return;
                      }

                      if (!property.userId) {
                        toast.error(
                          "Landlord contact is not available for this listing.",
                        );
                        return;
                      }

                      createConversation(
                        { other_user_id: String(property.userId) },
                        {
                          onSuccess: (data) => {
                            const conversationId = sanitizeConversationId(
                              data.conversation_id ?? data._id ?? data.id,
                            );

                            if (!conversationId) {
                              toast.error("Unable to open this conversation.");
                              return;
                            }

                            router.push(`/tenant/messages/${conversationId}`);
                          },
                          onError: (conversationError) => {
                            toast.error(
                              conversationError.message ||
                              "Unable to start chat. Please try again.",
                            );
                          },
                        },
                      );
                    }}
                    className="flex items-center justify-center gap-3 w-full bg-green-600 border-2 border-none text-white font-black py-5 rounded-[24px] hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-orange-100 uppercase mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageSquare />
                    <span>Chat Landloard</span>
                  </button>

                  {/*  */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!hasAccessToken()) {
                        router.push("/login");
                        return;
                      }

                      handleBook(String(property.id));
                    }}
                    disabled={isPending}
                    className="flex items-center justify-center gap-3 w-full bg-green-600 border-2 border-none text-white font-black py-5 rounded-[24px] hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-orange-100 uppercase mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CalendarDays />
                    {isPending ? "Processing..." : "Book Inspection"}
                  </button>

                  {/*  */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!hasAccessToken()) {
                        router.push("/login");
                        return;
                      }

                      const rentalId = String(property.id);

                      initializeLockPayment.mutate(
                        buildLockPaymentPayload(rentalId),
                        {
                          onSuccess: (data) => {
                            storePendingLockPayment({
                              reference: data.reference,
                              rentalId,
                            });

                            window.location.href = data.authorizationUrl;
                          },
                          onError: (error) => {
                            toast.error(
                              error.message ||
                              "Unable to start payment. Please try again.",
                            );
                          },
                        },
                      );
                    }}
                    disabled={
                      isPending ||
                      initializeLockPayment.isPending ||
                      isVerifyingPayment
                    }
                    className="flex items-center justify-center gap-3 w-full bg-green-600 border-2 border-none text-white font-black py-5 rounded-[24px] hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-orange-100 uppercase mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock className="inline-block mr-2" />
                    <span>
                      {initializeLockPayment.isPending || isVerifyingPayment
                        ? "Processing..."
                        : "Lock This House"}
                    </span>
                  </button>

                  {/*  */}
                  <button
                    type="button"
                    onClick={() => router.push("/properties")}
                    className="w-full bg-[#FF9800] text-white font-black py-5 rounded-[24px] hover:bg-[#F57C00] transition-all active:scale-95 shadow-lg shadow-orange-100 uppercase mt-2 cursor-pointer"
                  >
                    Back to Listings
                  </button>
                </div>

                <p className="text-center text-gray-400 text-xs mt-6">
                  * Booking requires a completed account profile and a valid
                  logged-in session.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-[32px] flex flex-col gap-2">
                <h2>Landloard</h2>
                <div>
                  <p className="font-bold text-gray-900">{landlordName}</p>
                  <p className="text-xs text-gray-500">
                    {property.User?.Profile?.verified === true
                      ? "Verified landlord"
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {showFooter ? <Footer /> : null}
    </div>
  );
}

export default function PropertyDesktopView() {
  return (
    <Suspense fallback={null}>
      <PropertyDesktopViewContent />
    </Suspense>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-xs text-gray-400 uppercase font-bold tracking-wider">
        {icon} {label}
      </div>
      <p className="font-bold text-gray-900 capitalize">{value}</p>
    </div>
  );
}

function Amenity({
  icon,
  label,
}: {
  icon: React.ReactElement<{ size?: number }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-[#E8F5E9] text-[#4CAF50] rounded-full flex items-center justify-center">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className="font-bold text-gray-700 text-sm">{label}</span>
    </div>
  );
}

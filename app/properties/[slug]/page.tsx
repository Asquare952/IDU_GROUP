"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Thumbs,
  FreeMode,
} from "swiper/modules";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
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
  useFetchPropertyBySlug,
} from "@/app/api/features/property";
import {
  useRentRental,
  useLockRental,
} from "@/app/api/features/progress/progress.queries";
import { useCreateConversation } from "@/app/api/features/chat/chat.queries";
import { sanitizeConversationId } from "@/app/api/features/chat/chat.api";
import { hasAccessToken } from "@/app/lib/auth";
import { toast } from "react-toastify";
import { useAuth } from "@/app/components/context/AuthContext";
import BookInspectionModal from "@/app/components/BookInspectionModal";

function PropertyDesktopViewContent() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuth();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllTips, setShowAllTips] = useState(false);
  const [isBookInspectionsOpen, setisBookInspectionOpen] = useState(false)
  // const { mutate: handleBook, isPending } = useBookProperty();
  const { mutate: handleLock, isPending: isLocking } = useLockRental();
  const { mutate: handleRent, isPending: isRenting } = useRentRental();
  const { mutate: createConversation } = useCreateConversation();
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);

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
    ? `${property.User.full_name}`.trim()
    : "Verified Landlord";

  const access = hasAccessToken() as any;
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="mb-6 text-sm text-gray-500 font-medium">
          Properties / <span className="text-gray-900">{property.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Swiper modules={[Navigation, Thumbs]} spaceBetween={10} thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed
                  ? thumbsSwiper
                  : null,
            }}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} className="rounded-3xl">
              {property.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <div className="relative aspect-video w-full overflow-hidden rounded-3xl" onClick={() => {
                    setActiveIndex(index);
                    setOpen(true);
                  }}>
                    <Image src={img} alt={`image ${index + 1}`} width={500} height={700} className=" w-full object-cover" />
                  </div>
                </SwiperSlide>
              ))}
              <div className="absolute bottom-5 right-5 z-20 rounded-full bg-black/70 px-4 py-2 text-white">
                {activeIndex + 1}/{property.images.length}
              </div>
            </Swiper>

            <Swiper onSwiper={setThumbsSwiper} modules={[Thumbs, FreeMode]} watchSlidesProgress freeMode spaceBetween={10} slidesPerView={5} allowTouchMove touchRatio={1} scrollbar={{
              draggable: true,
              hide: false,
            }} breakpoints={{
              320: {
                slidesPerView: 3,
              },
              640: {
                slidesPerView: 4,
              },
              1024: {
                slidesPerView: 5,
              },
            }} className="mt-4 overflow-visible">
              {property.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <Image src={img} alt={`Thumbnail ${index + 1}`} width={100} height={100} className="h-24 w-full cursor-pointer rounded-xl object-cover" />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className=" grid grid-cols-2 gap-1.5">
              {property.videos.map((video, index) => (
                <div key={index} className="rounded-xl">
                  <video
                    src={video}
                    controls
                    className="w-full h-40 object-cover rounded-xl"
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
            <div className="sticky top-10 space-y-6 lg:top-24 h-fit">
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
                      handleRent(rentalId);

                    }}
                    disabled={
                      isRenting
                    }
                    className="flex items-center justify-center gap-3 w-full bg-green-600 border-2 border-none text-white font-black py-5 rounded-[24px] hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-orange-100 uppercase mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock className="inline-block mr-2" />
                    <span>
                      {isRenting
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

                      if (access?.verified === false) {
                        return false;
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
                      setisBookInspectionOpen(true);
                    }}
                    className="flex items-center justify-center gap-3 w-full bg-green-600 border-2 border-none text-white font-black py-5 rounded-[24px] hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-orange-100 uppercase mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CalendarDays />
                    Book Inspection
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
                      handleLock(rentalId);
                    }}
                    disabled={
                      isLocking
                    }
                    className="flex items-center justify-center gap-3 w-full bg-green-600 border-2 border-none text-white font-black py-5 rounded-[24px] hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-orange-100 uppercase mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock className="inline-block mr-2" />
                    <span>
                      {isLocking
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
                  {/* <button
                    type="button"
                    onClick={() => setisCompleteAccDetailsOpen(true)}
                    className="w-full bg-[#FF9800] text-white font-black py-5 rounded-[24px] hover:bg-[#F57C00] transition-all active:scale-95 shadow-lg shadow-orange-100 uppercase mt-2 cursor-pointer"
                  >
                    Back to Listings
                  </button> */}
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
        <BookInspectionModal isOpen={isBookInspectionsOpen} onClose={() => setisBookInspectionOpen(false)} id={property.id} />
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={activeIndex}
          plugins={[Zoom]}
          slides={property.images.map((img) => ({
            src: img,
          }))}
        />
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
